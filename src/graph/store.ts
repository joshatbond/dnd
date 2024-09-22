import { init } from '@paralleldrive/cuid2'
import { Object3D } from 'node_modules/@types/three'
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
    nodeLabel: '',
  }
}
export type TNode = {
  id: string
  __threeObj?: Object3D | null
  index: number | null
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  nodeVal: number
  nodeLabel: string
}
