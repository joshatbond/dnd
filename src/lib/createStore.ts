import { type StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export default function createStore<T extends object, U extends object>(
  name: string,
  state: T,
  actions: StateCreator<
    T,
    [['zustand/devtools', never], ['zustand/immer', never]],
    [['zustand/immer', never], ['zustand/devtools', never]],
    U
  >
) {
  return create<T & U>()(
    devtools(
      immer((...a) => Object.assign({}, state, (actions as any)(...a))),
      { name, store: `store:${name}`, serialize: { options: true } }
    )
  )
}
