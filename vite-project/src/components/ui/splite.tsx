'use client'

import React, { Suspense, lazy, Component } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SplineErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn('Spline 3D WebGL render error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function SplineScene({ scene, className }: { scene: string; className?: string }) {
  const fallbackUI = (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900/30 via-black to-slate-900 rounded-2xl border border-emerald-500/20 p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-[#39FF14]/10 flex items-center justify-center mb-4 border border-[#39FF14]/30 animate-pulse">
        <span className="text-3xl">🧊</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-1">PrintHub 3D Interactive</h3>
      <p className="text-xs text-gray-400 max-w-xs">Nền tảng dịch vụ in 3D & thiết kế sản phẩm theo yêu cầu hàng đầu</p>
    </div>
  );

  return (
    <SplineErrorBoundary fallback={fallbackUI}>
      <Suspense fallback={fallbackUI}>
        <div className={className}>
          <Spline scene={scene} style={{ width: '100%', height: '100%' }} />
        </div>
      </Suspense>
    </SplineErrorBoundary>
  )
}
