// src/components/forms/__tests__/contact-form.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';

import ContactForm from '../contact-form';
import type { ContactFormData } from '@/src/lib/schemas/contact-form-schema';

// Mock the server action
import { submitContactForm as actualSubmitContactForm } from '@/src/lib/actions/contact-actions';

vi.mock('@/src/lib/actions/contact-actions', () => ({
  submitContactForm: vi.fn(),
}));
const mockedSubmitContactForm = actualSubmitContactForm as Mock;

vi.mock('@/src/components/forms', async () => {
  const ActualReact = await vi.importActual('react') as typeof React;
  return {
    Form: ActualReact.forwardRef<
      HTMLFormElement,
      { action: (payload: FormData) => void | Promise<void>; children: React.ReactNode; [key: string]: any }
    >(({ action, children, ...props }, ref: React.Ref<HTMLFormElement>) => (
      <form
        ref={ref}
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          await act(async () => {
            action(formData);
          });
        }}
        {...props}
      >
        {children}
      </form>
    )),
    FormField: ({
      id,
      label,
      error,
      isRequired,
      children,
    }: {
      id: string;
      label: string;
      error?: string;
      isRequired?: boolean;
      children: React.ReactNode;
    }) => (
      <div>
        <label htmlFor={id}>
          {label}
          {isRequired ? '*' : ''}
        </label>
        {children}
        {error && (
          <div role="alert" data-testid={`error-${id}`}>
            {error}
          </div>
        )}
      </div>
    ),
    FormMessage: ({
      message,
    }: {
      message: { success?: string; error?: string; title?: string };
      w?: string;
    }) => (
      <div role="status" data-testid="form-message">
        {message.title && <h4>{message.title}</h4>}
        {message.success && <p>{message.success}</p>}
        {message.error && <p>{message.error}</p>}
      </div>
    ),
    SubmitButton: ({
      children,
      pendingText,
      ...props
    }: { children: React.ReactNode; pendingText?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button type="submit" {...props}>
        {children}
      </button>
    ),
  };
});

const baseTheme = {
  config: { initialColorMode: 'light', useSystemColorMode: false },
  colors: { 'red.500': 'red', blue: 'blue' },
  components: {},
  styles: { global: {} },
  fonts: { body: 'system-ui, sans-serif', heading: 'Georgia, serif' },
};

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(baseTheme);
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

const setup = () => {
  const user = userEvent.setup();
  const utils = renderWithChakra(
    <ContactForm
      onSubmit={async (_data: ContactFormData) => {
        return { success: false };
      }}
    />
  );
  const nameInput = screen.getByPlaceholderText('e.g., Jane Doe') as HTMLInputElement;
  const emailInput = screen.getByPlaceholderText('e.g., jane.doe@example.com') as HTMLInputElement;
  const messageTextarea = screen.getByPlaceholderText('Your message here...') as HTMLTextAreaElement;
  const submitButton = screen.getByRole('button', { name: /Send Message/i });
  return { ...utils, user, nameInput, emailInput, messageTextarea, submitButton };
};

interface TestFormState {
  success: boolean;
  message: string;
  errors?: { [key: string]: string[] | undefined };
  submissionId?: string;
}

const initialStateForTests: TestFormState = {
  success: false,
  message: '',
  errors: undefined,
  submissionId: undefined,
};

describe('ContactForm', () => {
  beforeEach(() => {
    mockedSubmitContactForm.mockReset();
    mockedSubmitContactForm.mockImplementation(
      async (
        prevState: TestFormState | undefined      ): Promise<TestFormState> => {
        return prevState || initialStateForTests;
      }
    );
  });

  it('should render all form fields and submit button', () => {
    const { nameInput, emailInput, messageTextarea, submitButton } = setup();
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(messageTextarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByTestId('form-message')).not.toBeInTheDocument();
  });

  describe('Client-Side Validation', () => {
    it('should show client-side error for empty required fields on blur or change', async () => {
      const { user, nameInput, emailInput, messageTextarea } = setup();

      const nameRequiredMessage = 'Name is required';
      const emailRequiredMessage = 'Email is required';
      const invalidEmailMessage = 'Invalid email';
      const messageRequiredMessage = 'Message is required';
      const messageMinLengthMessage = /message must be at least \d+ characters/i;

      await user.click(nameInput);
      await user.click(document.body);
      expect(await screen.findByTestId('error-name')).toHaveTextContent(nameRequiredMessage);

      await user.click(emailInput);
      await user.click(document.body);
      expect(await screen.findByTestId('error-email')).toHaveTextContent(emailRequiredMessage);

      await user.type(emailInput, 'invalidemail');
      await user.click(document.body);
      expect(await screen.findByTestId('error-email')).toHaveTextContent(invalidEmailMessage);

      await user.click(messageTextarea);
      await user.click(document.body);
      expect(await screen.findByTestId('error-message')).toHaveTextContent(messageRequiredMessage);

      await user.type(messageTextarea, 'short');
      await user.click(document.body);
      expect(await screen.findByTestId('error-message')).toHaveTextContent(messageMinLengthMessage);
    });

    it('should clear client-side errors when valid input is provided', async () => {
      const { user, nameInput, emailInput, messageTextarea } = setup();
      const nameRequiredMessage = 'Name is required';
      const invalidEmailMessage = 'Invalid email';
      const messageMinLengthMessage = /message must be at least \d+ characters/i;

      await user.click(nameInput);
      await user.click(document.body);
      expect(await screen.findByTestId('error-name')).toHaveTextContent(nameRequiredMessage);
      await user.type(nameInput, 'John Doe');
      expect(screen.queryByTestId('error-name')).not.toBeInTheDocument();

      await user.type(emailInput, 'invalid');
      await user.click(document.body);
      expect(await screen.findByTestId('error-email')).toHaveTextContent(invalidEmailMessage);
      await user.clear(emailInput);
      await user.type(emailInput, 'john.doe@example.com');
      expect(screen.queryByTestId('error-email')).not.toBeInTheDocument();

      await user.type(messageTextarea, 'short');
      await user.click(document.body);
      expect(await screen.findByTestId('error-message')).toHaveTextContent(messageMinLengthMessage);
      await user.clear(messageTextarea);
      await user.type(messageTextarea, 'This is a perfectly valid message.');
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should submit data and display success message, then reset form', async () => {
      const { user, nameInput, emailInput, messageTextarea, submitButton } = setup();
      const successMessage = 'Your message has been sent successfully!';

      mockedSubmitContactForm.mockImplementation(
        async (prevState: TestFormState | undefined, formData: FormData): Promise<TestFormState> => {
          expect(formData.get('name')).toBe('John Doe');
          expect(formData.get('email')).toBe('john.doe@example.com');
          expect(formData.get('message')).toBe('Hello World');
          return {
            success: true,
            message: successMessage,
            errors: undefined,
            submissionId: '123-abc',
          };
        }
      );

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(messageTextarea, 'Hello World');

      await act(async () => {
        await user.click(submitButton);
      });

      const formMessageContainer = await screen.findByTestId('form-message');
      expect(formMessageContainer).toHaveTextContent('Success!');
      expect(formMessageContainer).toHaveTextContent(successMessage);

      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(messageTextarea.value).toBe('');
    });

    it('should display general server error message if submission fails without field errors', async () => {
      const { user, nameInput, emailInput, messageTextarea, submitButton } = setup();
      const errorMessage = 'Submission failed, please try again.';

      mockedSubmitContactForm.mockImplementation(async (): Promise<TestFormState> => ({
        success: false,
        message: errorMessage,
        errors: undefined,
      }));

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(messageTextarea, 'Hello Server Error');

      await act(async () => {
        await user.click(submitButton);
      });

      const formMessageContainer = await screen.findByTestId('form-message');
      expect(formMessageContainer).toHaveTextContent('Submission Error');
      expect(formMessageContainer).toHaveTextContent(errorMessage);
      expect(nameInput.value).toBe('John Doe');
    });

    it('should display server-side field-specific errors and general message', async () => {
      const { user, nameInput, emailInput, messageTextarea, submitButton } = setup();
      const generalErrorMessage = 'Please correct the errors below.';
      const fieldErrors = {
        name: ['Invalid name from server.'],
        email: ['This email is already taken.'],
      };

      mockedSubmitContactForm.mockImplementation(async (): Promise<TestFormState> => ({
        success: false,
        message: generalErrorMessage,
        errors: fieldErrors,
      }));

      await user.type(nameInput, 'Test Name');
      await user.type(emailInput, 'test@example.com');
      await user.type(messageTextarea, 'Checking server field errors.');

      await act(async () => {
        await user.click(submitButton);
      });

      expect(await screen.findByTestId('error-name')).toHaveTextContent(fieldErrors.name[0]);
      expect(await screen.findByTestId('error-email')).toHaveTextContent(fieldErrors.email[0]);

      const formMessageContainer = await screen.findByTestId('form-message');
      expect(formMessageContainer).toHaveTextContent('Validation Error');
      expect(formMessageContainer).toHaveTextContent(generalErrorMessage);
      expect(nameInput.value).toBe('Test Name');
    });

    it('client errors should take precedence over server errors for display initially, then server errors show', async () => {
      const { user, nameInput, emailInput, messageTextarea, submitButton } = setup();
      const clientNameErrorMessage = 'Name is required';
      const serverNameErrorMessage = 'Server says name is too short.';

      await user.click(nameInput);
      await user.click(document.body);
      expect(await screen.findByTestId('error-name')).toHaveTextContent(clientNameErrorMessage);

      mockedSubmitContactForm.mockImplementation(async (): Promise<TestFormState> => ({
        success: false,
        message: 'Submission failed.',
        errors: { name: [serverNameErrorMessage] },
      }));

      await user.type(emailInput, 'valid@email.com');
      await user.type(messageTextarea, 'Valid message content here.');

      // Name input is still empty, so client error persists
      await act(async () => {
        await user.click(submitButton);
      });

      // Fill name to clear client-side error
      await user.clear(nameInput);
      await user.type(nameInput, 'J');
      expect(screen.queryByText(clientNameErrorMessage)).not.toBeInTheDocument();

      await act(async () => {
        await user.click(submitButton);
      });

      expect(await screen.findByTestId('error-name')).toHaveTextContent(serverNameErrorMessage);
    });
  });

  describe('Accessibility', () => {
    it('should have no a11y violations on initial render', async () => {
      const { container } = setup();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations when showing client-side errors', async () => {
      const { container, user, nameInput } = setup();
      await user.click(nameInput);
      await user.click(document.body);
      await screen.findByTestId('error-name');
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations when showing server success message', async () => {
      const { container, user, nameInput, emailInput, messageTextarea, submitButton } = setup();
      mockedSubmitContactForm.mockResolvedValueOnce({
        success: true,
        message: 'Success!',
        errors: undefined,
        submissionId: 'final-id',
      } as TestFormState);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(messageTextarea, 'Hello World');
      await act(async () => {
        await user.click(submitButton);
      });
      await screen.findByTestId('form-message');
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
