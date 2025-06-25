import React, { useState } from 'react';
import { Sparkles, TrendingUp, Star, Filter } from 'lucide-react';
import { useCars } from '../hooks/useCars';
import { useAuth } from '../hooks/useAuth';
import CarCard from '../components/CarCard';
import { Car } from '../types';

interface RecommendationsPageProps {
  onCarSelect: (car: Car) => void;
}

const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ onCarSelect }) => {
  const { allCars } = useCars();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'budget' | 'luxury' | 'electric' | 'recent'>('all');

  const categories = [
    { id: 'all', name: '전체 추천', icon: Sparkles },
    { id: 'budget', name: '가성비 추천', icon: TrendingUp },
    { id: 'luxury', name: '프리미엄', icon: Star },
    { id: 'electric', name: '친환경', icon: Filter },
    { id: 'recent', name: '최신 등록', icon: TrendingUp },
  ];

  const getRecommendedCars = (category: string) => {
    let filtered = [...allCars];

    switch (category) {
      case 'budget':
        
        filtered = allCars.filter(car => car.price <= 2000).sort((a, b) => {
          const aValue = a.price / (a.mileage / 10000 + 1);
          const bValue = b.price / (b.mileage / 10000 + 1);
          return aValue - bValue;
        });
        break;
      case 'luxury':
        
        filtered = allCars.filter(car => car.price >= 3000).sort((a, b) => b.price - a.price);
        break;
      case 'electric':
        
        filtered = allCars.filter(car => car.fuelType === 'electric' || car.fuelType === 'hybrid');
        break;
      case 'recent':
        
        filtered = allCars.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        
        filtered = allCars.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }

    return filtered.slice(0, 6);
  };

  const recommendedCars = getRecommendedCars(selectedCategory);

  return (
    <div className="space-y-8">
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {user ? `${user.name}님을 위한` : '맞춤'} 추천 차량
        </h1>
        <p className="text-gray-600">
          {user ? '귀하의 취향과 예산에 맞는 차량을 추천해드립니다' : '다양한 조건의 추천 차량을 확인해보세요'}
        </p>
      </div>

      
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(category => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {categories.find(c => c.id === selectedCategory)?.name}
        </h2>

        {recommendedCars.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Sparkles className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">추천 차량이 없습니다</h3>
            <p className="text-gray-500">다른 카테고리를 선택해보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCars.map(car => (
              <CarCard
                key={car.id}
                car={car}
                onClick={() => onCarSelect(car)}
                showFavorite={true}
              />
            ))}
          </div>
        )}
      </div>

      
      {user && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">개인화된 구매 팁</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-blue-600 mb-2">💰 예산 관리</h4>
              <p>차량 구매 시 차량 가격 외에도 보험료, 유지보수 비용, 연료비를 고려하세요.</p>
            </div>
            <div>
              <h4 className="font-medium text-green-600 mb-2">🔍 구매 전 체크리스트</h4>
              <p>사고 이력, 정비 기록, 실제 주행거리를 꼭 확인하세요.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;