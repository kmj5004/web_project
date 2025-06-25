import React from 'react';
import { Car as CarType } from '../types';
import { Calendar, Gauge, Fuel, MapPin, Star } from 'lucide-react';

interface CarCardProps {
  car: CarType;
  onClick: () => void;
  showFavorite?: boolean;
}

const CarCard: React.FC<CarCardProps> = ({ car, onClick, showFavorite = false }) => {
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

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer transform hover:scale-[1.02]"
         onClick={onClick}>
      
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.images[0]}
          alt={car.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {car.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Star className="w-3 h-3" fill="currentColor" />
              <span>추천</span>
            </span>
          </div>
        )}
        {showFavorite && (
          <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Star className="w-4 h-4 text-orange-500" />
          </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-16"></div>
        <div className="absolute bottom-3 left-3 text-white">
          <div className="text-2xl font-bold">{car.price.toLocaleString()}만원</div>
        </div>
      </div>

      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
          {car.title}
        </h3>
        
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{car.year}년</span>
          </div>
          <div className="flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-green-500" />
            <span>{car.mileage.toLocaleString()}km</span>
          </div>
          <div className="flex items-center space-x-2">
            <Fuel className="w-4 h-4 text-orange-500" />
            <span>{fuelTypeMap[car.fuelType]}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>{car.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {transmissionMap[car.transmission]} • {car.color}
          </div>
          <div className="text-sm text-gray-500">
            {car.sellerName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;