import { ReactNode, ButtonHTMLAttributes } from 'react';

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'default' | 'primary' | 'danger';
}

/**
 * IconButton - アイコンボタンコンポーネント（プレゼンテーショナル）
 * +/-などのアイコン操作用、円形デザイン
 */
export const IconButton = ({
  icon,
  variant = 'default',
  className = '',
  disabled,
  ...props
}: IconButtonProps) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full p-1.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    default:
      'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    primary:
      'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500',
    danger:
      'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );
};
