import type { Meta, StoryObj } from '@storybook/react';
import ContentSection from './content-section';

const meta: Meta<typeof ContentSection> = {
  title: 'Common/ContentSection',
  component: ContentSection,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'subtle', 'inverse'] },
    textAlign: { control: 'select', options: ['left', 'center', 'right'] },
    headline: { control: 'text' },
    body: { control: 'text' },
    cta: { control: 'text' },
    href: { control: 'text' },
    ctaRightIcon: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ContentSection>;

export const Default: Story = {
  args: {
    id: 'cs-default',
    headline: 'Powering the Future of Digital Design',
    body: 'We build beautiful and functional websites that are fast, secure, and easy to manage. Explore our services to see how we can help you.',
    cta: 'Learn More',
    href: '#',
    ctaRightIcon: true,
  },
};

export const Subtle: Story = {
  args: {
    ...Default.args,
    id: 'cs-subtle',
    variant: 'subtle',
    textAlign: 'left',
    headline: 'A More Understated Approach',
    ctaColorScheme: 'secondary',
  },
};

export const Inverse: Story = {
  args: {
    ...Default.args,
    id: 'cs-inverse',
    variant: 'inverse',
    headline: 'A Bold Statement on a Dark Background',
  },
};

export const WithChildren: Story = {
  args: {
    id: 'cs-with-children',
    headline: 'Custom Content Inside',
    body: 'This section demonstrates how you can pass custom components as children.',
    cta: undefined,
    href: undefined,
  },
  render: (args) => (
    <ContentSection {...args}>
      <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        This is a custom div passed as a child.
      </div>
    </ContentSection>
  ),
};