import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { validateForm, ValidationError } from '../utils/validation';
import { useLanguage } from '../contexts/LanguageContext';

interface SpinFormProps {
  onSubmit: (data: { name: string; phone: string }) => void;
  isSpinning: boolean;
  isLoading?: boolean;
}

export function SpinForm({ onSubmit, isSpinning, isLoading = false }: SpinFormProps) {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm(formData);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    
    setErrors([]);
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6 rounded-2xl max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-shadow">
        {t('enterDetails')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            {t('fullName')}
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder={t('fullNamePlaceholder')}
            className={`input-field w-full ${getFieldError('name') ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={isSpinning || isLoading}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {getFieldError('name') && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-1"
            >
              {getFieldError('name')}
            </motion.p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            {t('phoneNumber')}
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
            placeholder={t('phoneNumberPlaceholder')}
            className={`input-field w-full ${getFieldError('phone') ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={isSpinning || isLoading}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            inputMode="numeric"
          />
          {getFieldError('phone') && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-1"
            >
              {getFieldError('phone')}
            </motion.p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isSpinning || isLoading}
          className="btn-primary w-full py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isSpinning || isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isSpinning || isLoading ? 1 : 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isLoading ? (
            <span className="loading-dots">{t('checking')}</span>
          ) : isSpinning ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('spinning')}
            </span>
          ) : (
            t('spinButton')
          )}
        </motion.button>
      </form>

      {errors.some(error => error.field === 'general') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
        >
          <p className="text-red-400 text-sm">
            {errors.find(error => error.field === 'general')?.message}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

