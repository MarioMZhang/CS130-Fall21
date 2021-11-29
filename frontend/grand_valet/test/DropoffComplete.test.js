import React from 'react';
import { render, screen } from '@testing-library/react';
import DropoffComplete from './../src/components/customer/dropoff/dropoffComplete';

test('render drop off in progress', () => {
    render(<DropoffComplete />);

    // Assert that components are rendered.
    expect(screen.getByTestId("complete-map")).toBeInTheDocument();
    expect(screen.getByTestId("complete-form")).toBeInTheDocument();
});
