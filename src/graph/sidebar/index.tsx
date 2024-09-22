import { PlusIcon, X } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import store, { TNode } from '@/graph/store'
import useNodeStore from '@/graph/store'
import useLayoutStore from '@/layout/store'

export function Sidebar() {
  const nodes = store(state => state.nodes)
  const isDebugMode = useNodeStore(state => state.isDebugMode)
  const toggleDebugMode = useNodeStore(state => state.toggleDebugMode)

  return (
    <aside className="h-full bg-gray-700 text-primary-foreground">
      <ActionBar />
      <div className="flex justify-between px-4 py-2">
        <label htmlFor="debug-mode" className="text-sm text-muted-foreground">
          Debug Mode {isDebugMode ? 'On' : 'Off'}
        </label>
        <Switch
          id="debug-mode"
          checked={isDebugMode}
          onCheckedChange={toggleDebugMode}
        />
      </div>
      <section className="p-4">
        {nodes.length === 0 ? <EmptyNodes /> : <Node />}
      </section>
    </aside>
  )
}
function ActionBar() {
  const toggleSidebarVisibility = useLayoutStore(
    state => state.toggleSidebarVisibility
  )
  const createNode = useNodeStore(state => state.createNode)

  return (
    <header className="shadow-3l flex bg-gray-800 p-2 shadow-sm shadow-black">
      <div className="flex flex-1 items-center gap-4">
        <Button
          variant="neumorphic"
          className="h-auto bg-gray-700 p-1 hover:bg-gray-700 focus-visible:bg-gray-700"
          onClick={createNode}
        >
          <PlusIcon />
        </Button>
      </div>
      <Button
        variant="neumorphic"
        className="h-auto bg-gray-700 p-1 hover:bg-gray-700 focus-visible:bg-gray-700"
        onClick={() => toggleSidebarVisibility(false)}
      >
        <X />
      </Button>
    </header>
  )
}
function EmptyNodes() {
  return (
    <div>
      <p> No nodes exist! Create one to get started...</p>
    </div>
  )
}
function Node() {
  const nodes = useNodeStore(state => state.nodes)
  const isDebugMode = useNodeStore(state => state.isDebugMode)
  const activeNodeId = useNodeStore(state => state.activeNode)
  const currentNode = useMemo(() => {
    const refineAttributes = (n: TNode) => {
      const nonDebugKeys = ['nodeVal', 'label', 'color']
      return Object.entries(n)
        .map(([key, value]) => {
          if (nonDebugKeys.includes(key)) {
            return {
              key,
              value,
              label:
                key === 'label'
                  ? 'Node Label'
                  : key === 'color'
                    ? 'Node Color'
                    : 'Node Size',
            }
          }
          if (isDebugMode) {
            return { key, value, label: key }
          }
          return undefined
        })
        .filter(Boolean) as DisplayNode[]
    }
    if (!activeNodeId) return []

    const node = nodes.find(n => n.id === activeNodeId)
    return node ? refineAttributes(node) : []
  }, [activeNodeId, nodes, isDebugMode])

  return (
    <div className="grid gap-2">
      {currentNode ? (
        <NodeAttribute attr={currentNode} _id={activeNodeId!} />
      ) : null}
    </div>
  )
}
function NodeAttribute({
  attr,
  depth = 0,
  _id,
}: {
  attr: DisplayNode | DisplayNode[]
  depth?: number
  _id: string
}) {
  if (depth > 3) return null
  if (Array.isArray(attr)) {
    const newDepth = depth++
    return (
      <>
        {attr.map((attr, i) => (
          <NodeAttribute
            attr={attr}
            depth={newDepth}
            key={`${attr.key}-${i}`}
            _id={_id}
          />
        ))}
      </>
    )
  }
  if (typeof attr.value === 'object') {
    if (attr.key === '__threeObj') return null
    return (
      <NodeAttribute
        attr={Object.entries(attr).map(([key, value]) => ({
          key: key as keyof TNode,
          value,
          label: key,
        }))}
        depth={depth++}
        _id={_id}
      />
    )
  }

  return (
    <div className="flex items-end gap-2">
      <label htmlFor={attr.key} className="min-w-24">
        {attr.label}:
      </label>
      <Input
        _id={_id}
        nodeKey={attr.key}
        value={attr.value as string | number}
      />
    </div>
  )
}

function Input(props: {
  _id: string
  nodeKey: keyof TNode
  value: number | string
}) {
  const editNodeProperty = useNodeStore(state => state.editNodeProperty)

  const type = typeof props.value === 'number' ? 'number' : 'string'
  return (
    <input
      id={props.nodeKey}
      className="border-b border-b-muted-foreground bg-transparent px-4 py-1 hover:rounded-t hover:border-b-secondary hover:bg-gray-900 focus-visible:rounded-t focus-visible:border-b-secondary focus-visible:bg-gray-900 active:rounded-t active:border-b-secondary active:bg-gray-900"
      type={type === 'number' ? 'number' : 'text'}
      value={props.value}
      onChange={e =>
        editNodeProperty(
          props._id,
          props.nodeKey,
          type === 'number' ? +e.target.value : e.target.value
        )
      }
    />
  )
}

type DisplayNode = { key: keyof TNode; value: unknown; label: string }
