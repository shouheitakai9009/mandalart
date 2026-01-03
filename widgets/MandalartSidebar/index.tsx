'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useMandalartSelector, useMandalartActions } from '@/states';

/**
 * MandalartSidebar - マンダラートサイドバーコンポーネント
 * アクティブなマンダラート一覧とアーカイブセクションを表示
 */
export const MandalartSidebar = () => {
  const { mandalarts, currentMandalart, isLoadingMandalarts } = useMandalartSelector();
  const { setCurrentMandalart } = useMandalartActions();
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  const activeMandalarts = mandalarts.filter((m) => m.status === 'ACTIVE');
  const completedMandalarts = mandalarts.filter((m) => m.status === 'COMPLETED');

  const handleMandalartClick = (mandalartId: string) => {
    const selected = mandalarts.find((m) => m.id === mandalartId);
    if (selected) {
      setCurrentMandalart(selected);
    }
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* ヘッダー */}
      <div className="px-4 py-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">マンダラート</h2>
      </div>

      {/* スクロール可能なコンテンツエリア */}
      <div className="flex-1 overflow-y-auto">
        {/* アクティブなマンダラート */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            アクティブ
          </h3>
          <div className="space-y-2">
            {isLoadingMandalarts ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activeMandalarts.length === 0 ? (
              <p className="text-sm text-gray-500">
                アクティブなマンダラートがありません
              </p>
            ) : (
              activeMandalarts.map((mandalart) => (
                <button
                  key={mandalart.id}
                  onClick={() => handleMandalartClick(mandalart.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                    currentMandalart?.id === mandalart.id
                      ? 'bg-blue-100 text-blue-900 font-semibold shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <p className="text-sm font-medium truncate">
                    {mandalart.mainGoal}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(mandalart.startDate).toLocaleDateString('ja-JP')}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* アーカイブセクション */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setIsArchiveOpen(!isArchiveOpen)}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 hover:text-gray-700 transition-colors"
          >
            <span>アーカイブ ({completedMandalarts.length})</span>
            {isArchiveOpen ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          {isArchiveOpen && (
            <div className="space-y-2">
              {completedMandalarts.length === 0 ? (
                <p className="text-sm text-gray-500">
                  アーカイブされたマンダラートがありません
                </p>
              ) : (
                completedMandalarts.map((mandalart) => (
                  <button
                    key={mandalart.id}
                    onClick={() => handleMandalartClick(mandalart.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                      currentMandalart?.id === mandalart.id
                        ? 'bg-emerald-100 text-emerald-900 font-semibold shadow-sm'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <p className="text-sm font-medium truncate">
                      {mandalart.mainGoal}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      完了: {mandalart.endDate ? new Date(mandalart.endDate).toLocaleDateString('ja-JP') : '-'}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
