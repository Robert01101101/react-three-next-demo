'use client'

import dynamic from 'next/dynamic'
import '../styles/tooltip.css';

const MapWithControls = dynamic(() => import('@/components/MapWithControls'), { ssr: false });

export default function Page() {
  return (
    <>
      <MapWithControls />
    </>
  )
}
