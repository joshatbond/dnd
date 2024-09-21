import { init } from '@paralleldrive/cuid2'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

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
    set => ({
      nodes: [],
      links: [],
      activeNode: null,
      isSidebarOpen: false,
      createNode: () =>
        set(
          state => ({
            links: state.links,
            nodes: [...state.nodes, { id: createId() }],
          }),
          false,
          'store/createNode'
        ),
      getRandomTree: (n = 300, reverse = false) =>
        set(
          _ => ({
            nodes: [...Array(n).keys()].map(() => ({ id: createId() })),
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
          'store/getRandomTree'
        ),
      selectNode: id =>
        set(
          state => ({
            links: state.links,
            nodes: state.nodes.map(node =>
              node.id === id ? { ...node, nodeRelSize: 8 } : node
            ),
          }),
          false,
          'store/selectNode'
        ),
    }),
    { name: 'nodes', store: `store:nodes`, serialize: { options: true } }
  )
)
export default useNodeStore
