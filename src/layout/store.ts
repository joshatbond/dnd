import createStore from '@/lib/createStore'

const useSidebarStore = createStore(
  'sidebar',
  {
    isOpen: false,
    isResizing: false,
    content: {
      minSize: 50,
      maxSize: 100,
      defaultSize: 100,
      width: 0,
    },
    sidebar: {
      minSize: 20,
      maxSize: 50,
      defaultSize: 30,
      collapsedSize: 0,
    },
  },
  set => ({
    resizeHandler: (isResizing?: boolean) => {
      set(
        state => {
          state.isResizing = isResizing ?? !state.isResizing
        },
        false,
        'sidebar/isResizing'
      )
    },
    setContentWidth: (width: number) => {
      set(
        state => {
          // if (state.isResizing) return

          state.content.width = width
        },
        false,
        'sidebar/setContentWidth'
      )
    },
    toggleSidebarVisibility: (isOpen?: boolean) => {
      set(
        state => {
          console.log('toggleSidebarVisibility', isOpen)
          state.isOpen = isOpen ?? !state.isOpen
          state.content.defaultSize = state.isOpen
            ? 100 - state.sidebar.defaultSize
            : 100
        },
        false,
        'sidebar/toggleSidebarVisibility'
      )
    },
  })
)

export default useSidebarStore
