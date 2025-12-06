import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { 
  BookOpen, Users, ArrowUpRight, ArrowDownLeft, 
  Search, CreditCard, Settings, BarChart3, Clock 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const ActionCard = ({ to, title, desc, icon, colorClass, delay }) => (
    <Link 
      to={to} 
      className={`group relative bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 ${colorClass}`}></div>
      <div className="relative z-10 flex flex-col h-full">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClass} text-white shadow-md`}>
          {icon}
        </div>
        <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{title}</h4>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{desc}</p>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative h-80 w-full overflow-hidden mb-12 shadow-md">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform hover:scale-105 transition-transform duration-[20s]"
          style={{ backgroundImage: "url('/library-hero.jpg')" }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center animate-fade-in">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wider w-fit mb-4 backdrop-blur-sm">
            WELCOME BACK
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{user?.name}</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-xl">
            Manage your library efficiently. Access your records, issue books, and track returns all in one place.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pb-20 -mt-20 relative z-20">
        
        {user?.role === 'admin' ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white drop-shadow-md">Admin Console</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ActionCard 
                to="/maintenance" 
                title="Maintenance" 
                desc="Manage books, movies, add new members, and handle database records." 
                icon={<Settings size={24} />} 
                colorClass="bg-blue-600"
                delay={100}
              />
              <ActionCard 
                to="/reports" 
                title="Reports Center" 
                desc="Generate master lists, view active issues, and track overdue items." 
                icon={<BarChart3 size={24} />} 
                colorClass="bg-emerald-500"
                delay={200}
              />
              <ActionCard 
                to="/transactions" 
                title="Transactions" 
                desc="Issue books to members, accept returns, and collect fines." 
                icon={<ArrowUpRight size={24} />} 
                colorClass="bg-amber-500"
                delay={300}
              />
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white drop-shadow-md">Member Services</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ActionCard 
                to="/transactions?tab=availability" 
                title="Check Availability" 
                desc="Find your next read from our extensive collection." 
                icon={<Search size={24} />} 
                colorClass="bg-cyan-500"
                delay={100}
              />
              <ActionCard 
                to="/transactions?tab=issue" 
                title="Issue Book" 
                desc="Ready to read? Borrow a book instantly." 
                icon={<BookOpen size={24} />} 
                colorClass="bg-indigo-500"
                delay={200}
              />
              <ActionCard 
                to="/transactions?tab=return" 
                title="Return Book" 
                desc="Finished reading? Return your book here." 
                icon={<ArrowDownLeft size={24} />} 
                colorClass="bg-violet-500"
                delay={300}
              />
              <ActionCard 
                to="/transactions?tab=fine" 
                title="Pay Fine" 
                desc="Clear any outstanding dues securely." 
                icon={<CreditCard size={24} />} 
                colorClass="bg-rose-500"
                delay={400}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
