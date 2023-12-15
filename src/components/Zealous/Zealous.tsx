import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

import { vars } from '../../theme/theme.css'

type Position = { x: number; y: number }

type Comment = {
  id: string | undefined
  position: Position | undefined
  reaction: string
  text: string
}

type Comments = {
  [n: string]: Comment
}

const initialComment = {
  id: undefined,
  position: undefined,
  reaction: '',
  text: '',
} satisfies Comment

const uid = () => Math.random().toString(36).substring(2, 9)

export const Zealous = () => {
  const menuRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef<Position>()

  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState<Comment>(initialComment)
  const [comments, setComments] = useState<Comments | undefined>(undefined)

  const handleMouseMove = useCallback((ev: MouseEvent) => {
    positionRef.current = {
      x: ev.clientX,
      y: ev.clientY,
    }
  }, [])

  const handleMouseDown = useCallback((ev: MouseEvent) => {
    if (ev.button === 0 && !menuRef.current?.contains(ev.target as Node)) {
      setOpen(false)
      setComment(initialComment)
    }

    if (ev.button === 2) {
      setOpen(true)
      setComment(c => ({
        ...c,
        position: positionRef.current,
      }))
    }
  }, [])

  const preventContext = useCallback((ev: MouseEvent) => {
    ev.preventDefault()
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('contextmenu', preventContext)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('contextmenu', preventContext)
    }
  }, [handleMouseMove, handleMouseDown, preventContext])

  return (
    <div
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        fontFamily: 'Geist',
        cursor: `url('/svgs/comment.svg') 0 23, pointer;)`,
      }}
    >
      {comments &&
        Object.values(comments).map(com => (
          <motion.div
            style={{
              top: com?.position?.y,
              left: com?.position?.x,
              position: 'absolute',
              background: vars.color.shadeLight,
              padding: '8px',
              borderRadius: '3px',
              color: vars.color.light,
              maxWidth: '200px',
              boxShadow:
                '0 3px 10px 0 rgba(0,0,0,0.2), 0 0px 0px 0 rgba(0,0,0,0.19)',
            }}
            initial={{ opacity: 0, x: 10, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0, x: 10, y: 10 }}
            key={com.id}
            onClick={() => {
              if (com.id) {
                setOpen(true)
                setComment(comments[com.id])
              }
            }}
          >
            {com.reaction} {com.text}
          </motion.div>
        ))}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            style={{
              top: comment?.position?.y,
              left: comment?.position?.x,
              cursor: `pointer`,
              position: 'absolute',
              padding: '8px',
              border: '1px solid white-smoke',
              background: vars.color.shadeLight,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '10px',
              boxShadow: vars.boxShadow.primary,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <textarea
              value={comment.text}
              style={{
                fontFamily: 'Geist',
                all: 'unset',
                background: vars.color.light,
                padding: '3px',
                borderRadius: '3px',
                boxShadow:
                  '10px 10px 5px rgba(0,0,0,0.4) rgba(0,0,0,0.5) inset',
              }}
              onChange={ev =>
                setComment(s => ({
                  ...s,
                  text: ev.target.value,
                }))
              }
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: '6px',
                background: vars.color.shadeLight,
              }}
            >
              {['🐲', '😅', '🧨', '😱', '🦉', '😍'].map(t => (
                <button
                  key={t}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '3px',
                    transition: 'all 0.5s',
                  }}
                  onClick={() => {
                    let id = uid()

                    if (comment.id) {
                      id = comment.id
                    }

                    setComments(s => ({
                      ...s,
                      [id]: {
                        ...comment,
                        reaction: t.toString(),
                        id,
                      },
                    }))
                    setOpen(false)
                    setComment(initialComment)
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
