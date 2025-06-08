import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter, Heading, Text, Button } from '@chakra-ui/react';

const meta: Meta<typeof Card> = {
  title: 'UI/Themed Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['outline', 'elevated', 'filled'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: 'elevated',
    size: 'md',
  },
  render: (args) => (
    <Card {...args} maxW="sm">
      <CardHeader>
        <Heading size="md">Card Title</Heading>
      </CardHeader>
      <CardBody>
        <Text>This is the main body content of the card. It provides details and information about the subject.</Text>
      </CardBody>
      <CardFooter>
        <Button colorScheme="primary">View Details</Button>
      </CardFooter>
    </Card>
  ),
};

export const Outline: Story = {
    ...Default,
    args: {
        ...Default.args,
        variant: 'outline'
    }
}

export const Filled: Story = {
    ...Default,
    args: {
        ...Default.args,
        variant: 'filled'
    }
}