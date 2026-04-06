import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Mic, 
  AlertCircle, 
  Heart, 
  ChevronRight, 
  Info, 
  Filter,
  X,
  Plus,
  Activity
} from 'lucide-react';
import { remedies } from '../data/ayurveda';
import { cn } from '../lib/utils';

const RemedyFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [filteredRemedies, setFilteredRemedies] = useState(remedies);

  const allSymptoms = Array.from(new Set(remedies.flatMap(r => r.symptoms)));

  useEffect(() => {
    let results = remedies;
    
    if (searchTerm) {
      results = results.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSymptoms.length > 0) {
      results = results.filter(r => 
        selectedSymptoms.every(s => r.symptoms.includes(s))
      );
    }

    setFilteredRemedies(results);
  }, [searchTerm, selectedSymptoms]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
    };

    recognition.start();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 tracking-tight">Smart Remedy Finder</h1>
        <p className="text-emerald-600 font-medium max-w-xl mx-auto">
          Find natural Ayurvedic remedies based on your symptoms. Ancient wisdom for modern ailments.
        </p>
      </div>

      {/* Search Section */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-emerald-400 group-focus-within:text-emerald-600 transition-colors">
          <Search size={20} />
        </div>
        <input 
          type="text"
          placeholder="Search by symptom or remedy name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white border border-emerald-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all outline-none text-emerald-900 font-medium"
        />
        <button 
          onClick={startListening}
          className={cn(
            "absolute inset-y-2 right-2 px-4 rounded-xl transition-all flex items-center justify-center",
            isListening ? "bg-red-500 text-white animate-pulse" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
          )}
        >
          <Mic size={20} />
        </button>
      </div>

      {/* Symptoms Filter */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 uppercase tracking-wider">
          <Filter size={16} /> Filter by Symptoms
        </div>
        <div className="flex flex-wrap gap-2">
          {allSymptoms.map((symptom) => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                selectedSymptoms.includes(symptom)
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100"
                  : "bg-white text-emerald-600 border-emerald-100 hover:border-emerald-300"
              )}
            >
              {symptom}
            </button>
          ))}
          {selectedSymptoms.length > 0 && (
            <button 
              onClick={() => setSelectedSymptoms([])}
              className="px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRemedies.map((remedy) => (
            <motion.div
              key={remedy.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl border border-emerald-50 shadow-sm overflow-hidden flex flex-col group"
            >
              <div className="p-6 space-y-4 flex-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-emerald-900">{remedy.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {remedy.symptoms.map(s => (
                        <span key={s} className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <SeverityBadge severity={remedy.severity} />
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <Plus size={12} /> Ingredients
                    </p>
                    <p className="text-sm text-emerald-600 leading-relaxed">{remedy.ingredients.join(', ')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <Activity size={12} /> How to Use
                    </p>
                    <p className="text-sm text-emerald-600 leading-relaxed">{remedy.preparation}</p>
                  </div>
                </div>

                {remedy.severity === 'Severe' && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 font-medium leading-relaxed">
                      <strong>Consult a doctor:</strong> This condition may require professional medical attention.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-emerald-50/50 border-t border-emerald-50 flex items-center justify-between">
                <button className="text-emerald-600 hover:text-emerald-700 font-bold text-sm flex items-center gap-1">
                  <Heart size={16} /> Save
                </button>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-sm">
                  Full Details
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredRemedies.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-300">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-bold text-emerald-900">No remedies found</h3>
          <p className="text-emerald-600 font-medium">Try searching for different symptoms or keywords.</p>
        </div>
      )}
    </div>
  );
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  const styles = {
    Mild: 'bg-emerald-100 text-emerald-700',
    Moderate: 'bg-orange-100 text-orange-700',
    Severe: 'bg-red-100 text-red-700'
  };

  return (
    <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", styles[severity as keyof typeof styles])}>
      {severity}
    </span>
  );
};

export default RemedyFinder;
