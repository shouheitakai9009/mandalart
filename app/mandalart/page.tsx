'use client';

import { useState } from 'react';
import { MandalartGrid } from '@/widgets/MandalartGrid';
import { useMandalartActions, Mandalart } from '@/states';

// サンプルデータ（デモ用）
const createSampleMandalart = (): Mandalart => ({
  id: 'sample-1',
  mainGoal: '健康的な生活を送る',
  status: 'ACTIVE',
  userId: 'user-1',
  startDate: new Date().toISOString(),
  endDate: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  goals: [
    {
      id: 'goal-1',
      title: '運動習慣をつける',
      position: 1,
      mandalartId: 'sample-1',
      tasks: [
        {
          id: 'task-1-1',
          title: 'ジムに行く',
          currentCount: 3,
          targetCount: 7,
          targetUnit: '回/週',
          position: 1,
          goalId: 'goal-1',
        },
        {
          id: 'task-1-2',
          title: 'ランニング',
          currentCount: 2,
          targetCount: 5,
          targetUnit: '回/週',
          position: 2,
          goalId: 'goal-1',
        },
        {
          id: 'task-1-3',
          title: 'ストレッチ',
          currentCount: 5,
          targetCount: 7,
          targetUnit: '回/週',
          position: 3,
          goalId: 'goal-1',
        },
        {
          id: 'task-1-4',
          title: 'ヨガ',
          currentCount: 1,
          targetCount: 3,
          targetUnit: '回/週',
          position: 4,
          goalId: 'goal-1',
        },
        {
          id: 'task-1-5',
          title: '筋トレ',
          currentCount: 4,
          targetCount: 5,
          targetUnit: '回/週',
          position: 5,
          goalId: 'goal-1',
        },
        {
          id: 'task-1-6',
          title: 'ウォーキング',
          currentCount: 6,
          targetCount: 7,
          targetUnit: '回/週',
          position: 6,
          goalId: 'goal-1',
        },
        {
          id: 'task-1-7',
          title: '水泳',
          currentCount: 0,
          targetCount: 2,
          targetUnit: '回/週',
          position: 7,
          goalId: 'goal-1',
        },
        {
          id: 'task-1-8',
          title: 'サイクリング',
          currentCount: 1,
          targetCount: 2,
          targetUnit: '回/週',
          position: 8,
          goalId: 'goal-1',
        },
      ],
    },
    {
      id: 'goal-2',
      title: '食生活を改善する',
      position: 2,
      mandalartId: 'sample-1',
      tasks: Array.from({ length: 8 }, (_, i) => ({
        id: `task-2-${i + 1}`,
        title: `食事タスク${i + 1}`,
        currentCount: i % 3,
        targetCount: 7,
        targetUnit: '回/週',
        position: i + 1,
        goalId: 'goal-2',
      })),
    },
    {
      id: 'goal-3',
      title: '睡眠の質を上げる',
      position: 3,
      mandalartId: 'sample-1',
      tasks: Array.from({ length: 8 }, (_, i) => ({
        id: `task-3-${i + 1}`,
        title: `睡眠タスク${i + 1}`,
        currentCount: i % 4,
        targetCount: 7,
        targetUnit: '回/週',
        position: i + 1,
        goalId: 'goal-3',
      })),
    },
    ...Array.from({ length: 5 }, (_, goalIndex) => {
      const position = goalIndex + 4;
      return {
        id: `goal-${position}`,
        title: `目標${position}`,
        position,
        mandalartId: 'sample-1',
        tasks: Array.from({ length: 8 }, (_, taskIndex) => ({
          id: `task-${position}-${taskIndex + 1}`,
          title: `タスク${taskIndex + 1}`,
          currentCount: taskIndex % 5,
          targetCount: 7,
          targetUnit: '回/週',
          position: taskIndex + 1,
          goalId: `goal-${position}`,
        })),
      };
    }),
  ],
});

export default function MandalartPage() {
  // ローカル状態でマンダラートを管理（デモ用）
  const [mandalart] = useState<Mandalart>(createSampleMandalart);
  const [localMandalart, setLocalMandalart] = useState<Mandalart>(mandalart);

  const handleTaskIncrement = (goalId: string, taskId: string) => {
    setLocalMandalart((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              tasks: goal.tasks.map((task) =>
                task.id === taskId && task.currentCount < task.targetCount
                  ? { ...task, currentCount: task.currentCount + 1 }
                  : task
              ),
            }
          : goal
      ),
    }));
  };

  const handleMainGoalClick = () => {
    alert('大目標がクリックされました！');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-center text-4xl font-bold text-gray-800 tracking-tight">
          マンダラート
        </h1>
        <div className="flex justify-center">
          <MandalartGrid
            mandalart={localMandalart}
            onTaskIncrement={handleTaskIncrement}
            onMainGoalClick={handleMainGoalClick}
            selectedCellId={null}
          />
        </div>
        <div className="mt-10 text-center text-sm text-gray-600">
          <p className="font-medium">タスクをクリックすると進捗が更新されます</p>
        </div>
      </div>
    </div>
  );
}
