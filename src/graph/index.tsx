import { useEffect } from 'react'
import { ForceGraph3D } from 'react-force-graph'

import useLayoutStore from '@/layout/store'
import { useWindowSize } from '@/lib/useWindowSize'

import useNodeStore from './store'

export default function Graph() {
  const { height: windowHeight } = useWindowSize()
  const nodes = useNodeStore(state => state.nodes)
  const links = useNodeStore(state => state.links)
  const toggleSidebarVisibility = useLayoutStore(
    state => state.toggleSidebarVisibility
  )
  const selectNode = useNodeStore(state => state.selectNode)
  const width = useLayoutStore(state => state.content.width)

  useEffect(() => {
    if (nodes.length === 0) {
      toggleSidebarVisibility(true)
    }
  }, [nodes])

  return (
    <ForceGraph3D
      graphData={{ nodes: nodes as any, links }}
      width={width}
      height={windowHeight}
      onNodeClick={n => {
        selectNode(n.id as string)
      }}
    />
  )
}
