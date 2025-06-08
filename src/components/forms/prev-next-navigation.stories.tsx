/*
 FINAL VERSION - Key Changes:
 - Corrected the import paths to be absolute (@/src/...), resolving the TypeScript error.
*/
import type { Meta, StoryObj } from '@storybook/react';
import PrevNextNavigation from '@/src/components/common/prev-next-navigation';
import type { NavLinkInfo } from '@/src/components/common/prev-next-navigation';

const meta: Meta<typeof PrevNextNavigation> = {
  title: 'Common/PrevNextNavigation',
  component: PrevNextNavigation,
  tags: ['autodocs'],
  argTypes: {
    previousPage: { control: 'object' },
    nextPage: { control: 'object' },
    basePath: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof PrevNextNavigation>;

const mockPrevPage: NavLinkInfo = {
  slug: 'previous-article',
  title: 'An Older, Really Interesting Article',
  categoryLabel: 'Previous Post',
};

const mockNextPage: NavLinkInfo = {
  slug: 'next-article',
  title: 'A Newer, More Exciting Article',
  categoryLabel: 'Next Post',
};

export const WithBothLinks: Story = {
  name: 'Default (With Both Links)',
  args: {
    previousPage: mockPrevPage,
    nextPage: mockNextPage,
    basePath: '/blog',
  },
};

export const OnlyPrevious: Story = {
  name: 'Only Previous Link',
  args: {
    previousPage: mockPrevPage,
    nextPage: undefined,
    basePath: '/blog',
  },
};

export const OnlyNext: Story = {
  name: 'Only Next Link',
  args: {
    previousPage: undefined,
    nextPage: mockNextPage,
    basePath: '/blog',
  },
};