import { init } from '@paralleldrive/cuid2'
import { Object3D } from 'node_modules/@types/three'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const createId = init({ length: 10 })

const useNodeStore = create<{
  nodes: { id: string }[]
  links: Record<string, number>[]
  isSidebarOpen: boolean
  /** The currently selected node */
  activeNode?: string | null
  getRandomTree: (n?: number, reverse?: boolean) => void
  selectNode: (id: string) => void
  createNode: () => void
}>()(
  devtools(
    persist(
      set => ({
        nodes: [],
        links: [],
        activeNode: null,
        isSidebarOpen: false,
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
