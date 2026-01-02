import { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Input - テキスト/数値入力コンポーネント（プレゼンテーショナル）
 * バリデーションエラー表示をサポート
 */
export const Input = ({
  label,
  error,
  className = '',
  disabled,
  type = 'text',
  ...props
}: InputProps) => {
  const baseClasses =
    'w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-100 disabled:cursor-not-allowed';

  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`${baseClasses} ${stateClasses} ${className}`}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};
