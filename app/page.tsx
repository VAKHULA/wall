'use client'
import { useEffect, useState } from 'react';
import { Canvas, useCanvas } from '@/app/canvas'

interface Notice {
  notice: string
  x?: number
  y?: number
}

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [editedNotice, setEditedNotice] = useState<Notice>()
  const canvasRefs = useCanvas()

  useEffect(() => {
    fetch('/api').then((resp) => {
      resp.json().then((data: Notice[]) => {
        setNotices(data)
      })
    })

    canvasRefs.canvasRef.current?.addEventListener('dragover', (e) => {
      e.preventDefault();
    })

    canvasRefs.canvasRef.current?.addEventListener('drop', (e) => {
      setEditedNotice({
        notice: '?',
        x: e.layerX,
        y: e.layerY,
      })
    })
  }, [])

  return (
    <div>
      <Canvas {...canvasRefs}>
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
        {editedNotice &&
          <textarea
            style={{
              position: 'absolute',
              top: editedNotice?.y,
              left: editedNotice?.x,
              backgroundColor: '#333',
              padding: '1rem',
              borderRadius: '1rem',
              boxShadow: '6px 9px 24px -8px rgba(66, 68, 90, 1)',
            }}
            value={editedNotice?.notice}
            onChange={(e) => {
              setEditedNotice((prev) => ({ ...prev, notice: e.target.value }))
            }}
            onBlur={()=>{
              setNotices((prev) => ([...prev, editedNotice]))
              fetch('/api', {
                method: 'POST',
                body: JSON.stringify(editedNotice)
              })
              setEditedNotice(undefined)
            }}
          />
        }
      </Canvas>
      <button
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          width: '3rem',
          height: '3rem',
          backgroundColor: '#333',
          padding: '1rem',
          borderRadius: '1rem',
          boxShadow: '6px 9px 24px -8px rgba(66, 68, 90, 1)',
        }}
        draggable="true"
      >
        📃
      </button>
    </div>
  );
}
