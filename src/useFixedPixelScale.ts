import { useEffect, useState } from 'react'

// Two physical screen pixels per original Windows pixel, including Retina displays.
export function useFixedPixelScale() {
  const [density, setDensity] = useState(window.devicePixelRatio)
  useEffect(() => {
    const resize = () => setDensity(window.devicePixelRatio)
    let media: MediaQueryList
    const watch = () => { media?.removeEventListener('change', watch); resize(); media = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`); media.addEventListener('change', watch) }
    watch(); window.addEventListener('resize', resize)
    return () => { media.removeEventListener('change', watch); window.removeEventListener('resize', resize) }
  }, [])
  return 2 / density
}
