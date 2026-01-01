import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './index';

const meta = {
  title: 'Designs/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    current: {
      control: { type: 'number', min: 0, max: 10 },
      description: '現在の進捗数',
    },
    target: {
      control: { type: 'number', min: 1, max: 10 },
      description: '目標数',
    },
    showLabel: {
      control: 'boolean',
      description: 'ラベル表示',
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
  args: {
    current: 3,
    target: 7,
    showLabel: true,
  },
};

export const Completed: Story = {
  args: {
    current: 7,
    target: 7,
    showLabel: true,
  },
};

export const JustStarted: Story = {
  args: {
    current: 1,
    target: 7,
    showLabel: true,
  },
};

export const AlmostDone: Story = {
  args: {
    current: 6,
    target: 7,
    showLabel: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    current: 4,
    target: 7,
    showLabel: false,
  },
};
