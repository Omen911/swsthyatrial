import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Heart, 
  Zap, 
  Droplets, 
  Wind, 
  ChevronRight, 
  Star, 
  Clock, 
  TrendingUp,
  Plus,
  Search,
  Leaf
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { remedies, herbs } from '../data/ayurveda';
import HerbImage from '../components/HerbImage';

const Dashboard = ({ user, userData }: { user: any, userData: any }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const doshaInfo = {
    Vata: { icon: <Wind size={24} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', desc: 'Air & Space' },
    Pitta: { icon: <Zap size={24} />, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', desc: 'Fire & Water' },
    Kapha: { icon: <Droplets size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', desc: 'Earth & Water' },
    Unknown: { icon: <Activity size={24} />, color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-100', desc: 'Not Analyzed' }
  };

  const currentDosha = (userData?.dosha as keyof typeof doshaInfo) || 'Unknown';
  const info = doshaInfo[currentDosha];

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 md:p-12 text-white shadow-2xl shadow-emerald-200">
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            {greeting}, {user?.displayName?.split(' ')[0] || 'Seeker'}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-50 text-lg md:text-xl opacity-90 leading-relaxed"
          >
            Your journey to holistic wellness starts here. Balance your mind, body, and spirit with ancient wisdom.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link to="/quiz" className="bg-white text-emerald-700 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-lg flex items-center gap-2">
              Analyze Dosha <ChevronRight size={18} />
            </Link>
            <Link to="/remedies" className="bg-emerald-500/30 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-500/40 transition-all flex items-center gap-2">
              Find Remedies <Search size={18} />
            </Link>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-300/10 rounded-full blur-2xl" />
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dosha Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className={cn("p-6 rounded-3xl border shadow-sm flex flex-col justify-between h-full", info.bg, info.border)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn("p-3 rounded-2xl bg-white shadow-sm", info.color)}>
              {info.icon}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">Body Type</span>
          </div>
          <div>
            <h3 className={cn("text-2xl font-bold mb-1", info.color)}>{currentDosha}</h3>
            <p className="text-sm opacity-70 font-medium">{info.desc}</p>
          </div>
          <Link to="/quiz" className="mt-6 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            {currentDosha === 'Unknown' ? 'Take Quiz' : 'Retake Quiz'} <ChevronRight size={16} />
          </Link>
        </motion.div>

        {/* Calorie Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm flex flex-col justify-between h-full"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-60 text-emerald-800">Health Tracker</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-1">2,150 <span className="text-sm font-medium opacity-50">kcal</span></h3>
            <p className="text-sm text-emerald-600 font-medium">Daily Target</p>
          </div>
          <Link to="/calories" className="mt-6 text-sm font-bold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">
            Log Intake <ChevronRight size={16} />
          </Link>
        </motion.div>

        {/* Favorites Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm flex flex-col justify-between h-full"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 shadow-sm">
              <Star size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-60 text-emerald-800">Saved</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-1">{userData?.favorites?.length || 0}</h3>
            <p className="text-sm text-rose-600 font-medium">Favorite Remedies</p>
          </div>
          <Link to="/remedies" className="mt-6 text-sm font-bold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">
            Explore More <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Remedies */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Heart size={20} className="text-rose-500" /> Recommended for You
            </h2>
            <Link to="/remedies" className="text-sm font-bold text-emerald-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {remedies.slice(0, 2).map((remedy) => (
              <motion.div 
                key={remedy.id}
                whileHover={{ scale: 1.01 }}
                className="p-4 bg-white rounded-2xl border border-emerald-50 shadow-sm flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Activity size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-emerald-900">{remedy.name}</h4>
                  <p className="text-xs text-emerald-600 font-medium">{remedy.symptoms.join(', ')}</p>
                </div>
                <ChevronRight size={18} className="text-emerald-300 group-hover:text-emerald-600 transition-all" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Herbs */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Leaf size={20} className="text-emerald-500" /> Herb Library
            </h2>
            <Link to="/library" className="text-sm font-bold text-emerald-600 hover:underline">Explore Library</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {herbs.slice(0, 2).map((herb) => (
              <motion.div 
                key={herb.id}
                whileHover={{ y: -5 }}
                className="relative overflow-hidden rounded-2xl aspect-[4/3] group"
              >
                <HerbImage 
                  herbName={herb.name} 
                  className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-110"
                  fallbackUrl={herb.imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent flex flex-col justify-end p-4">
                  <h4 className="text-white font-bold text-sm">{herb.name}</h4>
                  <p className="text-emerald-200 text-[10px] font-medium uppercase tracking-wider">{herb.scientificName}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
