import React from 'react';
import { render, screen } from '@testing-library/react';
import DropoffIP from './../src/components/customer/dropoff/dropoffIP';

test('render drop off in progress', () => {
    render(<DropoffIP />);

    // Assert that components are rendered.
    expect(screen.getByTestId("ip-map")).toBeInTheDocument();
    expect(screen.getByTestId("ip-form")).toBeInTheDocument();
});
