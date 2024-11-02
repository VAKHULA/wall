'use client'
import React, { RefObject, useEffect, useRef, useState } from 'react'

import { Tent } from './tent'

const SETTINGS = {
  width: 10000,
  height: 10000,
}

export const useCanvas = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line
  const tent = useRef<any>()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    tent.current = new Tent(SETTINGS, wrapperRef.current, canvasRef.current)
    tent.current.init()
    setMounted(true)
  }, [])

  return {
    mounted,
    wrapperRef,
    canvasRef,
  }
}

interface Props {
  children: React.ReactNode
  mounted: boolean
  wrapperRef: RefObject<HTMLDivElement>
  canvasRef: RefObject<HTMLDivElement>
}

export function Canvas ({
  children,
  mounted,
  wrapperRef,
  canvasRef,
}: Props) {
  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        overflow: 'hidden',
      }}
    >
      <div
        ref={canvasRef}
        style={{
          width: SETTINGS.width,
          height: SETTINGS.height,
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: 'top left',
          display: 'flex',
          flexWrap: 'wrap',
          backgroundSize: 100,
          backgroundImage: 'url(/grid.jpg)',
        }}
      >
        {mounted &&
          children
        }
      </div>
    </div>
  )
}
