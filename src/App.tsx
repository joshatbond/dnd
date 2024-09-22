import Graph from '@/graph'
import { Sidebar } from '@/graph/sidebar'

import { PanelContainer } from './layout'

export default function App() {
  return (
    <main className="grid min-h-screen bg-neutral-950 text-neutral-50">
      <PanelContainer primaryContent={<Graph />} sidebarContent={<Sidebar />} />
    </main>
  )
}
