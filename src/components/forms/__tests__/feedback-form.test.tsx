// ATTEMPT #2: Improving test mocks to resolve React warnings.
// Change 1: Updated the mock 'Form' component to use `React.forwardRef`. This resolves the "Function components cannot be given refs" warning by correctly passing the `formRef` from the `FeedbackForm` component to the DOM element.
// Change 2: Updated the mock 'SubmitButton' component to explicitly accept and destructure the `colorScheme` and `pendingText` props, preventing them from being passed down to the underlying DOM button. This resolves the "React does not recognize the prop" warnings.

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'vitest-axe';

import FeedbackForm from '../feedback-form';
import { type FeedbackFormData } from '@/src/lib/schemas/feedback-form-schema';

import { submitFeedbackForm as actualSubmitFeedbackForm } from '@/src/lib/actions/feedback-actions';

// Define a clear type for the server action's state
interface TestFormState {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof FeedbackFormData, string[]>>;
  submissionId?: string;
}

vi.mock('@/src/lib/actions/feedback-actions', () => ({
  submitFeedbackForm: vi.fn(),
}));
const mockedSubmitFeedbackForm = actualSubmitFeedbackForm as Mock<[TestFormState | null, FormData], Promise<TestFormState>>;

// Define clear types for the mock components' props
type MockFormProps = { 
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  children: React.ReactNode; 
  [key: string]: unknown;
};

type MockSubmitButtonProps = { 
  children: React.ReactNode; 
  isLoading?: boolean; 
  colorScheme?: string; 
  pendingText?: string;
  [key: string]: unknown;
};

vi.mock('@/src/components/forms', () => {
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
    
    // FIX: Update the mock for the 'Form' component to use React.forwardRef
    const MockForm = React.forwardRef<HTMLFormElement, MockFormProps>(({ onSubmit, children, ...props }, ref) => (
      <form
        ref={ref}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        {...props}
      >
        {children}
      </form>
    ));
    MockForm.displayName = 'Form';

    // FIX: Update the mock for SubmitButton to accept and ignore custom props.
    const MockSubmitButton = ({ children, isLoading, colorScheme, pendingText, ...props }: MockSubmitButtonProps) => (
      <button type="submit" disabled={isLoading} {...props}>
        {isLoading ? (pendingText || 'Submitting...') : children}
      </button>
    );

    return {
        Form: MockForm,
        FormField: MockFormField,
        FormMessage: MockFormMessage,
        SubmitButton: MockSubmitButton,
    };
});

const baseThemeForTests = {};
const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(baseThemeForTests);
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

interface SetupElements {
  user: UserEvent;
  commentsTextarea: HTMLElement;
  emailInput: HTMLElement;
  clarityInput: HTMLElement;
  usefulnessInput: HTMLElement;
  satisfactionInput: HTMLElement;
  feedbackTypeSelect: HTMLElement;
  submitButton: HTMLElement;
  container: HTMLElement;
}

const setup = (): SetupElements => {
  const user = userEvent.setup();
  const { container } = renderWithChakra(<FeedbackForm />);
  return { 
    user, 
    commentsTextarea: screen.getByLabelText(/Comments/i), 
    emailInput: screen.getByLabelText(/Your Email/i), 
    clarityInput: screen.getByLabelText(/Clarity/i), 
    usefulnessInput: screen.getByLabelText(/Usefulness/i), 
    satisfactionInput: screen.getByLabelText(/Satisfaction/i), 
    feedbackTypeSelect: screen.getByLabelText(/Feedback Type/i), 
    submitButton: screen.getByRole('button', { name: /Submit Feedback/i }), 
    container,
  };
};

const baseValidTestData: FeedbackFormData = {
  comments: 'This is a valid comment that is definitely longer than ten characters for testing.',
  email: 'tester@example.com',
  clarity_rating: 4,
  usefulness_rating: 5,
  satisfaction_rating: 3,
  feedback_type: 'bug_report',
};

const fillFormWithValidData = async (
  user: UserEvent,
  elements: Omit<SetupElements, 'user' | 'submitButton' | 'container'>
) => {
    await user.clear(elements.commentsTextarea);
    await user.type(elements.commentsTextarea, baseValidTestData.comments);
    if (baseValidTestData.email) {
      await user.clear(elements.emailInput);
      await user.type(elements.emailInput, baseValidTestData.email);
    }
    await user.clear(elements.clarityInput);
    await user.type(elements.clarityInput, String(baseValidTestData.clarity_rating));
    await user.clear(elements.usefulnessInput);
    await user.type(elements.usefulnessInput, String(baseValidTestData.usefulness_rating));
    await user.clear(elements.satisfactionInput);
    await user.type(elements.satisfactionInput, String(baseValidTestData.satisfaction_rating));
    if (baseValidTestData.feedback_type) {
      await user.selectOptions(elements.feedbackTypeSelect, baseValidTestData.feedback_type);
    }
};

describe('Simplified FeedbackForm', () => {
  beforeEach(() => {
    mockedSubmitFeedbackForm.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render initial form correctly', () => {
    const { commentsTextarea, submitButton } = setup();
    expect(commentsTextarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(screen.queryByTestId('form-message')).not.toBeInTheDocument();
  });

  describe('Form Submission (Simplified)', () => {
    it('should submit valid data and display success message, then reset form', async () => {
      const { user, submitButton, ...elements } = setup();
      const successMessageText = 'Feedback received, thank you!';

      mockedSubmitFeedbackForm.mockResolvedValueOnce({
        success: true,
        message: successMessageText,
      });
      
      await fillFormWithValidData(user, elements);
      
      await user.click(submitButton);

      expect(mockedSubmitFeedbackForm).toHaveBeenCalledTimes(1);
      
      const submittedFormData = mockedSubmitFeedbackForm.mock.calls[0][1];
      expect(submittedFormData.get('comments')).toBe(baseValidTestData.comments);
      
      const formMessageContainer = await screen.findByTestId('form-message');
      expect(formMessageContainer).toHaveTextContent('Success!');
      expect(formMessageContainer).toHaveTextContent(successMessageText);
      
      expect(elements.commentsTextarea).toHaveValue('');
      expect(elements.emailInput).toHaveValue('');
    });

    it('should display field-specific server errors', async () => {
      const { user, submitButton, ...elements } = setup();
      const fieldErrors = {
        email: ['This email is not allowed by server.'],
      };
      
      mockedSubmitFeedbackForm.mockResolvedValueOnce({
        success: false,
        message: "Please correct the errors below.",
        errors: fieldErrors,
      });

      await fillFormWithValidData(user, elements);

      await user.click(submitButton);

      expect(await screen.findByTestId('error-email')).toHaveTextContent(fieldErrors.email[0]);
    });
  });

  describe('Accessibility (Simplified)', () => {
    it('should have no a11y violations on initial render', async () => {
      const { container } = setup();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});