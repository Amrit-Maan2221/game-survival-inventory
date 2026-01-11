function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-[9999]">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
        {/* Spinning Ring */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-bold tracking-widest text-gray-900 uppercase animate-pulse">
        Initializing Survival...
      </p>
    </div>
  );
}

export default PageLoader;