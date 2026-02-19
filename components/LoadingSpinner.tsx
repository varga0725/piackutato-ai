import React, { useState, useEffect } from 'react';

const messages = [
  "Adatok gyűjtése a webről...",
  "Versenytársak azonosítása...",
  "Célpiac profiljának megalkotása...",
  "Piaci trendek elemzése...",
  "Stratégiai javaslatok kidolgozása...",
  "Majdnem kész..."
];

interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if(message) return; // Don't cycle if a specific message is provided

    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [message]);
    
  return (
    <div className="text-center p-6 w-full max-w-md">
       <svg className="animate-spin h-8 w-8 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
       </svg>
      <p className="text-md text-muted-foreground font-medium transition-opacity duration-500">
        {message || messages[currentMessageIndex]}
      </p>
    </div>
  );
};