import React from 'react';
import AnimatedSignUp from '@/components/ui/animated-sign-up';

export const SignUpPage: React.FC = () => {
  const handleSignUpSuccess = () => {
    // Redirect to login page
    window.location.hash = '#/login';
  };

  return <AnimatedSignUp onSignUpSuccess={handleSignUpSuccess} />;
};
