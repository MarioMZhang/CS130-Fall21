import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginImgae from './../src/components/login/loginImage';

test('render login page', () => {
    render(<LoginImgae />);

    // Assert that the login form is in expected format.
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('I am logging in as a ......')).toBeInTheDocument();

    // Assert that the links to other pages present.
    expect(screen.getByText('Forgot password?').toBeInTheDocument());
    expect(screen.getByText('Don\'t have an account? Sign Up').toBeInTheDocument());

});
