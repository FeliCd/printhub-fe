import React from 'react';
import AnimatedSignIn from '@/components/ui/animated-sign-in';

interface LoginPageProps {
  onLogin: (username: string, role: 'BUYER' | 'MAKER' | 'ADMIN') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return <AnimatedSignIn onLogin={onLogin} />;
};
