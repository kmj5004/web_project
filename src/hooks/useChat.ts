import { useState, useEffect } from 'react';
import { ChatRoom, ChatMessage } from '../types';

export const useChat = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRooms = localStorage.getItem('chatRooms');
    const storedMessages = localStorage.getItem('chatMessages');
    
    if (storedRooms) {
      setChatRooms(JSON.parse(storedRooms));
    }
    
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
    
    setLoading(false);
  }, []);

  const createChatRoom = (carId: string, buyerId: string, sellerId: string): ChatRoom => {
    const existingRoom = chatRooms.find(room => 
      room.carId === carId && room.buyerId === buyerId && room.sellerId === sellerId
    );
    
    if (existingRoom) {
      return existingRoom;
    }

    const newRoom: ChatRoom = {
      id: Date.now().toString(),
      carId,
      buyerId,
      sellerId,
      createdAt: new Date().toISOString(),
    };

    const updatedRooms = [...chatRooms, newRoom];
    setChatRooms(updatedRooms);
    localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));
    
    return newRoom;
  };

  const sendMessage = (roomId: string, senderId: string, receiverId: string, message: string, carId?: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      carId,
      senderId,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

    
    const updatedRooms = chatRooms.map(room => 
      room.id === roomId 
        ? { ...room, lastMessage: message, lastMessageTime: newMessage.timestamp }
        : room
    );
    setChatRooms(updatedRooms);
    localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));

    return newMessage;
  };

  const getMessagesByRoom = (roomId: string) => {
    const room = chatRooms.find(r => r.id === roomId);
    if (!room) return [];
    
    return messages.filter(msg => 
      (msg.senderId === room.buyerId && msg.receiverId === room.sellerId && msg.carId === room.carId) ||
      (msg.senderId === room.sellerId && msg.receiverId === room.buyerId && msg.carId === room.carId)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getUserChatRooms = (userId: string) => {
    return chatRooms.filter(room => 
      room.buyerId === userId || room.sellerId === userId
    ).sort((a, b) => 
      new Date(b.lastMessageTime || b.createdAt).getTime() - 
      new Date(a.lastMessageTime || a.createdAt).getTime()
    );
  };

  const markMessagesAsRead = (roomId: string, userId: string) => {
    const room = chatRooms.find(r => r.id === roomId);
    if (!room) return;

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