'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Modal } from '@/designs/Modal';
import { Input } from '@/designs/Input';
import { IconButton } from '@/designs/IconButton';
import { Button } from '@/designs/Button';
import { Alert } from '@/designs/Alert';
import { useMandalartSelector, Task } from '@/states';
import { updateTaskAsync, deleteTaskAsync } from '@/states/slice';

export interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

/**
 * TaskEditModal - タスク編集モーダルコンポーネント
 * 1タスクの詳細編集
 */
export const TaskEditModal = ({ isOpen, onClose, task }: TaskEditModalProps) => {
  const dispatch = useDispatch();
  const { error, isLoading } = useMandalartSelector();
  const [localError, setLocalError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ローカル編集用の状態
  const [title, setTitle] = useState('');
  const [currentCount, setCurrentCount] = useState(0);
  const [targetCount, setTargetCount] = useState(0);
  const [targetUnit, setTargetUnit] = useState('');

  // タスクが変わったらローカル状態を更新
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setCurrentCount(task.currentCount);
      setTargetCount(task.targetCount);
      setTargetUnit(task.targetUnit);
      setShowDeleteConfirm(false);
      setLocalError(null);
    }
  }, [task]);

  if (!task) {
    return null;
  }

  const handleSave = async () => {
    setLocalError(null);

    // バリデーション
    if (!title.trim()) {
      setLocalError('タスク名を入力してください');
      return;
    }
    if (targetCount <= 0) {
      setLocalError('目標値は1以上を設定してください');
      return;
    }
    if (!targetUnit.trim()) {
      setLocalError('単位を入力してください');
      return;
    }
    if (currentCount < 0 || currentCount > targetCount) {
      setLocalError(`現在のカウントは0〜${targetCount}の範囲で設定してください`);
      return;
    }

    try {
      await dispatch(updateTaskAsync({
        taskId: task.id,
        updates: {
          title: title.trim(),
          currentCount,
          targetCount,
          targetUnit: targetUnit.trim(),
        },
      }) as any);
      onClose();
    } catch (err) {
      setLocalError('タスクの更新中にエラーが発生しました');
    }
  };

  const handleIncrement = () => {
    if (currentCount < targetCount) {
      setCurrentCount(currentCount + 1);
    }
  };

  const handleDecrement = () => {
    if (currentCount > 0) {
      setCurrentCount(currentCount - 1);
    }
  };

  const handleTargetIncrement = () => {
    setTargetCount(targetCount + 1);
  };

  const handleTargetDecrement = () => {
    if (targetCount > 1) {
      setTargetCount(targetCount - 1);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    setLocalError(null);
    try {
      await dispatch(deleteTaskAsync({
        taskId: task.id,
        goalId: task.goalId,
      }) as any);
      onClose();
    } catch (err) {
      setLocalError('タスクの削除中にエラーが発生しました');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="タスク編集" size="sm">
      <div className="space-y-6">
        {/* エラー表示 */}
        {(error || localError) && (
          <Alert variant="error">
            {localError || error}
          </Alert>
        )}

        {/* 削除確認 */}
        {showDeleteConfirm && (
          <Alert variant="warning">
            <div className="space-y-3">
              <p className="font-semibold">本当にこのタスクを削除しますか？</p>
              <p className="text-sm">この操作は取り消せません。</p>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  削除する
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                >
                  キャンセル
                </Button>
              </div>
            </div>
          </Alert>
        )}

        {/* タスク名 */}
        <div>
          <Input
            label="タスク名"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: ジムに行く"
            disabled={isLoading}
          />
        </div>

        {/* 現在のカウント */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            現在のカウント
          </label>
          <div className="flex items-center gap-3">
            <IconButton
              icon={<Minus size={18} />}
              onClick={handleDecrement}
              disabled={isLoading || currentCount === 0}
              variant="default"
            />
            <Input
              type="number"
              value={currentCount}
              min={0}
              max={targetCount}
              onChange={(e) => {
                const newCount = parseInt(e.target.value, 10);
                if (!isNaN(newCount) && newCount >= 0 && newCount <= targetCount) {
                  setCurrentCount(newCount);
                }
              }}
              disabled={isLoading}
              className="text-center flex-1"
            />
            <IconButton
              icon={<Plus size={18} />}
              onClick={handleIncrement}
              disabled={isLoading || currentCount >= targetCount}
              variant="primary"
            />
          </div>
        </div>

        {/* 目標値と単位 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              目標値
            </label>
            <div className="flex items-center gap-3">
              <IconButton
                icon={<Minus size={18} />}
                onClick={handleTargetDecrement}
                disabled={isLoading || targetCount === 1}
                variant="default"
              />
              <Input
                type="number"
                value={targetCount}
                min={1}
                onChange={(e) => {
                  const newTarget = parseInt(e.target.value, 10);
                  if (!isNaN(newTarget) && newTarget > 0) {
                    setTargetCount(newTarget);
                  }
                }}
                disabled={isLoading}
                className="text-center flex-1"
              />
              <IconButton
                icon={<Plus size={18} />}
                onClick={handleTargetIncrement}
                disabled={isLoading}
                variant="primary"
              />
            </div>
          </div>
          <div>
            <Input
              label="単位"
              value={targetUnit}
              onChange={(e) => setTargetUnit(e.target.value)}
              placeholder="回/週"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 進捗表示 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">進捗</span>
            <span className="text-sm font-bold text-gray-900">
              {currentCount} / {targetCount}{targetUnit}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                currentCount >= targetCount
                  ? 'bg-emerald-500'
                  : 'bg-blue-500'
              }`}
              style={{
                width: `${targetCount > 0 ? (currentCount / targetCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-3 justify-between pt-4 border-t border-gray-200">
          <Button
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading || showDeleteConfirm}
            icon={<Trash2 size={16} />}
          >
            削除
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isLoading || showDeleteConfirm}
            >
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
