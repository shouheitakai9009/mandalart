'use client';

import { Grid } from '@/designs/Grid';
import { GoalSection } from '@/widgets/GoalSection';
import { CenterSection } from '@/widgets/CenterSection';
import { Mandalart, Task } from '@/states';
import { GOAL_COLORS } from '@/libs/constants';

export interface MandalartGridProps {
  mandalart: Mandalart;
  onTaskClick?: (task: Task) => void;
  onMainGoalClick?: () => void;
  selectedCellId?: string | null;
}

/**
 * MandalartGrid - マンダラート全体のグリッドコンポーネント（コンテナ）
 * 3x3の大セクションで構成され、各セクションが3x3のグリッド
 * 中央セクション: 大目標（中心）+ 8つの目標タイトル（周囲）
 * 周辺8セクション: 各目標の詳細（目標タイトル + 8つのタスク）
 */
export const MandalartGrid = ({
  mandalart,
  onTaskClick,
  onMainGoalClick,
  selectedCellId,
}: MandalartGridProps) => {
  // 目標を位置順にソート
  const sortedGoals = [...mandalart.goals].sort(
    (a, b) => a.position - b.position
  );

  return (
    <Grid size={3} gap="md" className="w-full max-w-6xl">
      {Array.from({ length: 9 }, (_, index) => {
        const position = index + 1;

        // 中心のセクションは大目標 + 8つの目標タイトル
        if (position === 5) {
          return (
            <div key="center-section" className="w-full h-full shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg overflow-hidden">
              <CenterSection
                mainGoal={mandalart.mainGoal}
                goals={mandalart.goals}
                onMainGoalClick={onMainGoalClick}
                goalColors={GOAL_COLORS}
              />
            </div>
          );
        }

        // 周りの8つのセクションは各目標の詳細（目標タイトル + タスク）
        const goalPosition = position > 5 ? position - 1 : position;
        const goal = sortedGoals.find((g) => g.position === goalPosition);

        if (!goal) {
          return (
            <div key={`empty-${index}`} className="w-full h-full shadow-xl rounded-lg overflow-hidden">
              <Grid size={3} gap="none" className="w-full h-full" />
            </div>
          );
        }

        // 目標の色を取得
        const goalColor = GOAL_COLORS[goalPosition - 1];

        return (
          <div key={goal.id} className="w-full h-full shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg overflow-hidden">
            <GoalSection
              goal={goal}
              onTaskClick={onTaskClick}
              selectedTaskId={selectedCellId}
              goalColor={goalColor}
            />
          </div>
        );
      })}
    </Grid>
  );
};
