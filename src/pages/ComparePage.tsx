import React, { useState } from 'react';
import { useCars } from '../hooks/useCars';
import { Car } from '../types';
import { Plus, X, Calendar, Gauge, Fuel, MapPin } from 'lucide-react';

const ComparePage: React.FC = () => {
  const { allCars } = useCars();
  const [selectedCars, setSelectedCars] = useState<Car[]>([]);
  const [showCarSelector, setShowCarSelector] = useState(false);

  const addCarToCompare = (car: Car) => {
    if (selectedCars.length < 3 && !selectedCars.find(c => c.id === car.id)) {
      setSelectedCars(prev => [...prev, car]);
    }
    setShowCarSelector(false);
  };

  const removeCarFromCompare = (carId: string) => {
    setSelectedCars(prev => prev.filter(car => car.id !== carId));
  };

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

  const comparisonFields = [
    { key: 'price', label: '가격', format: (value: number) => `${value.toLocaleString()}만원` },
    { key: 'year', label: '연식', format: (value: number) => `${value}년` },
    { key: 'mileage', label: '주행거리', format: (value: number) => `${value.toLocaleString()}km` },
    { key: 'fuelType', label: '연료', format: (value: string) => fuelTypeMap[value as keyof typeof fuelTypeMap] },
    { key: 'transmission', label: '변속기', format: (value: string) => transmissionMap[value as keyof typeof transmissionMap] },
    { key: 'color', label: '색상', format: (value: string) => value },
    { key: 'location', label: '지역', format: (value: string) => value },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">차량 비교</h1>
        <p className="text-gray-600">최대 3대까지 차량을 비교할 수 있습니다</p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {selectedCars.map((car, index) => (
          <div key={car.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-gray-800">{car.title}</h3>
              <button
                onClick={() => removeCarFromCompare(car.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={car.images[0]}
              alt={car.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="space-y-2 text-sm text-gray-600">
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
            <div className="mt-4 text-right">
              <span className="text-2xl font-bold text-blue-600">{car.price.toLocaleString()}만원</span>
            </div>
          </div>
        ))}

        
        {selectedCars.length < 3 && (
          <button
            onClick={() => setShowCarSelector(true)}
            className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center"
          >
            <Plus className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-600">차량 추가</span>
          </button>
        )}
      </div>

      
      {selectedCars.length > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">비교 항목</th>
                  {selectedCars.map(car => (
                    <th key={car.id} className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      {car.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisonFields.map(field => (
                  <tr key={field.key}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{field.label}</td>
                    {selectedCars.map(car => {
                      let value: string | number;
                      switch (field.key) {
                        case 'price':
                        case 'year':
                        case 'mileage':
                          value = car[field.key] as number;
                          break;
                        case 'fuelType':
                        case 'transmission':
                        case 'color':
                        case 'location':
                          value = car[field.key] as string;
                          break;
                        default:
                          value = '';
                      }
                      return (
                        <td key={car.id} className="px-6 py-4 text-sm text-gray-600">
                          {field.format(value)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      
      {showCarSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">차량 선택</h3>
              <button
                onClick={() => setShowCarSelector(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCars
                  .filter(car => !selectedCars.find(c => c.id === car.id))
                  .map(car => (
                    <div
                      key={car.id}
                      onClick={() => addCarToCompare(car)}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      <img
                        src={car.images[0]}
                        alt={car.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-medium text-gray-800 text-sm truncate">{car.title}</h4>
                      <p className="text-blue-600 font-bold">{car.price.toLocaleString()}만원</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;