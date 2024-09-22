import { useEffect, useState } from 'react'
import { ForceGraph3D } from 'react-force-graph'

import useLayoutStore from '@/layout/store'

import useNodeStore from './store'

export default function Graph() {
  const [widthState, widthStateAssign] = useState(0)
  const nodes = useNodeStore(state => state.nodes)
  const links = useNodeStore(state => state.links)
  const toggleSidebarVisibility = useLayoutStore(
    state => state.toggleSidebarVisibility
  )
  const selectNode = useNodeStore(state => state.selectNode)
  const width = useLayoutStore(state => state.content.width)

  useEffect(() => {
    widthStateAssign(width)
  }, [width])

  useEffect(() => {
    if (nodes.length === 0) {
      toggleSidebarVisibility(true)
    }
  }, [nodes])

  return (
    <ForceGraph3D
      graphData={{ nodes: nodes as any, links }}
      width={widthState}
      onNodeClick={n => {
        selectNode(n.id as string)
      }}
    />
  )
}
