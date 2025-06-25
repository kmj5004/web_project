import React, { useState } from 'react';
import { Car } from '../types';
import { ArrowLeft, Calendar, Gauge, Fuel, MapPin, User, Phone, Heart, Share2, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';

interface CarDetailPageProps {
  car: Car;
  onBack: () => void;
  onChat: (carId: string) => void;
}

const CarDetailPage: React.FC<CarDetailPageProps> = ({ car, onBack, onChat }) => {
  const { user } = useAuth();
  const { createChatRoom } = useChat();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  const fuelTypeMap = {
    gasoline: '가솔린',
    diesel: '디젤',
    hybrid: '하이브리드',
    electric: '전기',
  };

  const transmissionMap = {
    manual: '수동',
    automatic: '자동',
  };

  const specs = [
    { label: '연식', value: `${car.year}년`, icon: Calendar },
    { label: '주행거리', value: `${car.mileage.toLocaleString()}km`, icon: Gauge },
    { label: '연료', value: fuelTypeMap[car.fuelType], icon: Fuel },
    { label: '변속기', value: transmissionMap[car.transmission], icon: Gauge },
    { label: '색상', value: car.color, icon: null },
    { label: '지역', value: car.location, icon: MapPin },
  ];

  const handleChatWithSeller = () => {
    if (!user) return;
    
    
    const chatRoom = createChatRoom(car.id, user.id, car.sellerId);
    onChat(car.id);
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>목록으로 돌아가기</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLiked(!liked)}
            className={`p-2 rounded-lg transition-colors ${
              liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative h-96">
              <img
                src={car.images[currentImageIndex]}
                alt={car.title}
                className="w-full h-full object-cover"
              />
              {car.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {car.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">차량 설명</h2>
            <p className="text-gray-600 leading-relaxed">{car.description}</p>
          </div>

          
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">차량 사양</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {spec.icon && <spec.icon className="w-5 h-5 text-blue-500" />}
                  <div>
                    <div className="text-sm text-gray-500">{spec.label}</div>
                    <div className="font-medium text-gray-800">{spec.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{car.title}</h1>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {car.price.toLocaleString()}만원
            </div>

            
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-800 mb-3">판매자 정보</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{car.sellerName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{car.sellerPhone}</span>
                </div>
              </div>
            </div>
          </div>

          
          <div className="space-y-3">
            <button
              onClick={handleChatWithSeller}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>판매자와 채팅하기</span>
            </button>

            <button className="w-full bg-white border-2 border-blue-600 text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>전화로 문의하기</span>
            </button>
          </div>

          
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
            <h3 className="font-medium text-gray-800 mb-4">차량 정보</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">등록일</span>
                <span className="font-medium text-gray-800">
                  {new Date(car.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">최근 수정</span>
                <span className="font-medium text-gray-800">
                  {new Date(car.updatedAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">차량 ID</span>
                <span className="font-medium text-gray-800">#{car.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;