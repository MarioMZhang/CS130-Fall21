import React from 'react';
import { render, screen } from '@testing-library/react';
import joblist from './../src/components/driver/joblist';

test('render job list', () => {
    render(<joblist />);

    // Assert that components are rendered.
    expect(screen.getByTestId("test-table")).toBeInTheDocument();
    expect(screen.getByTestId("test-break-button")).toBeInTheDocument();
    expect(screen.getByTestId("schedule-map")).toBeInTheDocument();

});
