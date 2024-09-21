import { Plus, X } from 'lucide-react'

import store from '@/graph/store'
import useNodeStore from '@/graph/store'

import { Button } from './components/ui/button'
import Graph from './graph'
import { PanelContainer } from './layout'
import useLayoutStore from './layout/store'

export default function App() {
  return (
    <main className="grid min-h-screen bg-neutral-950 text-neutral-50">
      <PanelContainer primaryContent={<Graph />} sidebarContent={<Sidebar />} />
    </main>
  )
}

function Sidebar() {
  const nodes = store(state => state.nodes)
  const toggleSidebarVisibility = useLayoutStore(
    state => state.toggleSidebarVisibility
  )

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          className="h-auto px-0 py-0"
          onClick={() => toggleSidebarVisibility(false)}
        >
          <X />
        </Button>
      </div>
      {nodes.length === 0 ? <EmptyNodes /> : 'Nodes'}
    </div>
  )
}
function EmptyNodes() {
  const createNode = useNodeStore(state => state.createNode)
  return (
    <div>
      <p> No nodes exist! Create one to get started...</p>
      <Button onClick={createNode} variant="ghost" className="h-auto px-0 py-0">
        <Plus />
      </Button>
    </div>
  )
}
