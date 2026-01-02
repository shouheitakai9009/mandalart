'use client';

export interface MandalartHeaderProps {
  title: string;
}

/**
 * MandalartHeader - マンダラートヘッダーコンポーネント
 * マンダラート名を表示
 */
export const MandalartHeader = ({ title }: MandalartHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 truncate">{title}</h1>
      </div>
    </header>
  );
};
