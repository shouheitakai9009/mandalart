import { motion } from 'framer-motion';

export interface ProgressBarProps {
  current: number;
  target: number;
  className?: string;
  showLabel?: boolean;
  unit?: string;
}

/**
 * ProgressBar - 進捗バーコンポーネント（プレゼンテーショナル）
 * タスクの進捗状況を視覚的に表示
 */
export const ProgressBar = ({
  current,
  target,
  className = '',
  showLabel = true,
  unit = '回',
}: ProgressBarProps) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isComplete = current >= target;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative h-7 w-full overflow-hidden rounded-lg bg-red-100 shadow-inner">
        <motion.div
          className={`h-full ${
            isComplete
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm'
              : 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-gray-800">
            {current} / {target}{unit}
          </span>
        </div>
      </div>
    </div>
  );
};
