import { ReactNode } from 'react';

export interface GridProps {
  children: ReactNode;
  size?: 3 | 9;
  className?: string;
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Grid - グリッドレイアウトコンポーネント（プレゼンテーショナル）
 * 3x3または9x9のグリッドレイアウトを提供
 */
export const Grid = ({
  children,
  size = 9,
  className = '',
  gap = 'sm',
}: GridProps) => {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-4',
  };

  const gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;

  return (
    <div
      className={`grid ${gapClasses[gap]} ${className}`}
      style={{ gridTemplateColumns }}
    >
      {children}
    </div>
  );
};
