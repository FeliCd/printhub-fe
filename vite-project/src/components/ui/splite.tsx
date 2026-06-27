'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

export function SplineScene({ scene, className }: { scene: string; className?: string }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader">Loading 3D...</span>
        </div>
      }
    >
      <div className={className}>
        <Spline scene={scene} style={{ width: '100%', height: '100%' }} />
      </div>
    </Suspense>
  )
}
