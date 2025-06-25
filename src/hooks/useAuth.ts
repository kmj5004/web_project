import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 사용자 정보 타입 정의
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 인증 컨텍스트 사용을 위한 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 인증 컨텍스트 제공자 컴포넌트
interface AuthProviderProps {
  children: ReactNode;
}

// 인증 상태 관리 훅
export const useAuthProvider = () => {
  // 사용자 정보 상태
  const [user, setUser] = useState<User | null>(null);
  
  // 인증 상태 (로그인 여부)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 컴포넌트 마운트 시 로컬스토리지에서 사용자 정보 복원
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  // 로그인 함수 - 이메일과 비밀번호로 로그인
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // 실제 환경에서는 API 호출을 통해 인증 처리
      // 현재는 샘플 사용자 데이터로 시뮬레이션
      const sampleUsers = [
        { id: '1', name: '김철수', email: 'kim@example.com', phone: '010-1234-5678' },
        { id: '2', name: '박영희', email: 'park@example.com', phone: '010-2345-6789' },
        { id: '3', name: '이민준', email: 'lee@example.com', phone: '010-3456-7890' },
        { id: '4', name: '최지영', email: 'choi@example.com', phone: '010-4567-8901' },
        { id: '5', name: '정우진', email: 'jung@example.com', phone: '010-5678-9012' },
        { id: '6', name: '윤지훈', email: 'yoon@example.com', phone: '010-6789-0123' },
        { id: '7', name: '한선우', email: 'han@example.com', phone: '010-7890-1234' },
      ];

      // 입력된 이메일로 사용자 찾기
      const foundUser = sampleUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password') { // 실제 환경에서는 해시된 비밀번호 비교
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('로그인 에러:', error);
      return false;
    }
  };

  // 회원가입 함수 - 이름, 이메일, 전화번호, 비밀번호로 회원가입
  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    try {
      // 실제 환경에서는 API 호출을 통해 회원가입 처리
      // 현재는 로컬스토리지에 저장하는 방식으로 시뮬레이션
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        phone,
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('회원가입 에러:', error);
      return false;
    }
  };

  // 로그아웃 함수 - 사용자 정보 초기화 및 로컬스토리지 정리
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };
};

export { AuthContext };