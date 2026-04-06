import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Scan, 
  Activity, 
  BookOpen, 
  Info, 
  ChevronRight,
  Heart,
  User as UserIcon,
  X,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const location = useLocation();

  const menuItems = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/remedies', icon: <Search size={20} />, label: 'Remedy Finder' },
    { to: '/quiz', icon: <UserIcon size={20} />, label: 'Dosha Analysis' },
    { to: '/scanner', icon: <Scan size={20} />, label: 'AI Herb Scanner' },
    { to: '/library', icon: <BookOpen size={20} />, label: 'Herb Library' },
    { to: '/calories', icon: <Activity size={20} />, label: 'Health Tracker' },
    { to: '/ayurbot', icon: <MessageSquare size={20} />, label: 'AyurBot' },
    { to: '/about', icon: <Info size={20} />, label: 'About IKS' },
  ];

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-10 md:hidden">
        <span className="text-xl font-bold text-emerald-800">Menu</span>
        <button onClick={onClose} className="p-2 hover:bg-emerald-50 rounded-lg">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-1 flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 mb-4 px-4">Main Menu</p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => onClose()}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl transition-all group",
                isActive 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
                  : "text-emerald-600 hover:bg-emerald-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive ? "bg-emerald-500" : "bg-emerald-50 group-hover:bg-white"
                )}>
                  {item.icon}
                </div>
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} className="opacity-60" />}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-emerald-50">
        <div className="bg-emerald-50 p-6 rounded-[2rem] space-y-3 relative overflow-hidden group">
          <div className="relative z-10">
            <Heart size={24} className="text-rose-500 mb-2" />
            <h4 className="font-bold text-emerald-900 text-sm">Stay Balanced</h4>
            <p className="text-[10px] text-emerald-600 font-medium leading-relaxed">
              "Health is a state of complete harmony of the body, mind and spirit."
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-emerald-100 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
