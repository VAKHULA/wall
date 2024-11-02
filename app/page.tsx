'use client'
import { Canvas, useCanvas } from '@/app/canvas'

export default function Home() {
  const canvasRef = useCanvas()
  return (
    <div>
      <Canvas {...canvasRef}>hi</Canvas>
    </div>
  );
}
