'use client';

import { Grid } from '@/designs/Grid';
import { Cell } from '@/designs/Cell';
import { Goal } from '@/states';

export interface CenterSectionProps {
  mainGoal: string;
  goals: Goal[];
  onMainGoalClick?: () => void;
  onGoalClick?: (goalId: string) => void;
  goalColors?: string[];
}

/**
 * CenterSection - 中央の大目標セクションコンポーネント
 * 3x3のグリッドで、中心に大目標、周りに8つの目標タイトルを配置
 */
export const CenterSection = ({
  mainGoal,
  goals,
  onMainGoalClick,
  onGoalClick,
  goalColors = [],
}: CenterSectionProps) => {
  // 目標を位置順にソート
  const sortedGoals = [...goals].sort((a, b) => a.position - b.position);

  return (
    <Grid size={3} gap="none" className="w-full h-full">
      {Array.from({ length: 9 }, (_, index) => {
        const position = index + 1;

        // 中心のセルは大目標
        if (position === 5) {
          return (
            <Cell
              key="main-goal"
              variant="main"
              onClick={onMainGoalClick}
            >
              <div className="text-center text-base font-bold leading-tight px-2">
                {mainGoal}
              </div>
            </Cell>
          );
        }

        // 周りの8つのセルは目標タイトル
        const goalPosition = position > 5 ? position - 1 : position;
        const goal = sortedGoals.find((g) => g.position === goalPosition);

        if (!goal) {
          return <Cell key={`empty-${index}`} variant="goal" />;
        }

        // 目標の色を取得（goalPosition - 1がインデックス）
        const goalColor = goalColors[goalPosition - 1];

        return (
          <Cell
            key={goal.id}
            variant="goal"
            onClick={onGoalClick ? () => onGoalClick(goal.id) : undefined}
            bgColor={goalColor}
          >
            <div className="text-center text-xs font-bold leading-tight px-1">
              {goal.title}
            </div>
          </Cell>
        );
      })}
    </Grid>
  );
};
