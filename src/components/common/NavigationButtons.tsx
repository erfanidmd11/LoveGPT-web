import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  loading?: boolean;
  disabledNext?: boolean;
  nextLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack = () => {},
  onNext = () => {},
  loading = false,
  disabledNext = false,
  nextLabel = 'Next',
  showBack = true,
  showNext = true,
}) => {
  return (
    <div className="mt-8 w-full flex justify-between items-center sticky bottom-0 bg-white py-4 z-10 border-t">
      {showBack ? (
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl text-base font-medium hover:bg-gray-300 transition-all"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      ) : <div />}

      {showNext && (
        <button
          onClick={onNext}
          disabled={disabledNext || loading}
          className="flex items-center gap-2 justify-center bg-pink-500 text-white px-6 py-3 rounded-xl text-base font-medium hover:bg-pink-600 disabled:opacity-50 transition-all"
        >
          {loading ? 'Loading...' : (
            <>
              {nextLabel}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
