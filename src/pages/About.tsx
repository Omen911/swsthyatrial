import React from 'react';
import { motion } from 'motion/react';
import { 
  Leaf, 
  Heart, 
  ShieldCheck, 
  Globe, 
  ChevronRight, 
  ExternalLink,
  Info
} from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Hero */}
      <section className="text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-200"
        >
          <Leaf size={40} />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-emerald-900 tracking-tighter">Swasthya 360</h1>
          <p className="text-xl text-emerald-600 font-medium italic">Bridging Ancient Wisdom with Modern Technology</p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-emerald-900 tracking-tight">The IKS & Ayurveda Philosophy</h2>
          <p className="text-emerald-700 leading-relaxed text-lg">
            Ayurveda, the "Science of Life," is one of the world's oldest holistic healing systems. Developed more than 3,000 years ago in India, it is based on the belief that health and wellness depend on a delicate balance between the mind, body, and spirit.
          </p>
          <p className="text-emerald-700 leading-relaxed">
            Swasthya 360 leverages the Indian Knowledge System (IKS) to provide personalized wellness insights, helping you understand your unique constitution (Dosha) and find natural remedies that work in harmony with your body.
          </p>
        </div>
        <div className="bg-emerald-100 rounded-[3rem] aspect-square relative overflow-hidden">
          <img 
            src="https://picsum.photos/seed/ayurveda/800/800" 
            alt="Ayurveda" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-emerald-600/20" />
        </div>
      </section>

      {/* Core Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ValueCard 
          icon={<Heart className="text-rose-500" />}
          title="Holistic Healing"
          desc="Treating the root cause, not just the symptoms, through natural means."
        />
        <ValueCard 
          icon={<ShieldCheck className="text-emerald-600" />}
          title="Personalized Care"
          desc="Every individual is unique. Our AI tailors wisdom to your specific Dosha."
        />
        <ValueCard 
          icon={<Globe className="text-blue-600" />}
          title="Ancient Wisdom"
          desc="Preserving and promoting the rich heritage of Indian Knowledge Systems."
        />
      </section>

      {/* Disclaimer */}
      <section className="p-8 bg-amber-50 border border-amber-100 rounded-[2.5rem] space-y-4">
        <div className="flex items-center gap-3 text-amber-800">
          <Info size={24} />
          <h3 className="text-xl font-bold">Medical Disclaimer</h3>
        </div>
        <p className="text-amber-900/70 text-sm leading-relaxed font-medium">
          The information provided by Swasthya 360 is for educational and informational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application.
        </p>
      </section>

      <div className="text-center pt-8">
        <p className="text-emerald-400 font-bold text-sm tracking-widest uppercase">© 2026 Swasthya 360 — Built with Wisdom</p>
      </div>
    </div>
  );
};

const ValueCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-emerald-50 shadow-sm space-y-4 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-emerald-900">{title}</h3>
    <p className="text-sm text-emerald-600 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default About;
