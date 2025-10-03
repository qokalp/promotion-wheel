import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Settings } from 'lucide-react';
import { WheelSlice } from '../types';
import { validateAdminConfig, ValidationError } from '../utils/validation';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => Promise<boolean>;
  onSaveConfig: (config: { slices: WheelSlice[] }) => Promise<void>;
  initialConfig: { slices: WheelSlice[] };
}

export function AdminModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  onSaveConfig, 
  initialConfig 
}: AdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<{ slices: WheelSlice[] }>(initialConfig);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [loginError, setLoginError] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setConfig(initialConfig);
      setIsAuthenticated(false);
      setPassword('');
      setErrors([]);
      setLoginError('');
    }
  }, [isOpen, initialConfig]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    
    try {
      const success = await onLogin(password);
      if (success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(t('invalidPassword'));
      }
    } catch (error) {
      setLoginError(t('loginFailed'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSave = async () => {
    const validation = validateAdminConfig(config);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    
    setErrors([]);
    setIsSaving(true);
    
    try {
      await onSaveConfig(config);
      onClose();
    } catch (error) {
      setErrors([{ field: 'general', message: t('configurationFailed') }]);
    } finally {
      setIsSaving(false);
    }
  };

  const addSlice = () => {
    if (config.slices.length < 16) {
      setConfig(prev => ({
        ...prev,
        slices: [...prev.slices, { label: `Prize ${prev.slices.length + 1}`, weight: 1 }]
      }));
    }
  };

  const removeSlice = (index: number) => {
    if (config.slices.length > 8) {
      setConfig(prev => ({
        ...prev,
        slices: prev.slices.filter((_, i) => i !== index)
      }));
    }
  };

  const updateSlice = (index: number, field: keyof WheelSlice, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      slices: prev.slices.map((slice, i) => 
        i === index ? { ...slice, [field]: value } : slice
      )
    }));
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative glass-dark rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-neon-pink" />
                <h2 className="text-2xl font-bold text-white">{t('adminSettings')}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {!isAuthenticated ? (
              /* Login Form */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-white/80 text-center mb-6">
                  {t('adminPasswordPrompt')}
                </p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="admin-password" className="block text-sm font-medium mb-2 text-white">
                      {t('adminPassword')}
                    </label>
                    <input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('adminPasswordPlaceholder')}
                      className="input-field w-full"
                      disabled={isLoggingIn}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoggingIn || !password.trim()}
                    className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingIn ? t('authenticating') : t('login')}
                  </button>
                  
                  {loginError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm text-center"
                    >
                      {loginError}
                    </motion.p>
                  )}
                </form>
              </motion.div>
            ) : (
              /* Configuration Form */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{t('wheelConfiguration')}</h3>
                  <button
                    onClick={addSlice}
                    disabled={config.slices.length >= 16}
                    className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    {t('addSlice')}
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {config.slices.map((slice, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass p-4 rounded-lg flex items-center gap-4"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1 text-white/80">
                            {t('prizeName')}
                          </label>
                          <input
                            type="text"
                            value={slice.label}
                            onChange={(e) => updateSlice(index, 'label', e.target.value)}
                            className="input-field text-sm py-2"
                            placeholder="Ödül adı"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-white/80">
                            {t('weight')}
                          </label>
                          <input
                            type="number"
                            min="0.1"
                            max="100"
                            step="0.1"
                            value={slice.weight}
                            onChange={(e) => updateSlice(index, 'weight', parseFloat(e.target.value) || 0)}
                            className="input-field text-sm py-2"
                            placeholder="1.0"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                          />
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeSlice(index)}
                        disabled={config.slices.length <= 8}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {errors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
                  >
                    {errors.map((error, index) => (
                      <p key={index} className="text-red-400 text-sm">
                        {error.message}
                      </p>
                    ))}
                  </motion.div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={onClose}
                    className="btn-secondary flex-1 py-3"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? t('saving') : t('saveConfiguration')}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

