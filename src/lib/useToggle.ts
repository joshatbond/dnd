import { useState } from 'react'

export function useToggle(initialState = false) {
  const [state, stateAssign] = useState(initialState)

  const toggle = (b?: boolean) => stateAssign((p) => (b ? b : !p))

  return [state, toggle] as const
}
