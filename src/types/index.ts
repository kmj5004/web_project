export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
  avatar?: string;
  bio?: string;
}

export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  transmission: 'manual' | 'automatic';
  color: string;
  location: string;
  description: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
}

export interface ChatMessage {
  id: string;
  carId?: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ChatRoom {
  id: string;
  carId: string;
  buyerId: string;
  sellerId: string;
  lastMessage?: string;
  lastMessageTime?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: 'review' | 'question' | 'tip' | 'general';
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedBy: string[];
  views: number;
  images?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedBy: string[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}