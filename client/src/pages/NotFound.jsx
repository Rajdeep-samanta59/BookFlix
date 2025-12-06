import { Link } from 'react-router-dom';
import { Home, MoveLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animated Ghost/Icon */}
        <div className="relative inline-block mb-8">
          <div className="text-9xl animate-bounce duration-[3000ms]">👻</div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-3 bg-black/30 rounded-[100%] blur-sm animate-pulse"></div>
        </div>

        {/* Glitch Effect Text */}
        <h1 className="text-8xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2 drop-shadow-lg tracking-tighter">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-6 tracking-wide">
          Page Not Found
        </h2>

        <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg">
          Oops! It seems like this page has vanished into thin air. maybe it was checked out and never returned?
        </p>

        {/* Call to Action */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200 group"
        >
          <MoveLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

export default NotFound;
