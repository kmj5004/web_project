import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Car, Phone } from 'lucide-react';
import { useCars } from '../hooks/useCars';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { geminiService } from '../services/geminiService';


interface BotMessage {
  id: string;
  type: 'user' | 'bot'; 
  content: string;
  timestamp: Date;
}


interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string; 
  carId?: string; 
}

const ChatPage: React.FC = () => {
  const { cars } = useCars();
  const { user } = useAuth();
  const { chatRooms, getUserChatRooms, getMessagesByRoom, sendMessage, createChatRoom } = useChat();

  const [activeTab, setActiveTab] = useState<'bot' | 'seller'>('bot');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  
  const [botMessages, setBotMessages] = useState<BotMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: '안녕하세요! CarMarket AI 상담사입니다. 중고차 구매, 판매, 가격 문의 등 어떤 도움이 필요하신가요? 😊',
      timestamp: new Date(),
    }
  ]);

  
  const userChatRooms = user ? getUserChatRooms(user.id) : [];

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  
  useEffect(() => {
    scrollToBottom();
  }, [botMessages, selectedRoom]);

  
  useEffect(() => {
    console.log('ChatPage 마운트됨');
    const status = geminiService.getStatus();
    console.log('GeminiService 상태:', status);

    geminiService.testConnection().then(isConnected => {
      console.log('Gemini API 연결 상태:', isConnected);
    }).catch(err => {
      console.error('Gemini API 연결 테스트 실패:', err);
    });
  }, []);

  
  const handleBotMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) {
      console.log('입력값이 비어있습니다.');
      return;
    }

    console.log('Bot 메시지 전송 시작:', trimmedInput);

    const userMessage: BotMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };

    setBotMessages(prev => [...prev, userMessage]); 
    setInputValue(''); 
    setIsTyping(true); 

    try {
      console.log('Gemini API 호출 중...');
      const status = geminiService.getStatus();
      console.log('API 호출 전 서비스 상태:', status);

      const response = await geminiService.generateResponse(trimmedInput);
      console.log('Gemini API 응답 받음:', response);

      
      const delay = 1000 + Math.random() * 1000;
      setTimeout(() => {
        const botResponse: BotMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response,
          timestamp: new Date(),
        };

        setBotMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        console.log('Bot 응답 추가됨');
      }, delay);

    } catch (error) {
      console.error('Bot 메시지 처리 에러:', error);

      setTimeout(() => {
        const botResponse: BotMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          timestamp: new Date(),
        };

        setBotMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        console.log('에러 응답 추가됨');
      }, 1000);
    }
  };

  
  const handleSellerMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || !selectedRoom || !user) {
      console.log('판매자 메시지 전송 조건 미충족:', {
        hasInput: !!trimmedInput,
        hasRoom: !!selectedRoom,
        hasUser: !!user
      });
      return;
    }

    const room = chatRooms.find(r => r.id === selectedRoom);
    if (!room) {
      console.log('채팅방을 찾을 수 없습니다:', selectedRoom);
      return;
    }

    
    const receiverId = room.buyerId === user.id ? room.sellerId : room.buyerId;
    const carInfo = cars.find(c => c.id === room.carId);

    
    sendMessage(selectedRoom, user.id, receiverId, trimmedInput, room.carId);
    setInputValue(''); 
    scrollToBottom(); 

    setIsTyping(true); 

    try {
      const aiResponse = await geminiService.generateChatSuggestion(
          carInfo || { title: "선택된 차량", price: "알 수 없음", year: "알 수 없음", mileage: "알 수 없음", location: "알 수 없음" },
          trimmedInput
      );

      
      
      sendMessage(selectedRoom, receiverId, user.id, aiResponse, room.carId); 
      setIsTyping(false); 
      scrollToBottom(); 
      console.log('AI 자동 응답 완료 (상대방 메시지로 표시):', aiResponse.substring(0, 50) + '...');

    } catch (error) {
      console.error('판매자 채팅 AI 자동 응답 생성 에러:', error);
      setIsTyping(false); 
      
      
    }
  };

  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('Enter 키 입력됨, 활성 탭:', activeTab);

      if (activeTab === 'bot') {
        handleBotMessage();
      } else {
        handleSellerMessage();
      }
    }
  };

  
  const handleSendClick = () => {
    console.log('전송 버튼 클릭됨, 활성 탭:', activeTab);

    if (activeTab === 'bot') {
      handleBotMessage();
    } else {
      handleSellerMessage();
    }
  };

  
  const quickQuestions = [
    '차량 가격이 궁금해요',
    '현대 아반떼 정보 알려주세요',
    '전기차 추천해주세요',
    '차량 구매 절차가 궁금해요',
    '중고차 점검 포인트는?',
    '보험 이전은 어떻게 하나요?',
  ];

  
  const getRoomInfo = (roomId: string) => {
    const room = chatRooms.find(r => r.id === roomId);
    if (!room) return null;

    const car = cars.find(c => c.id === room.carId);
    const otherUserId = room.buyerId === user?.id ? room.sellerId : room.buyerId;
    const otherUserName = room.buyerId === user?.id ? car?.sellerName : '구매희망자';

    return { room, car, otherUserName };
  };

  
  const isSendDisabled = () => {
    const hasInput = inputValue.trim().length > 0;

    if (activeTab === 'bot') {
      return !hasInput || isTyping;
    } else {
      
      return !hasInput || !selectedRoom || isTyping;
    }
  };

  return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">채팅</h1>
          <p className="text-gray-600">AI 상담사와 대화하거나 판매자와 직접 소통하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              
              <div className="flex border-b">
                <button
                    onClick={() => {
                      console.log('AI 상담 탭 클릭됨');
                      setActiveTab('bot');
                      setIsTyping(false);
                    }}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'bot'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <span>AI 상담</span>
                  </div>
                </button>
                <button
                    onClick={() => {
                      console.log('판매자 채팅 탭 클릭됨');
                      setActiveTab('seller');
                      setIsTyping(false);
                    }}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'seller'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>판매자 채팅</span>
                  </div>
                </button>
              </div>

              
              <div className="h-96 overflow-y-auto">
                {activeTab === 'seller' && (
                    <div className="p-4 space-y-2">
                      {userChatRooms.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">채팅 내역이 없습니다</p>
                          </div>
                      ) : (
                          userChatRooms.map((room) => {
                            const roomInfo = getRoomInfo(room.id);
                            if (!roomInfo) return null;

                            return (
                                <button
                                    key={room.id}
                                    onClick={() => {
                                      console.log('채팅방 선택됨:', room.id);
                                      setSelectedRoom(room.id);
                                      setIsTyping(false);
                                    }}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                                        selectedRoom === room.id
                                            ? 'bg-blue-50 border border-blue-200'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                      <Car className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-gray-800 truncate">
                                        {roomInfo.otherUserName}
                                      </p>
                                      <p className="text-sm text-gray-600 truncate">
                                        {roomInfo.car?.title}
                                      </p>
                                      {room.lastMessage && (
                                          <p className="text-xs text-gray-500 truncate">
                                            {room.lastMessage}
                                          </p>
                                      )}
                                    </div>
                                  </div>
                                </button>
                            );
                          })
                      )}
                    </div>
                )}
              </div>
            </div>
          </div>

          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden h-[600px] flex flex-col">
              
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    {activeTab === 'bot' ? (
                        <Bot className="w-6 h-6" />
                    ) : (
                        <MessageCircle className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold">
                      {activeTab === 'bot' ? 'AI 상담사' :
                          selectedRoom ? getRoomInfo(selectedRoom)?.otherUserName : '채팅방을 선택하세요'}
                    </h2>
                    <p className="text-sm text-blue-100">
                      {activeTab === 'bot' ? '언제든 궁금한 점을 물어보세요' :
                          selectedRoom ? getRoomInfo(selectedRoom)?.car?.title : ''}
                    </p>
                  </div>
                </div>
              </div>

              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === 'bot' ? (
                    <>
                      {botMessages.map((message) => (
                          <div
                              key={message.id}
                              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex items-start space-x-3 max-w-[80%] ${
                                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                            }`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  message.type === 'user'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-gray-100 text-gray-600'
                              }`}>
                                {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                              </div>
                              <div className={`p-3 rounded-2xl ${
                                  message.type === 'user'
                                      ? 'bg-blue-600 text-white rounded-br-md'
                                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                              }`}>
                                <p className="whitespace-pre-line">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {message.timestamp.toLocaleTimeString('ko-KR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                      ))}

                      {isTyping && ( 
                          <div className="flex justify-start">
                            <div className="flex items-start space-x-3 max-w-[80%]">
                              <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
                                <Bot className="w-4 h-4" />
                              </div>
                              <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-md">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                      )}
                    </>
                ) : selectedRoom ? ( 
                    getMessagesByRoom(selectedRoom).map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start space-x-3 max-w-[80%] ${
                              message.senderId === user?.id ? 'flex-row-reverse space-x-reverse' : ''
                          }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.senderId === user?.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600'
                            }`}>
                              <User className="w-4 h-4" />
                            </div>
                            <div className={`p-3 rounded-2xl ${
                                message.senderId === user?.id
                                    ? 'bg-blue-600 text-white rounded-br-md'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                            }`}>
                              <p>{message.message}</p>
                              <p className={`text-xs mt-1 ${
                                  message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>채팅방을 선택하세요</p>
                      </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              
              {activeTab === 'bot' && botMessages.length <= 1 && (
                  <div className="px-4 pb-2">
                    <p className="text-sm text-gray-600 mb-2">자주 묻는 질문:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((question, index) => (
                          <button
                              key={index}
                              onClick={() => {
                                console.log('퀵 질문 클릭됨:', question);
                                setInputValue(question);
                              }}
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            {question}
                          </button>
                      ))}
                    </div>
                  </div>
              )}

              
              {(activeTab === 'bot' || selectedRoom) && (
                  <div className="p-4 border-t">
                    
                    {activeTab === 'seller' && isTyping && (
                        <div className="flex justify-start items-center p-3 mb-3 bg-gray-100 rounded-lg text-sm">
                          <User className="w-5 h-5 text-gray-600 mr-2" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="ml-2 text-gray-700">답장 입력 중이에요...</span>
                        </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                              setInputValue(e.target.value);
                            }}
                            onKeyPress={handleKeyPress}
                            placeholder="메시지를 입력하세요..."
                            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            onClick={handleSendClick}
                            disabled={isSendDisabled()}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default ChatPage;