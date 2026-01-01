'use client';

import { Grid } from '@/designs/Grid';
import { Cell } from '@/designs/Cell';
import { TaskCell } from '@/widgets/TaskCell';
import { Goal } from '@/states';

export interface GoalSectionProps {
  goal: Goal;
  onTaskIncrement?: (taskId: string) => void;
  onGoalSelect?: () => void;
  selectedTaskId?: string | null;
  goalColor?: string;
}

/**
 * GoalSection - 3x3の目標セクションコンポーネント（コンテナ）
 * 目標と8つのタスクを表示
 */
export const GoalSection = ({
  goal,
  onTaskIncrement,
  onGoalSelect,
  selectedTaskId,
  goalColor,
}: GoalSectionProps) => {
  // タスクを位置順にソート
  const sortedTasks = [...goal.tasks].sort((a, b) => a.position - b.position);

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
            >
              <div className="text-center text-sm font-bold leading-tight px-1">
                {goal.title}
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
            onIncrement={
              onTaskIncrement ? () => onTaskIncrement(task.id) : undefined
            }
          />
        );
      })}
    </Grid>
  );
};
