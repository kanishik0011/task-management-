import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TaskForm } from './task-form';

describe('TaskForm', () => {
  it('validates the title before submission', async () => {
    const onSubmit = vi.fn();
    render(<TaskForm isSubmitting={false} onCancel={vi.fn()} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /create task/i }));

    expect(await screen.findByText(/title must be at least 2 characters/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a normalized task payload', async () => {
    const onSubmit = vi.fn();
    render(<TaskForm isSubmitting={false} onCancel={vi.fn()} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/task title/i), 'Plan QA pass');
    await userEvent.type(screen.getByLabelText(/description/i), 'Check desktop and mobile states');
    await userEvent.selectOptions(screen.getByLabelText(/priority/i), 'HIGH');
    await userEvent.click(screen.getByRole('button', { name: /create task/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Plan QA pass',
        description: 'Check desktop and mobile states',
        priority: 'HIGH',
        status: 'TODO'
      })
    );
  });
});
