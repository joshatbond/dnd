import { ReactNode, useEffect, useRef } from 'react'
import { ImperativePanelHandle, getPanelElement } from 'react-resizable-panels'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { cn } from '@/lib/cn'

import useSidebarStore from './store'

export function PanelContainer(props: {
  primaryContent: ReactNode
  sidebarContent: ReactNode
}) {
  const isSidebarOpen = useSidebarStore(state => state.isOpen)
  const resizeHandler = useSidebarStore(state => state.resizeHandler)

  return (
    <ResizablePanelGroup direction="horizontal">
      <MainPanel>{props.primaryContent}</MainPanel>

      {isSidebarOpen && (
        <ResizableHandle withHandle onDragging={e => resizeHandler(e)} />
      )}

      <SidebarPanel>{props.sidebarContent}</SidebarPanel>
    </ResizablePanelGroup>
  )
}

function MainPanel(props: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)
  const contentState = useSidebarStore(state => state.content)
  const isOpen = useSidebarStore(state => state.isOpen)
  const isResizing = useSidebarStore(state => state.isResizing)
  const setContentWidth = useSidebarStore(state => state.setContentWidth)

  useEffect(() => {
    ref.current = getPanelElement('graph')
  }, [])

  useEffect(() => {
    if (!ref.current || isResizing) return

    setContentWidth(isOpen ? ref.current.clientWidth : window.innerWidth)
  }, [isResizing, isOpen])

  return (
    <ResizablePanel
      {...contentState}
      order={1}
      id="graph"
      className={cn({
        'transition-all duration-300 ease-in-out': isOpen && !isResizing,
      })}
    >
      {props.children}
    </ResizablePanel>
  )
}

function SidebarPanel(props: { children: ReactNode }) {
  const ref = useRef<ImperativePanelHandle | null>(null)
  const sidebarState = useSidebarStore(state => state.sidebar)
  const isOpen = useSidebarStore(state => state.isOpen)
  const isResizing = useSidebarStore(state => state.isResizing)

  useEffect(() => {
    if (ref.current) {
      ref.current[isOpen ? 'expand' : 'collapse']()
    }
  }, [isOpen])

  return (
    <ResizablePanel
      {...sidebarState}
      collapsible={true}
      order={2}
      id="sidebar"
      ref={ref}
      className={cn({
        'overflow-hidden whitespace-normal transition-all duration-300 ease-in-out':
          isOpen && !isResizing,
        'isolate z-10': true,
      })}
    >
      {props.children}
    </ResizablePanel>
  )
}
