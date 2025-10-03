import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  onClose: (id: string) => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    iconColor: 'text-green-400',
    titleColor: 'text-green-100',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
    iconColor: 'text-red-400',
    titleColor: 'text-red-100',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
    iconColor: 'text-yellow-400',
    titleColor: 'text-yellow-100',
  },
  info: {
    icon: AlertCircle,
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-100',
  },
};

export function Toast({ id, type, title, message, onClose, duration = 5000 }: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`${config.bgColor} ${config.borderColor} border backdrop-blur-sm rounded-lg p-4 min-w-80 max-w-md shadow-lg`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1 min-w-0">
          <h4 className={`${config.titleColor} font-medium text-sm`}>
            {title}
          </h4>
          {message && (
            <p className="text-white/80 text-sm mt-1">
              {message}
            </p>
          )}
        </div>
        
        <button
          onClick={() => onClose(id)}
          className="text-white/60 hover:text-white/80 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

