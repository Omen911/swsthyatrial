import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Search, 
  Scan, 
  Activity, 
  BookOpen, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Leaf, 
  Heart, 
  AlertCircle,
  ChevronRight,
  RefreshCw,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { auth, signInWithGoogle, logout, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { cn } from './lib/utils';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import RemedyFinder from './pages/RemedyFinder';
import DoshaQuiz from './pages/DoshaQuiz';
import HerbScanner from './pages/HerbScanner';
import HerbLibrary from './pages/HerbLibrary';
import CalorieTracker from './pages/CalorieTracker';
import About from './pages/About';
import AyurBot from './pages/AyurBot';

const tips = [
  { hi: "भोजनं अमृतं", en: "Food is medicine when eaten correctly." },
  { hi: "स्वस्थस्य स्वास्थ्य रक्षणं", en: "Protect the health of the healthy." },
  { hi: "मितभुक् हितभुक्", en: "Eat moderately, eat what is beneficial." },
  { hi: "योगश्चित्तवृत्तिनिरोधः", en: "Yoga is the cessation of the fluctuations of the mind." },
  { hi: "अहिंसा परमो धर्मः", en: "Non-violence is the highest duty." }
];

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isTipMinimized, setIsTipMinimized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          const newData = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            dosha: 'Unknown',
            createdAt: new Date().toISOString(),
            favorites: []
          };
          await setDoc(doc(db, 'users', user.uid), newData);
          setUserData(newData);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-emerald-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-emerald-50 text-emerald-900 font-sans">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-emerald-100 z-50 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-emerald-50 rounded-lg md:hidden"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <Leaf size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-emerald-800">Swasthya <span className="text-emerald-600">360</span></span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold">{user.displayName}</p>
                  <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">{userData?.dosha || 'Unknown'}</p>
                </div>
                <img src={user.photoURL || ''} alt="Profile" className="w-10 h-10 rounded-full border-2 border-emerald-200" />
                <button onClick={logout} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
              >
                Sign In
              </button>
            )}
          </div>
        </nav>

        {/* Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ x: isSidebarOpen ? 0 : -320 }}
          className={cn(
            "fixed top-0 left-0 bottom-0 w-80 bg-white border-r border-emerald-100 z-[70] shadow-2xl md:translate-x-0 md:shadow-none",
            !isSidebarOpen && "md:block"
          )}
        >
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </motion.aside>

        {/* Main Content */}
        <main className="pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto md:pl-80">
          <Routes>
            <Route path="/" element={<Dashboard user={user} userData={userData} />} />
            <Route path="/remedies" element={<RemedyFinder />} />
            <Route path="/quiz" element={<DoshaQuiz user={user} />} />
            <Route path="/scanner" element={<HerbScanner />} />
            <Route path="/library" element={<HerbLibrary />} />
            <Route path="/calories" element={<CalorieTracker user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/ayurbot" element={<AyurBot />} />
          </Routes>
        </main>

        {/* Fixed Tip Bar */}
        <motion.div 
          animate={{ height: isTipMinimized ? '40px' : 'auto' }}
          className="fixed bottom-0 left-0 right-0 bg-emerald-900 text-white z-40 transition-all duration-300"
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-emerald-800 p-1.5 rounded-lg shrink-0">
                <Heart size={16} className="text-emerald-400" />
              </div>
              {!isTipMinimized && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTipIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3"
                  >
                    <span className="text-sm font-medium text-emerald-200 font-serif italic">{tips[currentTipIndex].hi}</span>
                    <span className="text-xs md:text-sm text-emerald-50 opacity-90">— {tips[currentTipIndex].en}</span>
                  </motion.div>
                </AnimatePresence>
              )}
              {isTipMinimized && <span className="text-xs font-semibold tracking-widest uppercase opacity-60">Daily Ayurvedic Tip</span>}
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentTipIndex((prev) => (prev + 1) % tips.length)}
                className="p-1.5 hover:bg-emerald-800 rounded-lg transition-colors"
                title="Next Tip"
              >
                <RefreshCw size={14} />
              </button>
              <button 
                onClick={() => setIsTipMinimized(!isTipMinimized)}
                className="p-1.5 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                {isTipMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
            </div>
          </div>
          <div className="text-[10px] text-center pb-1 opacity-40 font-medium tracking-widest uppercase">— Dash Ayurveda</div>
        </motion.div>

        {/* Mobile Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-emerald-100 md:hidden flex items-center justify-around px-2 z-50">
          <NavLink to="/" icon={<Home size={20} />} label="Home" />
          <NavLink to="/remedies" icon={<Search size={20} />} label="Remedies" />
          <NavLink to="/scanner" icon={<Scan size={20} />} label="Scan" />
          <NavLink to="/library" icon={<BookOpen size={20} />} label="Library" />
          <NavLink to="/calories" icon={<Activity size={20} />} label="Health" />
        </div>
      </div>
    </Router>
  );
};

const NavLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center gap-1 transition-all",
        isActive ? "text-emerald-600" : "text-emerald-400"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-xl transition-all",
        isActive && "bg-emerald-50"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </Link>
  );
};

export default App;
