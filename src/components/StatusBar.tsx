
export const StatusBar = () => (
  <div className="w-full h-12 flex items-center justify-between px-6 pt-2 bg-white z-50 absolute top-0 left-0 border-b-0">
    <span className="font-bold text-sm tracking-wide text-black">9:41</span>
    <div className="flex items-center gap-1.5">
      <div className="flex gap-[2px] items-end h-3">
        <div className="w-1 h-1 bg-black"></div>
        <div className="w-1 h-2 bg-black"></div>
        <div className="w-1 h-3 bg-black"></div>
        <div className="w-1 h-2 bg-gray-300"></div>
      </div>
      <div className="w-5 h-3 border-2 border-black relative">
         <div className="absolute inset-0 bg-black w-[80%] h-full"></div>
      </div>
    </div>
  </div>
);

