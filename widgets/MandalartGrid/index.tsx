'use client';

import { Grid } from '@/designs/Grid';
import { GoalSection } from '@/widgets/GoalSection';
import { CenterSection } from '@/widgets/CenterSection';
import { Mandalart } from '@/states';

export interface MandalartGridProps {
  mandalart: Mandalart;
  onTaskIncrement?: (goalId: string, taskId: string) => void;
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
  onTaskIncrement,
  onMainGoalClick,
  selectedCellId,
}: MandalartGridProps) => {
  // 目標を位置順にソート
  const sortedGoals = [...mandalart.goals].sort(
    (a, b) => a.position - b.position
  );

  // 各目標セルの背景色を定義（goal position 1-8に対応）- より鮮やかな色に
  const goalColors = [
    'bg-gradient-to-br from-blue-200 to-blue-300 text-blue-950 font-semibold',       // goal 1
    'bg-gradient-to-br from-purple-200 to-purple-300 text-purple-950 font-semibold',   // goal 2
    'bg-gradient-to-br from-pink-200 to-pink-300 text-pink-950 font-semibold',       // goal 3
    'bg-gradient-to-br from-green-200 to-green-300 text-green-950 font-semibold',     // goal 4
    'bg-gradient-to-br from-orange-200 to-orange-300 text-orange-950 font-semibold',   // goal 5
    'bg-gradient-to-br from-teal-200 to-teal-300 text-teal-950 font-semibold',       // goal 6
    'bg-gradient-to-br from-indigo-200 to-indigo-300 text-indigo-950 font-semibold',   // goal 7
    'bg-gradient-to-br from-rose-200 to-rose-300 text-rose-950 font-semibold',       // goal 8
  ];

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
                goalColors={goalColors}
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
        const goalColor = goalColors[goalPosition - 1];

        return (
          <div key={goal.id} className="w-full h-full shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg overflow-hidden">
            <GoalSection
              goal={goal}
              onTaskIncrement={
                onTaskIncrement
                  ? (taskId) => onTaskIncrement(goal.id, taskId)
                  : undefined
              }
              selectedTaskId={selectedCellId}
              goalColor={goalColor}
            />
          </div>
        );
      })}
    </Grid>
  );
};
