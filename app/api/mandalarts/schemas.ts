import { z } from 'zod';

// タスク作成用スキーマ
export const createTaskSchema = z.object({
  title: z.string().min(1, 'タスク名は必須です'),
  targetCount: z.number().int().positive('目標回数は1以上の整数である必要があります'),
  targetUnit: z.string().min(1, '目標単位は必須です'),
});

// 目標作成用スキーマ
export const createGoalSchema = z.object({
  title: z.string().min(1, '目標名は必須です'),
  tasks: z.array(createTaskSchema).length(8, '各目標には8つのタスクが必要です'),
});

// マンダラート作成用スキーマ
export const createMandalartSchema = z.object({
  userId: z.string().min(1, 'ユーザーIDは必須です'),
  mainGoal: z.string().min(1, '大目標は必須です'),
  goals: z.array(createGoalSchema).length(8, 'マンダラートには8つの目標が必要です'),
});

// マンダラート更新用スキーマ
export const updateMandalartSchema = z.object({
  mainGoal: z.string().min(1, '大目標は必須です').optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'DELETED']).optional(),
});

// タスク更新用スキーマ
export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  currentCount: z.number().int().min(0).optional(),
  targetCount: z.number().int().positive().optional(),
  targetUnit: z.string().min(1).optional(),
});

// 目標更新用スキーマ
export const updateGoalSchema = z.object({
  title: z.string().min(1).optional(),
});

// 型推論
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type CreateMandalartInput = z.infer<typeof createMandalartSchema>;
export type UpdateMandalartInput = z.infer<typeof updateMandalartSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
