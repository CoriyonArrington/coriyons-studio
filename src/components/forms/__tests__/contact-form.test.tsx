// FINAL ATTEMPT: Definitive fix by radically simplifying the Form mock.
// - Replaced the complex and problematic `React.forwardRef` mock with a simple
//   functional component mock. This avoids all the complex typing issues.
// - Removed the unused 'axe' import.

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import ContactForm from '../contact-form';

// Mock the server action
import { submitContactForm as actualSubmitContactForm } from '@/src/lib/actions/contact-actions';

vi.mock('@/src/lib/actions/contact-actions', () => ({
  submitContactForm: vi.fn(),
}));
const mockedSubmitContactForm = actualSubmitContactForm as Mock;

// Define a clear type for the mock Form's props
type MockFormProps = {
  action: (payload: FormData) => void;
  children: React.ReactNode;
  [key: string]: unknown;
};

// FIX: Radically simplified the mock to be a simple functional component.
vi.mock('@/src/components/forms', () => {
  const MockForm = ({ action, children, ...props }: MockFormProps) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        action(formData);
      }}
      {...props}
    >
      {children}
    </form>
  );

  const MockFormField = ({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode; }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <div role="alert" data-testid={`error-${id}`}>{error}</div>}
    </div>
  );

  const MockFormMessage = ({ message }: { message: { success?: string; error?: string; title?: string }; }) => (
    <div role="status" data-testid="form-message">
      {message.title && <h4>{message.title}</h4>}
      {message.success && <p>{message.success}</p>}
      {message.error && <p>{message.error}</p>}
    </div>
  );

  const MockSubmitButton = ({ children, ...props }: { children: React.ReactNode; } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="submit" {...props}>{children}</button>
  );

  return {
    Form: MockForm,
    FormField: MockFormField,
    FormMessage: MockFormMessage,
    SubmitButton: MockSubmitButton,
  };
});


const baseTheme = {};
const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(baseTheme);
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

const setup = () => {
  const user = userEvent.setup();
  renderWithChakra(<ContactForm />);
  const nameInput = screen.getByPlaceholderText('e.g., Jane Doe');
  const emailInput = screen.getByPlaceholderText('e.g., jane.doe@example.com');
  const messageTextarea = screen.getByPlaceholderText('Your message here...');
  const submitButton = screen.getByRole('button', { name: /Send Message/i });
  return { user, nameInput, emailInput, messageTextarea, submitButton };
};

interface TestFormState {
  success: boolean;
  message: string;
  errors?: { [key: string]: string[] | undefined };
  submissionId?: string;
}

describe('ContactForm', () => {
  beforeEach(() => {
    mockedSubmitContactForm.mockReset();
    mockedSubmitContactForm.mockImplementation(
      (prevState: TestFormState | undefined): Promise<TestFormState> => {
        return Promise.resolve(prevState || { success: false, message: '', errors: undefined });
      }
    );
  });

  it('should render all form fields and submit button', () => {
    const { nameInput, emailInput, messageTextarea, submitButton } = setup();
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(messageTextarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  describe('Form Submission', () => {
    it('should submit data and display success message, then reset form', async () => {
      const { user, nameInput, emailInput, messageTextarea, submitButton } = setup();
      const successMessage = 'Your message has been sent successfully!';
      mockedSubmitContactForm.mockResolvedValueOnce({
        success: true,
        message: successMessage,
        errors: undefined,
        submissionId: '123-abc',
      });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(messageTextarea, 'Hello World');
      
      await user.click(submitButton);

      const formMessageContainer = await screen.findByTestId('form-message');
      expect(formMessageContainer).toHaveTextContent('Success!');
      expect(formMessageContainer).toHaveTextContent(successMessage);

      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(messageTextarea).toHaveValue('');
    });
  });
});