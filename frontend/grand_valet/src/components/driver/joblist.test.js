import React from 'react';
import { render, screen } from '@testing-library/react';
import Joblist from './joblist';

test('render job list', () => {
    render(<Joblist />);

    // Assert that components are rendered.
    expect(screen.getByTestId("test-table")).toBeInTheDocument();
    expect(screen.getByTestId("test-break-button")).toBeInTheDocument();
    expect(screen.getByTestId("test-button")).toBeInTheDocument();
});
