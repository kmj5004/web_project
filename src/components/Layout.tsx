import React from 'react';
import { Car, User, MessageCircle, Heart, Search, Plus, LogOut, Menu, X, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// 레이아웃 컴포넌트의 props 타입 정의
interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

// 메인 레이아웃 컴포넌트 - 네비게이션 바와 메인 콘텐츠 영역 구성
const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  // 인증 훅 사용 (사용자 정보, 로그아웃 기능)
  const { user, logout } = useAuth();
  
  // 디버깅을 위한 콘솔 출력
  console.log('Layout - user object:', user);
  console.log('Layout - user type:', typeof user);
  console.log('Layout - user keys:', user ? Object.keys(user) : 'null');
  
  // 모바일 메뉴 열림/닫힘 상태 관리
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // 네비게이션 메뉴 항목 정의
  const navigation = [
    { name: '홈', icon: Search, id: 'home' },
    { name: '차량등록', icon: Plus, id: 'register' },
    { name: '모델비교', icon: Car, id: 'compare' },
    { name: '추천', icon: Heart, id: 'recommendations' },
    { name: '커뮤니티', icon: Users, id: 'community' },
    { name: '채팅', icon: MessageCircle, id: 'chat' },
  ];

  return (
    // 전체 페이지 컨테이너 - 그라데이션 배경 적용
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      {/* 상단 네비게이션 바 - 반투명 배경과 블러 효과 */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* 로고 영역 */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Car className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">CarMarket</span>
              </div>
              
              {/* 데스크톱 네비게이션 메뉴 */}
              <div className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 사용자 정보 및 로그아웃 버튼 영역 */}
            <div className="flex items-center space-x-4">
              {/* 데스크톱 사용자 정보 표시 */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {user && typeof user === 'object' && user !== null && 'name' in user ? 
                      (typeof user.name === 'string' ? user.name : 
                       typeof user.name === 'object' && user.name !== null && 'name' in user.name ? user.name.name : '사용자') 
                      : '사용자'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>
              </div>

              {/* 모바일 메뉴 토글 버튼 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 드롭다운 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-4 space-y-2">
              {/* 모바일 네비게이션 메뉴 */}
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ))}
              
              {/* 모바일 사용자 정보 및 로그아웃 */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-600">
                  <User className="w-5 h-5" />
                  <span>
                    {user && typeof user === 'object' && user !== null && 'name' in user ? 
                      (typeof user.name === 'string' ? user.name : 
                       typeof user.name === 'object' && user.name !== null && 'name' in user.name ? user.name.name : '사용자') 
                      : '사용자'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 메인 콘텐츠 영역 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;