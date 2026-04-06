import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Plus, 
  Trash2, 
  Calendar, 
  TrendingUp, 
  Utensils,
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { calculateCalories } from '../lib/utils';
import { cn } from '../lib/utils';

const CalorieTracker = ({ user }: { user: any }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // Profile state for calculator
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [activity, setActivity] = useState('moderate');
  const [targetCalories, setTargetCalories] = useState(2150);

  useEffect(() => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, `users/${user.uid}/calorieLogs`),
      where('date', '==', today),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(newLogs);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const target = calculateCalories(Number(age), gender, Number(weight), Number(height), activity);
    setTargetCalories(target);
  }, [age, gender, weight, height, activity]);

  const addLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !foodName || !calories) return;

    setIsAdding(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/calorieLogs`), {
        uid: user.uid,
        foodName,
        calories: Number(calories),
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      });
      setFoodName('');
      setCalories('');
    } catch (error) {
      console.error("Error adding log:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const deleteLog = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/calorieLogs`, id));
    } catch (error) {
      console.error("Error deleting log:", error);
    }
  };

  const totalConsumed = logs.reduce((sum, log) => sum + log.calories, 0);
  const remaining = targetCalories - totalConsumed;
  const progress = Math.min((totalConsumed / targetCalories) * 100, 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 tracking-tight">Ayurvedic Health Tracker</h1>
        <p className="text-emerald-600 font-medium max-w-xl mx-auto">
          Track your daily nutrition and calculate your personalized caloric needs based on Ayurvedic principles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Calculator & Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Target Summary */}
          <div className="bg-emerald-900 text-white p-8 rounded-[3rem] shadow-xl space-y-6 relative overflow-hidden">
            <div className="relative z-10 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Daily Progress</span>
              <h2 className="text-4xl font-black tracking-tighter">{totalConsumed} <span className="text-sm font-medium opacity-60">kcal</span></h2>
              <p className="text-sm text-emerald-200 font-medium">of {targetCalories} kcal target</p>
            </div>

            <div className="relative z-10 space-y-2">
              <div className="h-3 bg-emerald-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={cn(
                    "h-full transition-all",
                    progress > 100 ? "bg-rose-500" : "bg-emerald-400"
                  )}
                />
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                <span>{progress.toFixed(0)}% Consumed</span>
                <span>{remaining > 0 ? `${remaining} kcal left` : 'Target reached'}</span>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-800/30 rounded-full blur-3xl" />
          </div>

          {/* Calculator Form */}
          <div className="bg-white p-6 rounded-[2rem] border border-emerald-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-600" /> Calorie Calculator
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Age</label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Gender</label>
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-300"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Weight (kg)</label>
                <input 
                  type="number" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Height (cm)</label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Activity Level</label>
              <select 
                value={activity} 
                onChange={(e) => setActivity(e.target.value)}
                className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-300"
              >
                <option value="sedentary">Sedentary (Office job)</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="active">Very Active</option>
                <option value="veryActive">Extra Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Logs & Add Food */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Food Form */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm">
            <form onSubmit={addLog} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-emerald-400">
                  <Utensils size={18} />
                </div>
                <input 
                  type="text"
                  placeholder="What did you eat?"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all font-medium"
                />
              </div>
              <div className="w-full md:w-40 relative">
                <input 
                  type="number"
                  placeholder="Calories"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full px-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all font-bold text-center"
                />
              </div>
              <button 
                type="submit"
                disabled={isAdding}
                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Add
              </button>
            </form>
          </div>

          {/* Logs List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                <Calendar size={20} className="text-emerald-600" /> Today's Intake
              </h3>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{logs.length} items logged</span>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Utensils size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-900">{log.foodName}</h4>
                        <p className="text-xs text-emerald-400 font-medium">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-lg font-black text-emerald-600">{log.calories} <span className="text-[10px] font-bold uppercase opacity-40">kcal</span></span>
                      <button 
                        onClick={() => deleteLog(log.id)}
                        className="p-2 text-emerald-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {logs.length === 0 && (
                <div className="text-center py-12 bg-emerald-50/30 rounded-[2rem] border-2 border-dashed border-emerald-100">
                  <p className="text-emerald-400 font-medium">No food logged for today yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker;
