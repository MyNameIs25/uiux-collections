import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Renders `children` at a fixed "desktop" design width, then scales the whole
 * thing down with a CSS transform to fit the available width — like a live
 * website thumbnail. The frame's height tracks the scaled content height, so
 * there's no dead space.
 *
 * Pass `maxHeight` (px) to cap how tall the frame can get: if the width-scaled
 * content would exceed it, the scale is reduced to fit the height instead and
 * the (now narrower) content is centered horizontally.
 *
 * CSS `transform: scale()` keeps pointer events mapped correctly, so hover /
 * animations still work — the only caveat is components that do raw cursor math
 * via `getBoundingClientRect`, which would be off by the scale factor.
 */
export function ScaledPreview({
  children,
  designWidth = 1280,
  maxHeight,
  className,
}: {
  children: ReactNode
  designWidth?: number
  maxHeight?: number
  className?: string
}) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [height, setHeight] = useState<number>()

  useLayoutEffect(() => {
    const measure = () => {
      const w = outer.current?.clientWidth ?? 0
      // offsetHeight ignores the transform, so this is the natural height at
      // the full design width.
      const contentHeight = inner.current?.offsetHeight ?? 0
      let s = designWidth ? w / designWidth : 1
      if (maxHeight && contentHeight * s > maxHeight) {
        s = contentHeight ? maxHeight / contentHeight : s
      }
      setScale(s)
      setOffsetX(Math.max(0, (w - designWidth * s) / 2))
      setHeight(contentHeight * s)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (outer.current) ro.observe(outer.current)
    if (inner.current) ro.observe(inner.current)
    return () => ro.disconnect()
  }, [designWidth, maxHeight])

  return (
    <div ref={outer} className={className} style={{ height, overflow: 'hidden' }}>
      <div
        ref={inner}
        style={{
          width: designWidth,
          transform: `translateX(${offsetX}px) scale(${scale})`,
          transformOrigin: 'top left',
          // Hide until the first measure lands so we never flash full size.
          visibility: scale ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
