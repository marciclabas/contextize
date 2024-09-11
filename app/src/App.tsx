import { useMemo, useState } from "react"
import { tagged } from "./contextize/tagged"
import { Button, VStack } from "@chakra-ui/react"
import { useDebugged, debug, browserStore } from "./contextize/debug"

export type State = {
  tag: 'light' | 'dark'
  setMode(mode: 'light' | 'dark'): void
}

function useController() {
  const [tag_, setMode] = useState<State['tag']>('light')
  const tag = useDebugged(tag_, 'state')
  console.log('Tag', tag)
  return useMemo(() => ({ tag, setMode }), [tag])
}

const modeCtl = tagged(useController)

function Display() {
  const { tag } = modeCtl.use()
  return <p>{tag}</p>
}

function Switch() {
  const { tag, setMode } = modeCtl.use()
  return <button onClick={() => setMode(tag === 'light' ? 'dark' : 'light')}>Switch [{tag}]</button>
}

export function App() {
  return (
    <VStack>
      <Button>Say hello</Button>
      <debug.Provider store={browserStore('state')}>
        <modeCtl.Provider>
          <Display />
          <Switch />
          <modeCtl.Dark>
        <p>Dark Mode!</p>
        </modeCtl.Dark>
        <modeCtl.Light>
        <p>Light Mode!</p>
        </modeCtl.Light>
        </modeCtl.Provider>
      </debug.Provider>
    </VStack>
  )
}

export default App