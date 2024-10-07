# Contextize

> React context-based state management, simplified

```bash
npm i contextize
```

```bash
yarn add contextize
```

## Simple Contexts

**A) Vanilla React**

1. Create a context
2. Create a hook
3. Create a provider

```jsx
import { createContext, useContext, useState } from 'react'

const ctx = createContext()
const useCtx = () => useContext(ctx)

function Provider({ children }) {
  const [state, setState] = useState()
  return <ctx.Provider value={[state, setState]} children={children} />
}
```

**B) Contextize**

1. Create a "controller" hook. That's it!

```jsx
import { contextize } from 'contextize'

function useController() {
  return useState(false)
}
const ctx = contextize(useController)
```

**Example Usage**

```jsx
function Component() {
  const [state, setState] = ctx.use()
  ...
}

function App() {
  return (
    <ctx.Provider>
      <Component />
    </ctx.Provider>
  )
}
```

## Tagged Contexts

Let's say we have to switch according to this state:

```ts
export type State = {
  tag: 'loading' | 'error'
} | {
  tag: 'loaded'
  data: string
}
```

**A) Vanilla React**

1. Create a context
2. Create a hook
3. Create a provider
4. Extra layer with explicit switching logic
5. Pass down the state via props or create yet another context

```jsx
const ctx = createContext<State>({} as any) // 1
const useCtx = () => useContext(ctx) // 2

function Provider({ children }) { // 3
  const [state, setState] = useState<State>({ tag: 'loading' })

  useEffect(() => {
    fetch('/api/data')
      .then(data => setState{ tag: 'loaded', data })
      .catch(() => setState({ tag: 'error' }))
  }, [])

  return <ctx.Provider value={state} children={children} />
}

function Loaded({ data }) {
  return <p>{data}</p>
}

function Switcher() {
  const state = useCtx()
  if (state.tag === 'loading') return <p>Loading...</p> // 4
  if (state.tag === 'error') return <p>Error :/</p>
  return <Loaded data={state.data} /> // 5
}

function App() {
  return (
    <Provider>
      <Switcher />
    </Provider>
  )
}
```

**B) Contextize**
1. Create a controller hook
2. Use contextize's guard components. That's it!

```jsx
import { tagged } from 'contextize'

function useController(): State {
  const [state, setState] = useState<State>({ tag: 'loading' })
  useEffect(() => {
    fetch('/api/data')
      .then(data => setState{ tag: 'loaded', data })
      .catch(() => setState({ tag: 'error' }))
  }, [])
  return state
}

const ctx = tagged(useController)

function Loaded() {
  const { data } = ctx.useLoaded()
  // ...
}

function App() {
  return (
    <ctx.Provider>
      <ctx.Loading><p>Loading...</p></ctx.Loading>
      <ctx.Error><p>Error :/</p></ctx.Error>
      <ctx.Loaded><Loaded /></ctx.Loaded>
    </ctx.Provider>
  )
}