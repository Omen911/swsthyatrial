import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Wind, 
  Zap, 
  Droplets,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { quizQuestions } from '../data/ayurveda';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { cn, getDoshaDiet } from '../lib/utils';

const DoshaQuiz = ({ user }: { user: any }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (questionId: string, dosha: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: dosha }));
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = async () => {
    setIsSubmitting(true);
    
    // Count occurrences of each dosha
    const counts: Record<string, number> = { Vata: 0, Pitta: 0, Kapha: 0 };
    Object.values(answers).forEach(dosha => {
      counts[dosha]++;
    });

    // Find the max
    const winner = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    
    setResult(winner);

    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          dosha: winner
        });
      } catch (error) {
        console.error("Error updating dosha:", error);
      }
    }
    
    setIsSubmitting(false);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    const doshaData = {
      Vata: { icon: <Wind size={64} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', desc: 'The Energy of Movement', traits: ['Creative', 'Energetic', 'Thin frame', 'Cold hands/feet'] },
      Pitta: { icon: <Zap size={64} />, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', desc: 'The Energy of Transformation', traits: ['Intelligent', 'Determined', 'Strong digestion', 'Warm body'] },
      Kapha: { icon: <Droplets size={64} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', desc: 'The Energy of Lubrication', traits: ['Calm', 'Loyal', 'Strong frame', 'Smooth skin'] }
    };

    const info = doshaData[result as keyof typeof doshaData];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <div className={cn("p-10 rounded-[3rem] border shadow-xl text-center space-y-6", info.bg, info.border)}>
          <div className={cn("w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-4", info.color)}>
            {info.icon}
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] opacity-40">Your Primary Dosha</h2>
            <h1 className={cn("text-5xl font-black tracking-tighter", info.color)}>{result}</h1>
            <p className="text-lg font-medium opacity-70 italic">{info.desc}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left mt-8">
            {info.traits.map(trait => (
              <div key={trait} className="flex items-center gap-2 bg-white/50 p-3 rounded-2xl border border-white/20">
                <CheckCircle2 size={18} className={info.color} />
                <span className="text-sm font-bold opacity-80">{trait}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
            <ArrowRight size={20} className="text-emerald-600" /> Personalized Diet Suggestions
          </h3>
          <p className="text-emerald-700 font-medium leading-relaxed bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            {getDoshaDiet(result)}
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={resetQuiz}
              className="flex-1 bg-emerald-50 text-emerald-600 py-4 rounded-2xl font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Retake Quiz
            </button>
            <button className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
              View Remedies
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-emerald-900 tracking-tight">Dosha Analysis</h1>
        <p className="text-emerald-600 font-medium">Answer a few questions to discover your unique body constitution.</p>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-emerald-600"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="bg-white p-8 md:p-12 rounded-[3rem] border border-emerald-100 shadow-xl space-y-8"
        >
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Question {currentStep + 1} of {quizQuestions.length}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 leading-tight">{currentQuestion.question}</h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(currentQuestion.id, option.dosha)}
                className="w-full p-6 text-left rounded-2xl border-2 border-emerald-50 hover:border-emerald-600 hover:bg-emerald-50 transition-all group flex items-center justify-between"
              >
                <span className="text-lg font-bold text-emerald-800 group-hover:text-emerald-900">{option.text}</span>
                <ChevronRight size={20} className="text-emerald-200 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          {currentStep > 0 && (
            <button 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="text-sm font-bold text-emerald-400 hover:text-emerald-600 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft size={16} /> Previous Question
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DoshaQuiz;
