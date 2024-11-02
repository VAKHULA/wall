'use client'
import { useEffect, useState } from 'react';
import { Canvas, useCanvas } from '@/app/canvas'

interface Notice {
  notice: string
  x: number
  y: number
}
export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([])
  const canvasRef = useCanvas()

  useEffect(() => {
    fetch('/api').then((resp) => {
      resp.json().then((data: Notice[]) => {
        setNotices(data)
      })
    })
  }, [])

  return (
    <div>
      <Canvas {...canvasRef}>
        {notices.map((item, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: item.y,
              left: item.x,
              backgroundColor: '#333',
              padding: '1rem',
              borderRadius: '1rem',
              boxShadow: '6px 9px 24px -8px rgba(66, 68, 90, 1)',
            }}
          >
            {item.notice}
          </div>
        ))}
      </Canvas>
    </div>
  );
}
