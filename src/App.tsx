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

function App() {
  const auth = useAuthProvider();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
    setCurrentPage('car-detail');
  };

  const handleChatFromCar = (carId: string) => {
    setCurrentPage('chat');
  };

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

  if (!auth.isAuthenticated) {
    return (
      <AuthContext.Provider value={auth}>
        <AuthForm />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;