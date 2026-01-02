'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { MandalartGrid } from '@/widgets/MandalartGrid';
import { MandalartSidebar } from '@/widgets/MandalartSidebar';
import { TaskListSidebar } from '@/widgets/TaskListSidebar';
import { MandalartHeader } from '@/widgets/MandalartHeader';
import { TaskEditModal } from '@/widgets/TaskEditModal';
import { useMandalartSelector, Task } from '@/states';
import { fetchMandalarts } from '@/states/slice';

export default function MandalartPage() {
  const dispatch = useDispatch();
  const { currentMandalart, isLoading, error } = useMandalartSelector();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 初回ロード時にマンダラート一覧を取得
  useEffect(() => {
    dispatch(fetchMandalarts('user-1') as any);
  }, [dispatch]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleMainGoalClick = () => {
    alert('大目標がクリックされました！');
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!currentMandalart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">マンダラートが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 1. マンダラート一覧サイドバー（一番左） */}
      <MandalartSidebar />

      {/* 2. タスク一覧サイドバー（左から2番目） */}
      <TaskListSidebar onTaskClick={handleTaskClick} />

      {/* 3. メインコンテンツ（右側） */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* ヘッダー */}
        <MandalartHeader title={currentMandalart.mainGoal} />

        {/* マンダラートグリッド */}
        <div className="flex-1 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-center">
              <MandalartGrid
                mandalart={currentMandalart}
                onTaskClick={handleTaskClick}
                onMainGoalClick={handleMainGoalClick}
                selectedCellId={null}
              />
            </div>
            <div className="mt-10 text-center text-sm text-gray-600">
              <p className="font-medium">
                タスクをクリックすると編集モーダルが開きます
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* タスク編集モーダル */}
      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        task={selectedTask}
      />
    </div>
  );
}
