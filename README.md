# Contextize

> React context-based state management, simplified

```bash
npm i contextize
```

```bash
yarn add contextize
```

## Providers

```jsx
import { contextize } from 'contextize'

function useBool() {
  return useState(false)
}
const boolCtl = contextize(useBool)

function Child() {
  const [bool, setBool] = boolCtl.use()
  // ...
}

function App() {
  return (
    <boolCtl.Provider>
      <Child />
    </boolCtl.Provider>
  )
}
```

## Tagged Providers

```jsx
import { tagged } from 'contextize'

export type State = {
  tag: 'loading' | 'error'
} | {
  tag: 'loaded'
  data: string
}

function useController(): State {
  const [state, setState] = useState<State>({ tag: 'loading' })
  useEffect(() => {
    fetch('/api/data').then(data => setState{ tag: 'loaded', data })
  }, [])
  return state
}

const ctl = tagged(useController)

function Loaded() {
  const { data } = ctl.useLoaded()
  // ...
}

function App() {
  return (
    <ctl.Provider>
      <ctl.Loading>
        <p>Loading...</p>
      </ctl.Loading>
      <ctl.Error>
        <p>Error :/</p>
      </ctl.Error>
      <ctl.Loaded>
        <Loaded />
      </ctl.Loaded>
      <ctl.Switch tags={['loading', 'error']}>
        <p>Not loaded</p>
      </ctl.Switch>
    </ctl.Provider>
  )
}