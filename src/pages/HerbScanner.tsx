import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scan, 
  Camera, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ChevronRight,
  Info,
  History,
  ShieldAlert,
  Leaf
} from 'lucide-react';
import { analyzeHerbImage } from '../lib/gemini';
import { cn } from '../lib/utils';
import HerbImage from '../components/HerbImage';

const HerbScanner = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const analysisResult = await analyzeHerbImage(base64Data, mimeType);
      setResult(analysisResult);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 tracking-tight">AI Herb Scanner</h1>
        <p className="text-emerald-600 font-medium max-w-xl mx-auto">
          Identify plants and herbs using advanced AI. Get instant Ayurvedic insights and benefits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className={cn(
            "relative aspect-square rounded-[3rem] border-4 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all",
            image ? "border-emerald-500 bg-white" : "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50"
          )}>
            {image ? (
              <>
                <img src={image} alt="Uploaded" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-emerald-600 p-4 rounded-2xl shadow-xl hover:scale-110 transition-transform"
                  >
                    <Upload size={24} />
                  </button>
                  <button 
                    onClick={resetScanner}
                    className="bg-white text-red-500 p-4 rounded-2xl shadow-xl hover:scale-110 transition-transform"
                  >
                    <RefreshCw size={24} />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4 p-8">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <Camera size={40} />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-emerald-900">Capture or Upload</p>
                  <p className="text-sm text-emerald-600 font-medium">Take a clear photo of the herb</p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                  Select Image
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {image && !isAnalyzing && !result && (
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={startAnalysis}
              className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3"
            >
              <Scan size={24} /> Analyze with AI
            </motion.button>
          )}

          {isAnalyzing && (
            <div className="space-y-4">
              <div className="p-8 bg-white rounded-[2rem] border border-emerald-100 shadow-sm text-center space-y-4">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"
                />
                <div className="space-y-1">
                  <p className="text-lg font-bold text-emerald-900">Analyzing plant using AI...</p>
                  <p className="text-sm text-emerald-600 font-medium">Identifying species and properties</p>
                </div>
                <div className="w-full h-2 bg-emerald-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5 }}
                    className="h-full bg-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-6"
              >
                {/* Confidence Warning */}
                {result.confidence < 70 && (
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
                    <AlertTriangle size={20} className="text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-800 font-medium leading-relaxed">
                      <strong>Identification is uncertain.</strong> Confidence level is {result.confidence}%. Please verify manually or consult an expert before use.
                    </p>
                  </div>
                )}

                {/* Main Identity */}
                <div className="bg-white p-8 rounded-[3rem] border border-emerald-100 shadow-sm space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-black text-emerald-900 tracking-tight">{result.name}</h2>
                      <p className="text-emerald-600 font-serif italic text-lg">{result.scientificName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Confidence</span>
                      <p className="text-2xl font-black text-emerald-600">{result.confidence}%</p>
                    </div>
                  </div>

                  {/* AI Reference Image */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800 flex items-center gap-2">
                      <Leaf size={14} className="text-emerald-500" /> AI Reference Image
                    </h4>
                    <HerbImage 
                      herbName={result.name} 
                      className="w-full h-48 rounded-2xl shadow-inner border border-emerald-50"
                    />
                    <p className="text-[10px] text-emerald-400 font-medium text-center">
                      This is an AI-generated reference of {result.name} for comparison.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800 flex items-center gap-2">
                        <History size={14} /> Ayurvedic History
                      </h4>
                      <p className="text-sm text-emerald-700 leading-relaxed">{result.history}</p>
                    </div>
                    
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 size={14} /> Benefits & Uses
                      </h4>
                      <p className="text-sm text-emerald-700 leading-relaxed">{result.benefits}</p>
                    </div>

                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100 space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-red-800 flex items-center gap-2">
                        <ShieldAlert size={14} /> Precautions
                      </h4>
                      <p className="text-sm text-red-700 leading-relaxed">{result.precautions}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <a 
                      href={`https://en.wikipedia.org/wiki/${result.name.replace(' ', '_')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-50 text-emerald-600 py-4 rounded-2xl font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                    >
                      Wikipedia <ExternalLink size={18} />
                    </a>
                    <button 
                      onClick={resetScanner}
                      className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                    >
                      Scan Another
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : !isAnalyzing && (
              <div className="h-full bg-emerald-50/50 rounded-[3rem] border-4 border-dashed border-emerald-100 flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-200">
                  <Info size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-emerald-800">No Analysis Yet</h3>
                  <p className="text-sm text-emerald-500 font-medium">Upload an image to get AI-powered insights about the herb.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HerbScanner;
