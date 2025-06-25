// 사용자 정보 타입 정의
export interface User {
  id: string; // 사용자 고유 ID
  email: string; // 이메일 주소
  name: string; // 사용자 이름
  phone: string; // 전화번호
  createdAt: string; // 계정 생성일시
  avatar?: string; // 프로필 이미지 URL (선택사항)
  bio?: string; // 자기소개 (선택사항)
}

// 차량 정보 타입 정의
export interface Car {
  id: string; // 차량 고유 ID
  title: string; // 차량 제목 (예: "2020 현대 아반떼 CN7")
  brand: string; // 브랜드 (예: "현대", "기아", "BMW")
  model: string; // 모델명 (예: "아반떼", "K5", "3시리즈")
  year: number; // 연식 (예: 2020)
  price: number; // 가격 (만원 단위)
  mileage: number; // 주행거리 (km)
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric'; // 연료 타입
  transmission: 'manual' | 'automatic'; // 변속기 타입
  color: string; // 색상
  location: string; // 지역
  description: string; // 차량 설명
  images: string[]; // 차량 이미지 URL 배열
  sellerId: string; // 판매자 ID
  sellerName: string; // 판매자 이름
  sellerPhone: string; // 판매자 전화번호
  createdAt: string; // 등록일시
  updatedAt: string; // 수정일시
  featured: boolean; // 추천 차량 여부
}

// 채팅 메시지 타입 정의
export interface ChatMessage {
  id: string; // 메시지 고유 ID
  carId?: string; // 관련 차량 ID (선택사항)
  senderId: string; // 발신자 ID
  receiverId: string; // 수신자 ID
  message: string; // 메시지 내용
  timestamp: string; // 전송일시
  read: boolean; // 읽음 여부
}

// 채팅방 타입 정의
export interface ChatRoom {
  id: string; // 채팅방 고유 ID
  carId: string; // 관련 차량 ID
  buyerId: string; // 구매자 ID
  sellerId: string; // 판매자 ID
  lastMessage?: string; // 마지막 메시지 내용 (선택사항)
  lastMessageTime?: string; // 마지막 메시지 시간 (선택사항)
  createdAt: string; // 채팅방 생성일시
}

// 커뮤니티 게시글 타입 정의
export interface Post {
  id: string; // 게시글 고유 ID
  title: string; // 게시글 제목
  content: string; // 게시글 내용
  category: 'review' | 'question' | 'tip' | 'general'; // 카테고리 (구매후기, 질문, 팁/노하우, 자유게시판)
  authorId: string; // 작성자 ID
  authorName: string; // 작성자 이름
  createdAt: string; // 작성일시
  updatedAt: string; // 수정일시
  likes: number; // 좋아요 수
  likedBy: string[]; // 좋아요를 누른 사용자 ID 배열
  views: number; // 조회수
  images?: string[]; // 첨부 이미지 URL 배열 (선택사항)
}

// 커뮤니티 댓글 타입 정의
export interface Comment {
  id: string; // 댓글 고유 ID
  postId: string; // 게시글 ID
  authorId: string; // 작성자 ID
  authorName: string; // 작성자 이름
  content: string; // 댓글 내용
  createdAt: string; // 작성일시
  updatedAt: string; // 수정일시
  likes: number; // 좋아요 수
  likedBy: string[]; // 좋아요를 누른 사용자 ID 배열
}

// 인증 컨텍스트 타입 정의
export interface AuthContextType {
  user: User | null; // 현재 로그인한 사용자 정보
  login: (email: string, password: string) => Promise<boolean>; // 로그인 함수
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>; // 회원가입 함수
  logout: () => void; // 로그아웃 함수
  isAuthenticated: boolean; // 로그인 상태
}