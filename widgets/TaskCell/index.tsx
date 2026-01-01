'use client';

import { Cell } from '@/designs/Cell';
import { ProgressBar } from '@/designs/ProgressBar';
import { Task } from '@/states';

export interface TaskCellProps {
  task: Task;
  isSelected?: boolean;
  onIncrement?: () => void;
  onSelect?: () => void;
}

/**
 * TaskCell - タスクセルコンポーネント（コンテナ）
 * タスクの表示とインクリメント機能を持つ
 */
export const TaskCell = ({
  task,
  isSelected = false,
  onIncrement,
  onSelect,
}: TaskCellProps) => {
  const handleClick = () => {
    if (onIncrement) {
      onIncrement();
    } else if (onSelect) {
      onSelect();
    }
  };

  return (
    <Cell variant="task" isSelected={isSelected} onClick={handleClick}>
      <div className="flex w-full flex-col gap-2">
        <div className="text-xs font-semibold text-gray-800 leading-tight">{task.title}</div>
        <ProgressBar
          current={task.currentCount}
          target={task.targetCount}
          showLabel={false}
          unit="回"
        />
      </div>
    </Cell>
  );
};
