# Contextize

> React context-based state management, simplified

```bash
npm i contextize
```

## Why Contextize?

In React, a common pattern is to have:
- **Logic-only components**, or "controllers", usually wrapping childs in a context
- **UI-only components**, consuming the contexts

Contextize simplifies this pattern by separating:
- **Logic**: custom, written by you
- **Context/Provider semantics**: always the same, provided by Contextize

## Simple Contexts

Let's say we're managing a boolean state. In a typical React app, we'd have to:

**A) Vanilla React**

1. Create a context
2. Create a hook
3. Create a provider

```jsx
import { createContext, useContext, useState } from 'react'

const ctx = createContext({})
const useCtx = () => useContext(ctx)

function Provider({ children }) {
  const [state, setState] = useState()
  return <ctx.Provider value={[state, setState]} children={children} />
}
```

Notice that `useState()` is the only non-boilerplate code. Everything else is the same.

**B) Contextize**

In contextize, we only define a hook that returns the context value. Wrapping it in a provider is handled by contextize:

```jsx
import { contextize } from 'contextize'

function useController() {
  return useState(false)
}
const ctx = contextize(useController)
```

The `ctx` object gives access to both the provider and the hook:

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

Another common pattern is to have a tagged state. Depending on the tag, we render different components. For example:

```ts
export type State = {
  tag: 'loading' | 'error'
} | {
  tag: 'loaded'
  data: string
}
```

In a typical React app, we'd have to:

**A) Vanilla React**

1. Create a context, hook and provider (as before)
2. Add an extra layer with explicit switching logic
3. Pass down the state via props or create yet another context

```jsx
const ctx = createContext({})
const useCtx = () => useContext(ctx)

function Provider({ children }) {
  const [state, setState] = useState<State>({ tag: 'loading' })
  useEffect(() => { ... }, [])
  return <ctx.Provider value={state} children={children} />
}

function Loaded({ data }) {
  return <p>{data}</p>
}

function Switcher() {
  const state = useCtx()
  if (state.tag === 'loading') return <p>Loading...</p>
  if (state.tag === 'error') return <p>Error :/</p>
  return <Loaded data={state.data} />
}

function App() {
  return (
    <Provider>
      <Switcher />
    </Provider>
  )
}
```

Notice that:
1. For the provider: only `useState()` and `useEffect()` are non-boilerplate
2. For switching, we're forced to add a wrapping component

**B) Contextize**

In Contextize, we only need to define a hook returning the (tagged) context value. For switching, we use the provided guard components.

```jsx
import { tagged } from 'contextize'

function useController(): State {
  const [state, setState] = useState<State>({ tag: 'loading' })
  useEffect(() => { ... }, [])
  return state
}

const ctx = tagged(useController)
```

Like before, `ctx` contains both the provider and hook. But it also includes:
- Guard components: `ctx.Loading`, `ctx.Error`, `ctx.Loaded`
- Guarded hooks: `ctx.useLoading`, `ctx.useError`, `ctx.useLoaded`

**Example Usage**

```jsx

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
```

Note that **these are completely typed**.

If we added a `weirdState` tag, we'd get `ctx.WeirdState` and `ctx.useWeirdState` (and typescript would know about it).



