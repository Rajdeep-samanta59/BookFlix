import { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, Settings, ArrowLeftRight, BarChart3, Library } from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const [membershipData, setMembershipData] = useState(null);

  useEffect(() => {
    const fetchMembership = async () => {
      if (user) {
        try {
          // Note: getMembership uses memberId (user._id) to find membership
          const { data } = await axios.get(`http://localhost:5000/api/members/${user._id}`, {
             headers: { Authorization: `Bearer ${user.token}` }
          });
          setMembershipData(data);
        } catch (error) {
           // If 404 or error, assume no active membership
           setMembershipData(null);
        }
      }
    };
    fetchMembership();
  }, [user]);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <ArrowLeftRight size={20} /> },
  ];

  // Insert Maintenance and Reports if admin
  if (user?.role === 'admin') {
    navItems.splice(1, 0, { path: '/maintenance', label: 'Maintenance', icon: <Settings size={20} /> });
    navItems.push({ path: '/reports', label: 'Reports', icon: <BarChart3 size={20} /> });
  }

  const getStatusColor = (status) => {
      if (status === 'active') return 'bg-green-500';
      if (status === 'expired') return 'bg-red-500';
      if (status === 'cancelled') return 'bg-gray-500';
      return 'bg-blue-500';
  };

  const getExpiryMonth = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shadow-xl">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="bg-red-600 p-2 rounded-lg shadow-lg shadow-red-500/20">
          <Library size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-wide">
          Book<span className="text-red-500">Flix</span>
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span className="transition-colors">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-1">
             <p className="text-xs text-slate-400 uppercase font-semibold">Logged in as</p>
             {membershipData && (
                <div className={`text-[10px] px-2 py-0.5 rounded-full text-white ${getStatusColor(membershipData.status)} flex items-center space-x-1`}>
                    <span className="uppercase font-bold">{membershipData.status}</span>
                    {membershipData.status !== 'cancelled' && (
                        <span className="opacity-75">| {getExpiryMonth(membershipData.endDate)}</span>
                    )}
                </div>
             )}
          </div>
          <div className="flex items-center mt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
