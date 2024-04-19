import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import AppFunctional from './AppFunctional'; // Assuming this is the component to be tested
import '@testing-library/jest-dom/extend-expect';

describe('AppFunctional Component', () => {
  test('renders headings, buttons, and links', () => {
    render(<AppFunctional />); // Render the component

    // Test that headings are rendered
    expect(screen.getByText('Coordinates (2, 2)')).toBeInTheDocument();
    expect(screen.getByText('You moved 0 times')).toBeInTheDocument();

    // Test that buttons are rendered
    expect(screen.getByText('LEFT')).toBeInTheDocument();
    expect(screen.getByText('UP')).toBeInTheDocument();
    expect(screen.getByText('RIGHT')).toBeInTheDocument();
    expect(screen.getByText('DOWN')).toBeInTheDocument();
    expect(screen.getByText('reset')).toBeInTheDocument();

    // Test that the input field is rendered
    expect(screen.getByPlaceholderText('type email')).toBeInTheDocument();

    // Test that the submit button is rendered
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('typing on the input changes its value', () => {
    render(<AppFunctional />); // Render the component

    // Get the input element
    const inputElement = screen.getByPlaceholderText('type email');

    // Simulate typing in the input field
    fireEvent.change(inputElement, { target: { value: 'test@example.com' } });

    // Check if the input value changes as expected
    expect(inputElement.value).toBe('test@example.com');
  });
});
