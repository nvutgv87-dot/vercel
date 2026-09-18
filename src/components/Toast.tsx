import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { AppNotification } from '../types';

interface ToastProps {
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {notifications.map((n) => {
        let bg = 'bg-slate-900 text-white';
        let Icon = Info;
        if (n.type === 'success') {
          bg = 'bg-emerald-600 text-white shadow-emerald-900/20';
          Icon = CheckCircle2;
        } else if (n.type === 'warning') {
          bg = 'bg-amber-600 text-white shadow-amber-900/20';
          Icon = AlertTriangle;
        } else if (n.type === 'error') {
          bg = 'bg-rose-600 text-white shadow-rose-900/20';
          Icon = XCircle;
        }

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 ${bg}`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{n.message}</span>
            </div>
            <button
              onClick={() => onDismiss(n.id)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors ml-3"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
