import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export interface CellProps {
  children?: ReactNode;
  variant?: 'main' | 'goal' | 'task';
  isSelected?: boolean;
  isEditing?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  bgColor?: string;
}

/**
 * Cell - マンダラートの個別セルコンポーネント（プレゼンテーショナル）
 * ドメインロジックを持たず、props経由で受け取った値を表示するのみ
 */
export const Cell = ({
  children,
  variant = 'task',
  isSelected = false,
  isEditing = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = '',
  bgColor,
}: CellProps) => {
  const baseClasses = 'flex items-center justify-center p-3 transition-all duration-200 w-full h-full aspect-square border border-gray-200/50';

  const variantClasses = {
    main: 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 font-bold text-base shadow-sm',
    goal: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-900 font-semibold shadow-sm',
    task: 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm',
  };

  const stateClasses = `
    ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1 shadow-md' : ''}
    ${isEditing ? 'bg-yellow-50 shadow-md' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;

  // bgColorが指定されている場合は、それを優先
  const backgroundClass = bgColor || variantClasses[variant];

  return (
    <motion.div
      className={`${baseClasses} ${backgroundClass} ${stateClasses} ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
