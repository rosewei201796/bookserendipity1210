import React from 'react';

interface IPhoneFrameProps {
  children: React.ReactNode;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#e0e0e0] flex items-center justify-center font-sans p-4 md:p-8">
      {/* iPhone Frame Mockup 
        - Outer Bezel: bg-black, rounded-[55px], heavy shadow
        - Inner Screen: rounded-[44px], overflow-hidden
      */}
      <div className="relative w-full max-w-[390px] h-[844px] bg-black rounded-[55px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] ring-4 ring-gray-800 border-[8px] border-black overflow-hidden flex flex-col select-none">
        
        {/* Notch / Dynamic Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[34px] w-[120px] bg-black rounded-b-3xl z-[60] pointer-events-none"></div>

        {/* Screen Content Container */}
        <div className="w-full h-full bg-white rounded-[44px] overflow-hidden relative flex flex-col">
          {children}
          
          {/* Home Indicator (Overlay on top of Nav) */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[130px] h-[5px] bg-black rounded-full z-50 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};
