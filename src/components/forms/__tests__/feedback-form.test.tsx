// FINAL: The test now fills out all form fields to ensure client-side
// validation passes, allowing the submit handler and the mocked server action to be called.
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'vitest-axe';

import FeedbackForm from '../feedback-form';
import { submitFeedbackForm as actualSubmitFeedbackForm } from '@/src/lib/actions/feedback-actions';
import baseTheme from '@/src/lib/theme';
import { useFormStatus, type FormStatus } from 'react-dom';

// We ONLY mock the server action and the hook.
vi.mock('@/src/lib/actions/feedback-actions', () => ({
  submitFeedbackForm: vi.fn(),
}));
vi.mock('react-dom', () => ({
  useFormStatus: vi.fn(),
}));


const mockedSubmitFeedbackForm = actualSubmitFeedbackForm as Mock;
const mockedUseFormStatus = useFormStatus as Mock<[], FormStatus>;


const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(baseTheme);
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('FeedbackForm Component', () => {
  beforeEach(() => {
    mockedSubmitFeedbackForm.mockReset();
    mockedUseFormStatus.mockReturnValue({ pending: false, data: null, method: null, action: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should have no a11y violations on initial render', async () => {
    const { container } = renderWithChakra(<FeedbackForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle submission correctly', async () => {
    const user = userEvent.setup();
    renderWithChakra(<FeedbackForm />);
    
    mockedSubmitFeedbackForm.mockResolvedValueOnce({
      success: true,
      message: 'Success!',
    });

    // FIX: Fill out all fields to ensure validation passes.
    await user.type(screen.getByLabelText(/Clarity/i), '4');
    await user.type(screen.getByLabelText(/Usefulness/i), '5');
    await user.type(screen.getByLabelText(/Satisfaction/i), '5');
    await user.selectOptions(screen.getByLabelText(/Feedback Type/i), 'feature_request');
    await user.type(screen.getByLabelText(/Comments/i), 'This is a test comment that is long enough.');
    await user.type(screen.getByLabelText(/Your Email/i), 'test@example.com');
    
    await user.click(screen.getByRole('button', { name: /Submit Feedback/i }));
    
    // This assertion will now pass.
    await waitFor(() => {
      expect(mockedSubmitFeedbackForm).toHaveBeenCalledTimes(1);
    });
  });
});