import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import { ReactNode, forwardRef, useEffect, useRef, useState } from 'react'
import { ForceGraph3D } from 'react-force-graph'
import { ImperativePanelHandle, getPanelElement } from 'react-resizable-panels'

import { Button } from './components/ui/button'
import { cn } from './lib/cn'
import { useToggle } from './lib/useToggle'

export default function App() {
  const sidebarRef = useRef<ImperativePanelHandle | null>(null)
  const [showSidebar, showSidebarToggle] = useToggle(false)
  const [contentWidth, contentWidthAssign] = useState(0)
  const [isResizing, isResizingAssign] = useState(false)

  const onSidebarShow = () => {
    console.log('clicked')
    if (sidebarRef.current?.isCollapsed()) {
      console.log('expanding')
      sidebarRef.current?.expand()
    } else {
      console.log('collapsing')
      sidebarRef.current?.collapse()
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-[1fr,auto] bg-neutral-950 text-white">
      <ResizablePanelGroup direction="horizontal">
        <MainPanel
          showSidebar={showSidebar}
          isResizing={isResizing}
          setContentWidth={contentWidthAssign}
        >
          <ForceGraph3D graphData={getRandomTree()} width={contentWidth} />
        </MainPanel>

        {showSidebar ? (
          <ResizableHandle withHandle onDragging={e => isResizingAssign(e)} />
        ) : null}

        <Sidebar
          isResizing={isResizing}
          ref={sidebarRef}
          showSidebar={showSidebar}
          toggleSidebar={showSidebarToggle}
        />
      </ResizablePanelGroup>

      <Button
        variant="ghost"
        className="fixed right-4 top-4 z-20 px-3 py-1"
        onClick={onSidebarShow}
      >
        {showSidebar ? <PanelRightClose /> : <PanelRightOpen />}
      </Button>
    </div>
  )
}

function MainPanel(props: {
  children: ReactNode
  isResizing: boolean
  showSidebar: boolean
  setContentWidth: (n: number) => void
}) {
  const panelRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    panelRef.current = getPanelElement('graph')
  }, [])
  useEffect(() => {
    if (panelRef.current && !props.isResizing) {
      props.setContentWidth(panelRef.current.clientWidth)
    }
  }, [props.isResizing, props.setContentWidth, props.showSidebar])

  return (
    <ResizablePanel
      defaultSize={100}
      minSize={50}
      id="graph"
      order={1}
      className={cn({
        'transition-all duration-300 ease-in-out':
          props.showSidebar && !props.isResizing,
      })}
    >
      <div className="grid h-full place-content-center">{props.children}</div>
    </ResizablePanel>
  )
}

const Sidebar = forwardRef<
  ImperativePanelHandle,
  {
    showSidebar: boolean
    isResizing: boolean
    toggleSidebar: ReturnType<typeof useToggle>[1]
  }
>((props, ref) => {
  return (
    <ResizablePanel
      id="sidebar"
      defaultSize={25}
      collapsedSize={0}
      collapsible={true}
      onCollapse={() => props.toggleSidebar(false)}
      onExpand={() => props.toggleSidebar(true)}
      minSize={25}
      order={2}
      ref={ref}
      className={cn({
        'overflow-hidden whitespace-normal transition-all duration-300 ease-in-out':
          props.showSidebar && !props.isResizing,
        'isolate z-10': true,
      })}
    >
      <div className="grid h-full w-[50vw] items-start">
        <div className="flex w-full items-center justify-between gap-4 p-4 pt-5">
          <p className="">Sidebar goes here</p>
        </div>
      </div>
    </ResizablePanel>
  )
})
Sidebar.displayName = 'Sidebar'

function getRandomTree(n = 300, reverse = false) {
  return {
    nodes: [...Array(n).keys()].map(i => ({ id: i })),
    links: [...Array(n).keys()]
      .filter(id => id)
      .map(id => ({
        [reverse ? 'target' : 'source']: id,
        [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1)),
      })),
  }
}
