import React from 'react';
import { Check, Bus, CreditCard, MapPin, Calendar } from 'lucide-react';

interface BookingStepsProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Chọn tuyến', icon: MapPin },
  { id: 2, name: 'Chọn chuyến', icon: Calendar },
  { id: 3, name: 'Chọn ghế', icon: Bus },
  { id: 4, name: 'Thanh toán', icon: CreditCard },
];

const BookingSteps: React.FC<BookingStepsProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-center justify-between">
          {/* Progress bar background */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200"></div>
          
          {/* Active progress bar */}
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>

          {/* Steps */}
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="relative flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-blue-600 border-blue-600' 
                      : isActive
                        ? 'bg-white border-blue-600'
                        : 'bg-white border-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <StepIcon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  )}
                </div>
                <p className={`mt-2 text-sm font-medium ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {step.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingSteps; 