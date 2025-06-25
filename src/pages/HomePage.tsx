import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Filter, SlidersHorizontal, Grid, List, Loader2 } from 'lucide-react';
import { useCars } from '../hooks/useCars';
import CarCard from '../components/CarCard';
import { Car } from '../types';

interface HomePageProps {
  onCarSelect: (car: Car) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onCarSelect }) => {
  const { allCars, loading, getFilteredCars } = useCars();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    fuelType: '',
    transmission: '',
    maxMileage: '',
  });

  const filteredCars = getFilteredCars({
    searchTerm,
    brand: filters.brand || undefined,
    minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
    minYear: filters.minYear ? parseInt(filters.minYear) : undefined,
    maxYear: filters.maxYear ? parseInt(filters.maxYear) : undefined,
    fuelType: filters.fuelType || undefined,
    transmission: filters.transmission || undefined,
    maxMileage: filters.maxMileage ? parseInt(filters.maxMileage) : undefined,
  });

  const featuredCars = allCars.filter(car => car.featured) || [];
  const brands = [...new Set(allCars.map(car => car.brand))];

  const displayedCars = filteredCars.slice(0, 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          원하는 중고차를 찾아보세요
        </h1>
        <p className="text-lg text-blue-100 mb-6">
          검증된 중고차만을 엄선하여 안전한 거래를 보장합니다
        </p>

        
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="브랜드, 모델명으로 검색하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>필터</span>
          </button>
          <span className="text-sm text-gray-600">
            {displayedCars.length}개의 차량
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      
      {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">브랜드</label>
              <select
                value={filters.brand}
                onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">모든 브랜드</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">최소 가격 (만원)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">최대 가격 (만원)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">연료 타입</label>
              <select
                value={filters.fuelType}
                onChange={(e) => setFilters(prev => ({ ...prev, fuelType: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">모든 연료</option>
                <option value="gasoline">가솔린</option>
                <option value="diesel">디젤</option>
                <option value="hybrid">하이브리드</option>
                <option value="electric">전기</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setFilters({
                brand: '', minPrice: '', maxPrice: '', minYear: '', maxYear: '',
                fuelType: '', transmission: '', maxMileage: ''
              })}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              필터 초기화
            </button>
          </div>
        </div>
      )}

      
      {featuredCars.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">추천 차량</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.slice(0, 6).map(car => (
              <CarCard
                key={car.id}
                car={car}
                onClick={() => onCarSelect(car)}
                showFavorite={true}
              />
            ))}
          </div>
        </div>
      )}

      
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {filteredCars.length > 0 ? '검색 결과' : '전체 차량'}
        </h2>

        {displayedCars.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 검색어나 필터를 시도해보세요</p>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {displayedCars.map(car => (
                <CarCard
                  key={car.id}
                  car={car}
                  onClick={() => onCarSelect(car)}
                  showFavorite={true}
                />
              ))}
            </div>

            
            <div className="text-center py-8">
              <p className="text-gray-500">모든 차량을 확인했습니다. (총 {allCars.length}대)</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
