'use client';

import { useState } from 'react';
import { Grid } from '@/designs/Grid';
import { Cell } from '@/designs/Cell';
import { TaskCell } from '@/widgets/TaskCell';
import { IconButton } from '@/designs/IconButton';
import { Goal, Task } from '@/states';
import { Trash2 } from 'lucide-react';

export interface GoalSectionProps {
  goal: Goal;
  onTaskClick?: (task: Task) => void;
  onGoalSelect?: () => void;
  onGoalDelete?: (goal: Goal) => void;
  selectedTaskId?: string | null;
  goalColor?: string;
}

/**
 * GoalSection - 3x3の目標セクションコンポーネント（コンテナ）
 * 目標と8つのタスクを表示
 */
export const GoalSection = ({
  goal,
  onTaskClick,
  onGoalSelect,
  onGoalDelete,
  selectedTaskId,
  goalColor,
}: GoalSectionProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // タスクを位置順にソート
  const sortedTasks = [...goal.tasks].sort((a, b) => a.position - b.position);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onGoalDelete) {
      onGoalDelete(goal);
    }
  };

  return (
    <Grid size={3} gap="none" className="w-full h-full">
      {Array.from({ length: 9 }, (_, index) => {
        const position = index + 1;

        // 中心のセルは目標
        if (position === 5) {
          return (
            <Cell
              key={`goal-${goal.id}`}
              variant="goal"
              onClick={onGoalSelect}
              bgColor={goalColor}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="text-center text-sm font-bold leading-tight px-1">
                  {goal.title}
                </div>
                {/* 削除ボタン（ホバー時に表示） */}
                {isHovered && onGoalDelete && (
                  <div className="absolute top-1 right-1">
                    <IconButton
                      icon={<Trash2 size={14} />}
                      variant="danger"
                      onClick={handleDeleteClick}
                      className="opacity-90 hover:opacity-100"
                      aria-label="目標を削除"
                    />
                  </div>
                )}
              </div>
            </Cell>
          );
        }

        // 周りの8つのセルはタスク
        // position: 1,2,3,4,6,7,8,9 → task position: 1,2,3,4,5,6,7,8
        const taskPosition = position > 5 ? position - 1 : position;
        const task = sortedTasks.find((t) => t.position === taskPosition);

        if (!task) {
          return <Cell key={`empty-${index}`} variant="task" />;
        }

        return (
          <TaskCell
            key={task.id}
            task={task}
            isSelected={selectedTaskId === task.id}
            onSelect={
              onTaskClick ? () => onTaskClick(task) : undefined
            }
          />
        );
      })}
    </Grid>
  );
};
