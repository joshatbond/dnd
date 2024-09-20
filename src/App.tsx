import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

export default function App() {
  return (
    <div className='min-h-screen bg-neutral-950 text-white grid grid-cols-[1fr,auto]'>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel defaultSize={50}>
          <div></div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50}>
          <div></div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function getRandomTree(n = 300, reverse = false) {
  return {
    nodes: [...Array(n).keys()].map((i) => ({ id: i })),
    links: [...Array(n).keys()]
      .filter((id) => id)
      .map((id) => ({
        [reverse ? 'target' : 'source']: id,
        [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1)),
      })),
  }
}
