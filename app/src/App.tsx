import { useMemo, useState } from "react"
import { tagged } from "./contextize/tagged"
import { Button, VStack } from "@chakra-ui/react"
import { useDebugged, debug, browserStore } from "./contextize/debug"

export type State = {
  tag: 'light' | 'dark'
  setMode(mode: 'light' | 'dark'): void
}

function useController(): State {
  const [tag_, setMode] = useState<State['tag']>('light')
  const tag = useDebugged(tag_, 'state')
  return useMemo(() => ({ tag, setMode }), [tag])
}

const modeCtl = tagged(useController)

function Display() {
  // const { tag } = modeCtl.use()
  return <p>tag</p>
}

function Switch() {
  const { tag, setMode } = modeCtl.use()
  return <Button onClick={() => setMode(tag === 'light' ? 'dark' : 'light')}>Switch [{tag}]</Button>
}

function Dark() {
  const dark = modeCtl.useDark()
  console.log('Dark:', dark)
  return <p>Dark Mode!</p>
}

export function App() {
  return (
    <VStack h='100vh' w='100vw' align='center' justify='center'>
      <debug.Provider store={browserStore('state')}>
        <modeCtl.Provider>
          <Display />
          <Switch />
          <modeCtl.Dark>
            <Dark />
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