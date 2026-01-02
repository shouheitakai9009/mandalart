import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  children: ReactNode;
  className?: string;
}

/**
 * Alert - アラートコンポーネント（プレゼンテーショナル）
 * 情報、成功、警告、エラーメッセージを表示
 */
export const Alert = ({
  variant = 'info',
  children,
  className = '',
}: AlertProps) => {
  const variantConfig = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <Info size={20} />,
    },
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: <CheckCircle size={20} />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertCircle size={20} />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircle size={20} />,
    },
  };

  const config = variantConfig[variant];

  return (
    <div
      className={`${config.bg} ${config.border} ${config.text} border rounded-lg p-4 flex items-start gap-3 ${className}`}
      role="alert"
    >
      <span className="flex-shrink-0 mt-0.5">{config.icon}</span>
      <div className="flex-1 text-sm font-medium">{children}</div>
    </div>
  );
};
