'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { useMandalartSelector, Task } from '@/states';
import { GOAL_COLORS } from '@/libs/constants';

export interface TaskListSidebarProps {
  onTaskClick: (task: Task) => void;
}

/**
 * TaskListSidebar - タスク一覧サイドバーコンポーネント
 * 選択中のマンダラートのタスク一覧を目標ごとにグルーピングして表示
 */
export const TaskListSidebar = ({ onTaskClick }: TaskListSidebarProps) => {
  const { currentMandalart } = useMandalartSelector();

  if (!currentMandalart) {
    return (
      <aside className="w-80 h-screen bg-white border-r border-gray-200 flex items-center justify-center">
        <p className="text-sm text-gray-500">マンダラートを選択してください</p>
      </aside>
    );
  }

  return (
    <aside className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        {currentMandalart.goals.map((goal) => {
          const goalColor = GOAL_COLORS[goal.position - 1];

          return (
          <div key={goal.id} className="border-b border-gray-100 last:border-b-0">
            {/* 目標タイトル */}
            <div className={`sticky top-0 px-4 py-3 border-b ${goalColor}`}>
              <h3 className="text-sm font-bold">{goal.title}</h3>
            </div>

            {/* タスク一覧 */}
            <div className="divide-y divide-gray-100">
              {goal.tasks.map((task) => {
                const isComplete = task.currentCount >= task.targetCount;
                const progressPercentage = task.targetCount > 0
                  ? Math.round((task.currentCount / task.targetCount) * 100)
                  : 0;

                return (
                  <button
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 group"
                  >
                    <div className="flex items-start gap-3">
                      {/* 完了アイコン */}
                      <div className="flex-shrink-0 mt-0.5">
                        {isComplete ? (
                          <CheckCircle2
                            size={18}
                            className="text-emerald-500"
                          />
                        ) : (
                          <Circle
                            size={18}
                            className="text-gray-300 group-hover:text-gray-400"
                          />
                        )}
                      </div>

                      {/* タスク情報 */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          isComplete
                            ? 'text-emerald-700 line-through'
                            : 'text-gray-800'
                        }`}>
                          {task.title}
                        </p>

                        {/* 進捗情報 */}
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                isComplete
                                  ? 'bg-emerald-500'
                                  : 'bg-blue-500'
                              }`}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                            {task.currentCount}/{task.targetCount}{task.targetUnit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          );
        })}
    </aside>
  );
};
