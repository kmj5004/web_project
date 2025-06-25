import { useState, useEffect } from 'react';
import { ChatRoom, ChatMessage } from '../types';

// 채팅 관련 상태 관리 훅 - 채팅방, 메시지 관리
export const useChat = () => {
  // 채팅방 목록 상태
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  
  // 메시지 목록 상태
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 로컬스토리지에서 채팅 데이터 복원
  useEffect(() => {
    // 저장된 채팅방 데이터 복원
    const storedRooms = localStorage.getItem('chatRooms');
    if (storedRooms) {
      setChatRooms(JSON.parse(storedRooms));
    }
    
    // 저장된 메시지 데이터 복원
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
    
    setLoading(false);
  }, []);

  // 새 채팅방 생성 함수
  const createChatRoom = (carId: string, buyerId: string, sellerId: string): ChatRoom => {
    // 이미 존재하는 채팅방인지 확인
    const existingRoom = chatRooms.find(room => 
      room.carId === carId && room.buyerId === buyerId && room.sellerId === sellerId
    );
    
    if (existingRoom) {
      return existingRoom;
    }

    // 새 채팅방 생성
    const newRoom: ChatRoom = {
      id: Date.now().toString(),
      carId,
      buyerId,
      sellerId,
      createdAt: new Date().toISOString(),
    };

    // 채팅방 목록에 추가하고 로컬스토리지에 저장
    const updatedRooms = [...chatRooms, newRoom];
    setChatRooms(updatedRooms);
    localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));
    
    return newRoom;
  };

  // 메시지 전송 함수
  const sendMessage = (roomId: string, senderId: string, receiverId: string, message: string, carId?: string) => {
    // 새 메시지 객체 생성
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      carId,
      senderId,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // 메시지 목록에 추가하고 로컬스토리지에 저장
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

    // 채팅방의 마지막 메시지 정보 업데이트
    const updatedRooms = chatRooms.map(room => 
      room.id === roomId 
        ? { ...room, lastMessage: message, lastMessageTime: newMessage.timestamp }
        : room
    );
    setChatRooms(updatedRooms);
    localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));

    return newMessage;
  };

  // 특정 채팅방의 메시지 목록 조회 함수
  const getMessagesByRoom = (roomId: string) => {
    const room = chatRooms.find(r => r.id === roomId);
    if (!room) return [];
    
    // 해당 채팅방의 구매자와 판매자 간의 메시지만 필터링하고 시간순 정렬
    return messages.filter(msg => 
      (msg.senderId === room.buyerId && msg.receiverId === room.sellerId) ||
      (msg.senderId === room.sellerId && msg.receiverId === room.buyerId)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  // 특정 사용자의 채팅방 목록 조회 함수
  const getUserChatRooms = (userId: string) => {
    // 사용자가 구매자 또는 판매자인 채팅방들을 찾아서 최신순으로 정렬
    return chatRooms.filter(room => 
      room.buyerId === userId || room.sellerId === userId
    ).sort((a, b) => 
      new Date(b.lastMessageTime || b.createdAt).getTime() - 
      new Date(a.lastMessageTime || a.createdAt).getTime()
    );
  };

  // 메시지 읽음 처리 함수
  const markMessagesAsRead = (roomId: string, userId: string) => {
    const room = chatRooms.find(r => r.id === roomId);
    if (!room) return;

    // 해당 채팅방에서 사용자가 받은 메시지들을 읽음 처리
    const updatedMessages = messages.map(msg => 
      msg.receiverId === userId && 
      ((msg.senderId === room.buyerId && msg.receiverId === room.sellerId) ||
       (msg.senderId === room.sellerId && msg.receiverId === room.buyerId)) &&
      msg.carId === room.carId
        ? { ...msg, read: true }
        : msg
    );
    
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
  };

  return {
    chatRooms,
    messages,
    loading,
    createChatRoom,
    sendMessage,
    getMessagesByRoom,
    getUserChatRooms,
    markMessagesAsRead,
  };
};