'use client';

import { Modal } from '@/designs/Modal';
import { Button } from '@/designs/Button';
import { Goal } from '@/states';
import { Trash2, AlertTriangle } from 'lucide-react';

export interface GoalDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  goal: Goal | null;
  isDeleting?: boolean;
}

/**
 * GoalDeleteModal - 目標削除確認モーダルコンポーネント
 * 目標を削除する前に確認を求める
 */
export const GoalDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  goal,
  isDeleting = false,
}: GoalDeleteModalProps) => {
  if (!goal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="目標を削除" size="sm">
      <div className="space-y-4">
        {/* 警告メッセージ */}
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">この操作は取り消せません</p>
            <p>目標とその配下のすべてのタスクが完全に削除されます。</p>
          </div>
        </div>

        {/* 削除対象の目標情報 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">削除する目標:</p>
          <p className="font-semibold text-gray-900">{goal.title}</p>
          <p className="text-sm text-gray-500 mt-2">
            タスク数: {goal.tasks.length}個
          </p>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            キャンセル
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isDeleting}
            icon={<Trash2 size={18} />}
            className="flex-1"
          >
            {isDeleting ? '削除中...' : '削除する'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
