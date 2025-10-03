import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wheel } from './components/Wheel';
import { SpinForm } from './components/SpinForm';
import { ResultModal } from './components/ResultModal';
import { AdminModal } from './components/AdminModal';
import { ToastContainer, ToastType } from './components/Toast';
import { Header } from './components/Header';
import { useWheel } from './hooks/useWheel';
import { useConfetti } from './hooks/useConfetti';
import { useLanguage } from './contexts/LanguageContext';
import { api } from './utils/api';
import { getSettings } from './utils/settings';
import { WheelSlice, SpinResult } from './types';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

// Default wheel configuration
const DEFAULT_SLICES: WheelSlice[] = [
  { label: "Ücretsiz Kahve", weight: 1 },
  { label: "%50 İndirim", weight: 1 },
  { label: "Ücretsiz Tatlı", weight: 1 },
  { label: "Tekrar Dene", weight: 2 },
  { label: "Ücretsiz Meze", weight: 1 },
  { label: "%25 İndirim", weight: 1 },
  { label: "Ücretsiz İçecek", weight: 1 },
  { label: "Şanslı Çekiliş", weight: 1 },
];

function App() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState<{ prize: string; name: string; phone: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCheckingSpin, setIsCheckingSpin] = useState(false);
  
  const queryClient = useQueryClient();
  const { triggerConfetti } = useConfetti();
  const { language, setLanguage, t } = useLanguage();

  // Load wheel configuration from localStorage
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['config'],
    queryFn: api.getConfig,
    initialData: { slices: getSettings().slices },
    retry: 1,
  });

  // Wheel hook
  const { isSpinning, currentAngle, winningResult, spin, reset } = useWheel({
    slices: config.slices,
    onSpinComplete: (result) => {
      setCurrentResult(prev => prev ? { ...prev, prize: result.slice.label } : null);
      setIsResultModalOpen(true);
      triggerConfetti();
    },
  });

  // Admin login mutation
  const adminLoginMutation = useMutation({
    mutationFn: api.loginAdmin,
    onSuccess: () => {
      addToast('success', 'loginSuccessful', 'welcomeAdmin');
    },
    onError: () => {
      addToast('error', 'loginFailed', 'invalidPassword');
    },
  });

  // Save config mutation
  const saveConfigMutation = useMutation({
    mutationFn: api.saveConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
      addToast('success', 'configurationSaved', 'wheelSettingsUpdated');
    },
    onError: () => {
      addToast('error', 'saveFailed', 'configurationFailed');
    },
  });

  // Record spin mutation
  const recordSpinMutation = useMutation({
    mutationFn: api.recordSpin,
    onSuccess: () => {
      addToast('success', 'resultRecorded', 'prizeRecorded');
    },
    onError: () => {
      addToast('error', 'recordingFailed', 'resultNotRecorded');
    },
  });

  const addToast = (type: ToastType, titleKey: string, messageKey?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { 
      id, 
      type, 
      title: t(titleKey as any), 
      message: messageKey ? t(messageKey as any) : undefined 
    }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleSpin = async (formData: { name: string; phone: string }) => {
    setIsCheckingSpin(true);
    
    try {
      // Check if phone already exists
      const checkResult = await api.checkSpin(formData.phone);
      
      if (!checkResult.canSpin) {
        addToast('error', 'alreadyParticipated', 'phoneAlreadyUsed');
        return;
      }

      // Store form data for later use
      setCurrentResult({ prize: '', name: formData.name, phone: formData.phone });
      
      // Start spinning
      spin();
      
    } catch (error) {
      addToast('error', 'spinFailed', 'checkEligibilityFailed');
    } finally {
      setIsCheckingSpin(false);
    }
  };

  const handleResultModalClose = async () => {
    setIsResultModalOpen(false);
    
    // Record the result
    if (currentResult && winningResult) {
      const result: SpinResult = {
        name: currentResult.name,
        phone: currentResult.phone,
        prize: currentResult.prize,
        timestamp: new Date().toISOString(),
      };
      
      try {
        await recordSpinMutation.mutateAsync(result);
      } catch (error) {
        // Error already handled by mutation
      }
    }
    
    setCurrentResult(null);
    // Don't reset the wheel - let it stay in its current position
  };

  const handleAdminLogin = async (password: string): Promise<boolean> => {
    try {
      const result = await adminLoginMutation.mutateAsync(password);
      return result.authenticated;
    } catch {
      return false;
    }
  };

  const handleSaveConfig = async (config: { slices: WheelSlice[] }) => {
    await saveConfigMutation.mutateAsync(config);
  };

  if (configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-pink mx-auto mb-4"></div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <Header 
          title={t('title')}
          onLanguageChange={setLanguage}
          currentLanguage={language}
        />

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Wheel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center relative"
          >
            <Wheel
              slices={config.slices}
              currentAngle={currentAngle}
              isSpinning={isSpinning}
              size={400}
            />
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SpinForm
              onSubmit={handleSpin}
              isSpinning={isSpinning}
              isLoading={isCheckingSpin}
            />
          </motion.div>
        </div>

        {/* Admin button */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setIsAdminModalOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-brand-cyan to-brand-green rounded-full shadow-lg hover:scale-110 transition-transform duration-300 z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Settings className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Modals */}
      <ResultModal
        isOpen={isResultModalOpen}
        onClose={handleResultModalClose}
        prize={currentResult?.prize || ''}
        name={currentResult?.name || ''}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLogin={handleAdminLogin}
        onSaveConfig={handleSaveConfig}
        initialConfig={config}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default App;
