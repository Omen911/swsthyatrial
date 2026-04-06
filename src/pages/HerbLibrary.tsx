import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  ChevronRight, 
  Info,
  Heart,
  Filter
} from 'lucide-react';
import { herbs } from '../data/ayurveda';
import { cn } from '../lib/utils';
import HerbImage from '../components/HerbImage';

const HerbLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHerb, setSelectedHerb] = useState<any>(null);

  const filteredHerbs = herbs.filter(herb => 
    herb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    herb.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 tracking-tight">Herb Library</h1>
          <p className="text-emerald-600 font-medium">Explore the vast world of Ayurvedic medicinal plants.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-emerald-400">
            <Search size={20} />
          </div>
          <input 
            type="text"
            placeholder="Search herbs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all outline-none text-emerald-900 font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHerbs.map((herb) => (
          <motion.div
            key={herb.id}
            whileHover={{ y: -8 }}
            className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm overflow-hidden group cursor-pointer"
            onClick={() => setSelectedHerb(herb)}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <HerbImage 
                herbName={herb.name} 
                className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110"
                fallbackUrl={herb.imageUrl}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent" />
              <div className="absolute top-4 right-4">
                <button className="p-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white hover:text-rose-500 transition-all">
                  <Heart size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-emerald-900">{herb.name}</h3>
                <p className="text-xs font-serif italic text-emerald-600">{herb.scientificName}</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {herb.benefits.slice(0, 2).map((benefit, idx) => (
                  <span key={idx} className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {benefit}
                  </span>
                ))}
                {herb.benefits.length > 2 && <span className="text-[10px] font-bold text-emerald-300">+{herb.benefits.length - 2} more</span>}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                  View Details <ChevronRight size={14} />
                </span>
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Info size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Herb Detail Modal */}
      {selectedHerb && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedHerb(null)}
            className="absolute inset-0 bg-emerald-900/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative bg-white w-full max-w-3xl max-height-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl"
          >
            <button 
              onClick={() => setSelectedHerb(null)}
              className="absolute top-6 right-6 p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all z-10"
            >
              <ChevronRight size={24} className="rotate-90" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-full">
                <HerbImage 
                  herbName={selectedHerb.name} 
                  className="absolute inset-0 w-full h-full"
                  fallbackUrl={selectedHerb.imageUrl}
                />
              </div>
              
              <div className="p-8 md:p-12 space-y-6">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-emerald-900 tracking-tight">{selectedHerb.name}</h2>
                  <p className="text-emerald-600 font-serif italic text-lg">{selectedHerb.scientificName}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">History</h4>
                    <p className="text-sm text-emerald-700 leading-relaxed">{selectedHerb.history}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Main Benefits</h4>
                    <ul className="grid grid-cols-1 gap-2">
                      {selectedHerb.benefits.map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">How to Use</h4>
                    <p className="text-sm text-emerald-700 leading-relaxed">{selectedHerb.uses}</p>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                    <h4 className="text-xs font-black uppercase tracking-widest text-red-800 mb-1">Precautions</h4>
                    <p className="text-xs text-red-700 font-medium leading-relaxed">{selectedHerb.precautions}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <a 
                    href={selectedHerb.wikipediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                  >
                    Read More on Wikipedia <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HerbLibrary;
