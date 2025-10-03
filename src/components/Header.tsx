import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface HeaderProps {
  title: string;
  onLanguageChange: (lang: 'tr' | 'en') => void;
  currentLanguage: 'tr' | 'en';
}

export function Header({ title, onLanguageChange, currentLanguage }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      {/* Language Toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
          <Globe className="w-4 h-4 text-white" />
          <button
            onClick={() => onLanguageChange('tr')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              currentLanguage === 'tr' 
                ? 'bg-brand-cyan text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            TR
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              currentLanguage === 'en' 
                ? 'bg-brand-cyan text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Logo and Title */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <motion.img
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
          src="/logo.png"
          alt="Logo"
          className="w-16 h-16 object-contain drop-shadow-lg"
        />
        <motion.h1
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold text-white text-shadow-lg"
        >
          {title}
        </motion.h1>
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-white/80 max-w-2xl mx-auto"
      >
        {currentLanguage === 'tr' 
          ? 'Detaylarınızı girin ve harika ödüller kazanmak için çevirin!'
          : 'Enter your details and spin to win amazing prizes!'
        }
        <br />
        <span className="text-brand-cyan font-semibold">
          {currentLanguage === 'tr' 
            ? 'Her telefon numarası için bir çevirme hakkı.'
            : 'One spin per phone number.'
          }
        </span>
      </motion.p>
    </motion.div>
  );
}
