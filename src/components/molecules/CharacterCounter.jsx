import React from 'react';

const CharacterCounter = ({ currentLength, maxLength, warnThreshold = 0.9 }) => {
  const percentage = (currentLength / maxLength);
  const strokeDasharray = `${percentage * 88} 88`; // 2 * PI * r (r=14), so circumference is ~88

  let colorClass = 'text-gray-600';
  if (currentLength > maxLength) {
    colorClass = 'text-error';
  } else if (percentage > warnThreshold) {
    colorClass = 'text-warning';
  } else {
    colorClass = 'text-primary';
  }

  return (
    <div className="flex justify-between items-center mt-2">
      <span className="text-gray-400 text-sm">
        {currentLength}/{maxLength}
      </span>
      {percentage > 0.8 && ( // Only show meter if close to limit or over
        <div className="w-8 h-8 relative">
          <svg className="w-8 h-8 transform -rotate-90">
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-600"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={strokeDasharray}
              className={colorClass}
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CharacterCounter;