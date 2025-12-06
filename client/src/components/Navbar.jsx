import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut, Bell, Search } from 'lucide-react';

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100">
      <div className="flex-1"></div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-6">
        {/* <div className="h-6 w-px bg-slate-200"></div> */}

        <button 
          onClick={logout} 
          className="flex items-center space-x-2 text-slate-500 hover:text-rose-600 transition-colors group"
        >
          <span className="text-sm font-medium">Logout</span>
          <LogOut size={18} className="transition-transform group-hover:bg-rose-50 rounded" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
