import type { Meta, StoryObj } from '@storybook/react';
import { Cell } from './index';

const meta = {
  title: 'Designs/Cell',
  component: Cell,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['main', 'goal', 'task'],
      description: 'セルの種類',
    },
    isSelected: {
      control: 'boolean',
      description: '選択状態',
    },
    isEditing: {
      control: 'boolean',
      description: '編集状態',
    },
  },
} satisfies Meta<typeof Cell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MainCell: Story = {
  args: {
    children: '健康的な生活を送る',
    variant: 'main',
  },
};

export const GoalCell: Story = {
  args: {
    children: '運動習慣をつける',
    variant: 'goal',
  },
};

export const TaskCell: Story = {
  args: {
    children: 'ジムに行く 3/7回',
    variant: 'task',
  },
};

export const SelectedCell: Story = {
  args: {
    children: 'ジムに行く 3/7回',
    variant: 'task',
    isSelected: true,
  },
};

export const EditingCell: Story = {
  args: {
    children: 'ジムに行く 3/7回',
    variant: 'task',
    isEditing: true,
  },
};

export const ClickableCell: Story = {
  args: {
    children: 'クリックできるセル',
    variant: 'task',
    onClick: () => alert('Clicked!'),
  },
};
