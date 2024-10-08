import { init } from '@paralleldrive/cuid2'
import { type Mesh } from 'three'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const createId = init({ length: 10 })

const useNodeStore = create<{
  /** The currently selected node */
  activeNode?: string | null
  isDebugMode: boolean
  links: Record<string, number>[]
  nodes: TNode[]

  createNode: () => void
  editNodeProperty: <K extends keyof TNode>(
    id: string,
    key: K,
    value: TNode[K]
  ) => void
  getRandomTree: (n?: number, reverse?: boolean) => void
  selectNode: (id: string) => void
  toggleDebugMode: (b?: boolean) => void
}>()(
  devtools(
    persist(
      set => ({
        activeNode: null,
        isDebugMode: false,
        nodes: [],
        links: [],
        createNode: () =>
          set(
            state => ({
              links: state.links,
              nodes: [...state.nodes, newNode()],
            }),
            false,
            'createNode'
          ),
        editNodeProperty: (id, key, value) =>
          set(
            state => ({
              ...state,
              nodes: state.nodes.map(n =>
                n.id !== id ? n : { ...n, [key]: value }
              ),
            }),
            false,
            'editNodeProperty'
          ),
        getRandomTree: (n = 300, reverse = false) =>
          set(
            _ => ({
              nodes: [...Array(n).keys()].map(() => newNode()),
              links: [...Array(n).keys()]
                .filter(id => id)
                .map(id => ({
                  [reverse ? 'target' : 'source']: id,
                  [reverse ? 'source' : 'target']: Math.round(
                    Math.random() * (id - 1)
                  ),
                })),
            }),
            false,
            'getRandomTree'
          ),
        selectNode: id =>
          set(
            state => ({
              ...state,
              activeNode: id,
            }),
            false,
            'selectNode'
          ),
        toggleDebugMode: b =>
          set(
            state => ({
              ...state,
              isDebugMode: b ?? !state.isDebugMode,
            }),
            false,
            'toggleDebugMode'
          ),
      }),
      { name: 'nodeStore' }
    ),
    { name: 'nodes', store: `nodeStore`, serialize: { options: true } }
  )
)
export default useNodeStore

function newNode(): TNode {
  return {
    id: createId(),
    __threeObj: null,
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    index: null,
    nodeVal: 1,
    label: '',
    color: 'red',
  }
}
export type TNode = {
  id: string
  __threeObj?: Mesh | null
  index: number | null
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  nodeVal: number
  label: string
  color: string
}
