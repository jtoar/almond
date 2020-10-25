import { useEffect, useRef } from 'react'

/**
 * https://www.youtube.com/watch?v=eWO1b6EoCnQ
 */
export const useClickOutside = (fn) => {
  const ref = useRef()

  /**
   * @todo Dependency list?
   */
  useEffect(() => {
    const clickOutside = (e) => {
      /**
       * If the ref doesn't contain the event target (where we clicked),
       * then we clicked outside it.
       *
       * The ?. operator's to check that the ref's been assigned.
       */
      if (!ref.current?.contains(e.target)) {
        fn()
      }
    }

    /**
     * @todo Why mousedown? (Instead of click)
     */
    document.addEventListener('mousedown', clickOutside)

    return () => {
      document.removeEventListener('mousedown', clickOutside)
    }
  })

  return ref
}

export const useKeyDown = (key, fn, { control } = { control: false }) => {
  useEffect(() => {
    const handleKeydown = (e) => {
      switch (e.key) {
        case key:
          if (control) {
            if (e.ctrlKey) {
              e.preventDefault()
              fn()
            }
          } else {
            e.preventDefault()
            fn()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  })
}
