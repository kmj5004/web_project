import React, { useState } from 'react';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import AuthForm from './components/AuthForm';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import RegisterPage from './pages/RegisterPage';
import ComparePage from './pages/ComparePage';
import ChatPage from './pages/ChatPage';
import RecommendationsPage from './pages/RecommendationsPage';
import CommunityPage from './pages/CommunityPage';
import { Car } from './types';

// 메인 앱 컴포넌트 - 전체 애플리케이션의 진입점
function App() {
  // 인증 상태 관리 훅 사용
  const auth = useAuthProvider();
  
  // 현재 페이지 상태 관리 (홈, 차량상세, 차량등록, 모델비교, 채팅, 추천, 커뮤니티)
  const [currentPage, setCurrentPage] = useState('home');
  
  // 선택된 차량 정보 상태 관리
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // 차량 선택 시 호출되는 핸들러 - 차량 상세 페이지로 이동
  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
    setCurrentPage('car-detail');
  };

  // 차량 상세 페이지에서 채팅 버튼 클릭 시 호출되는 핸들러
  const handleChatFromCar = (carId: string) => {
    setCurrentPage('chat');
  };

  // 현재 페이지에 따라 해당 컴포넌트를 렌더링하는 함수
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onCarSelect={handleCarSelect} />;
      case 'car-detail':
        return selectedCar ? (
          <CarDetailPage 
            car={selectedCar} 
            onBack={() => setCurrentPage('home')}
            onChat={handleChatFromCar}
          />
        ) : (
          <HomePage onCarSelect={handleCarSelect} />
        );
      case 'register':
        return <RegisterPage />;
      case 'compare':
        return <ComparePage />;
      case 'chat':
        return <ChatPage />;
      case 'recommendations':
        return <RecommendationsPage onCarSelect={handleCarSelect} />;
      case 'community':
        return <CommunityPage />;
      default:
        return <HomePage onCarSelect={handleCarSelect} />;
    }
  };

  // 로그인하지 않은 경우 로그인 폼 표시
  if (!auth.isAuthenticated) {
    return (
      <AuthContext.Provider value={auth}>
        <AuthForm />
      </AuthContext.Provider>
    );
  }

  // 로그인된 경우 메인 레이아웃과 현재 페이지 컴포넌트 렌더링
  return (
    <AuthContext.Provider value={auth}>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;