import { useLayoutEffect, useState } from 'react'

export function useWindowSize() {
  const [width, widthAssign] = useState(0)
  const [height, heightAssign] = useState(0)

  useLayoutEffect(() => {
    const handleResize = () => {
      widthAssign(window.innerWidth)
      heightAssign(window.innerHeight)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { width, height }
}
