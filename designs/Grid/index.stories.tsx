import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './index';
import { Cell } from '../Cell';

const meta = {
  title: 'Designs/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: [3, 9],
      description: 'グリッドのサイズ',
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'グリッド間の間隔',
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeByThree: Story = {
  args: {
    size: 3,
    gap: 'md',
    children: Array.from({ length: 9 }, (_, i) => (
      <Cell key={i} variant={i === 4 ? 'main' : 'goal'}>
        {i === 4 ? '大目標' : `目標 ${i + 1}`}
      </Cell>
    )),
  },
};

export const NineByNine: Story = {
  args: {
    size: 9,
    gap: 'sm',
    children: Array.from({ length: 81 }, (_, i) => (
      <Cell
        key={i}
        variant={
          i === 40
            ? 'main'
            : [13, 22, 31, 49, 58, 67, 4, 76].includes(i)
              ? 'goal'
              : 'task'
        }
      >
        {i === 40 ? '大目標' : i % 9 === 4 && i !== 40 ? `目標${i}` : `タスク${i}`}
      </Cell>
    )),
  },
};

export const SmallGap: Story = {
  args: {
    size: 3,
    gap: 'sm',
    children: Array.from({ length: 9 }, (_, i) => (
      <Cell key={i}>セル {i + 1}</Cell>
    )),
  },
};

export const LargeGap: Story = {
  args: {
    size: 3,
    gap: 'lg',
    children: Array.from({ length: 9 }, (_, i) => (
      <Cell key={i}>セル {i + 1}</Cell>
    )),
  },
};
