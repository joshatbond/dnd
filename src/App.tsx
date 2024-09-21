import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ForceGraph3D } from 'react-force-graph'

import store from '@/store'

import { Button } from './components/ui/button'
import { PanelContainer } from './layout'
import useLayoutStore from './layout/store'

export default function App() {
  return (
    <main className="grid min-h-screen bg-neutral-950 text-neutral-50">
      <PanelContainer primaryContent={<Graph />} sidebarContent={<Sidebar />} />
    </main>
  )
}

function Graph() {
  const [widthState, widthStateAssign] = useState(0)
  const nodes = store(state => state.nodes)
  const links = store(state => state.links)
  const toggleSidebarVisibility = useLayoutStore(
    state => state.toggleSidebarVisibility
  )
  const width = useLayoutStore(state => state.content.width)

  useEffect(() => {
    widthStateAssign(width)
  }, [width])

  useEffect(() => {
    if (nodes.length === 0) {
      toggleSidebarVisibility(true)
    }
  }, [nodes])

  return <ForceGraph3D graphData={{ nodes, links }} width={widthState} />
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
      {nodes.length === 0 ? 'No nodes' : 'Nodes'}
    </div>
  )
}
