import React from 'react';
import { render, screen } from '@testing-library/react';
import DropOffSchedule from './../src/components/customer/dropoff/dropoffSchedule';

test('render drop off schedule', () => {
    render(<DropOffSchedule />);

    // Assert that components are rendered.
    expect(screen.getByTestId("schedule-table")).toBeInTheDocument();
    expect(screen.getByTestId("schedule-form")).toBeInTheDocument();
    expect(screen.getByTestId("schedule-map")).toBeInTheDocument();

});
