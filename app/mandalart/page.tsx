'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { MandalartGrid } from '@/widgets/MandalartGrid';
import { MandalartSidebar } from '@/widgets/MandalartSidebar';
import { TaskListSidebar } from '@/widgets/TaskListSidebar';
import { MandalartHeader } from '@/widgets/MandalartHeader';
import { TaskEditModal } from '@/widgets/TaskEditModal';
import { GoalDeleteModal } from '@/widgets/GoalDeleteModal';
import { useMandalartSelector, Task, Goal } from '@/states';
import { fetchMandalarts, deleteGoalAsync } from '@/states/slice';

export default function MandalartPage() {
  const dispatch = useDispatch();
  const { currentMandalart, isLoadingMandalarts, isLoadingTask, error } = useMandalartSelector();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleGoalDelete = (goal: Goal) => {
    setGoalToDelete(goal);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!goalToDelete) return;

    try {
      await dispatch(deleteGoalAsync(goalToDelete.id) as any);
      setIsDeleteModalOpen(false);
      setGoalToDelete(null);
    } catch (error) {
      console.error('目標の削除に失敗しました:', error);
    }
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setGoalToDelete(null);
  };

  // エラー表示（ページ全体）
  if (error && !currentMandalart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
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
        {currentMandalart && <MandalartHeader title={currentMandalart.mainGoal} />}

        {/* マンダラートグリッド */}
        <div className="flex-1 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-8">
          <div className="mx-auto max-w-7xl">
            {isLoadingMandalarts ? (
              <div className="flex items-center justify-center h-full min-h-[600px]">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                  <p className="text-lg text-gray-600">マンダラートを読み込み中...</p>
                </div>
              </div>
            ) : currentMandalart ? (
              <>
                <div className="flex justify-center">
                  <MandalartGrid
                    mandalart={currentMandalart}
                    onTaskClick={handleTaskClick}
                    onMainGoalClick={handleMainGoalClick}
                    onGoalDelete={handleGoalDelete}
                    selectedCellId={null}
                  />
                </div>
                <div className="mt-10 text-center text-sm text-gray-600">
                  <p className="font-medium">
                    タスクをクリックすると編集モーダルが開きます
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[600px]">
                <p className="text-lg text-gray-600">マンダラートを選択してください</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* タスク編集モーダル */}
      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        task={selectedTask}
      />

      {/* 目標削除確認モーダル */}
      <GoalDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        goal={goalToDelete}
        isDeleting={isLoadingTask}
      />
    </div>
  );
}
