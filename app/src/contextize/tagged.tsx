import { createContext, PropsWithChildren, ReactNode, useContext } from 'react'

export type Use<Tag extends string> = `use${Capitalize<Tag>}`

export type SwitchProps<Tag extends string> = {
  children?: ReactNode
  tags: Tag[]
}

export type Tagged<
  Ctx extends { tag: string },
  Tag extends string = Ctx['tag'],
  Props = object
> = {
  [T in Tag as Use<T>]: () => Extract<Ctx, { tag: T }>
} & {
  [T in Tag as Capitalize<T>]: (p: PropsWithChildren) => JSX.Element
} & {
  Provider(p: Props & PropsWithChildren): JSX.Element
  Switch(p: SwitchProps<Tag>): JSX.Element
  use(): Ctx
}

export function tagged<
  Ctx extends { tag: string },
  Tag extends string = Ctx['tag'],
  Props = object | undefined
>(
  useController: (props: Props) => Ctx
): Tagged<Ctx, Tag, Props> {

  const ctx = createContext<Ctx>({} as any)
  const contexts = {}
  const hooks = {}
  const guards = {}

  function Provider({ children, ...props }: any) {
    const ctxVal = useController(props)
    return <ctx.Provider value={ctxVal} children={children} />
  }

  const use = () => useContext(ctx) // eslint-disable-line
  const guard = t => ({ children }) => {
    const { tag, ...value } = use()
    if (t !== tag)
      return null

    const Provider = contexts[t].Provider
    return <Provider {...value} children={children} />
  }

  function Switch({ tags, children }) {
    const { tag } = use()
    return tags.includes(tag) ? children : null
  }

  const proxyHandler: ProxyHandler<Tagged<Ctx, Tag, Props>> = {
    get(_, prop) {
      const propString = prop.toString()
      if (propString === 'Provider')
        return Provider

      if (propString === 'use')
        return () => useContext(ctx)

      if (propString === 'Switch')
        return Switch

      if (propString.startsWith('use')) {
        const tag = propString.slice(3).toLowerCase()
        if (!contexts[tag])
          contexts[tag] = createContext({})
        if (!hooks[tag])
          hooks[tag] = () => useContext(contexts[tag]) // eslint-disable-line
        return hooks[tag]
      }

      const capitalizedProp = propString.charAt(0).toUpperCase() + propString.slice(1)
      const tag = capitalizedProp.toLowerCase()
      if (!guards[tag]) {
        if (!contexts[tag])
          contexts[tag] = createContext({})
        guards[tag] = guard(tag)
      }
      return guards[tag]
    }
}

return new Proxy({} as any, proxyHandler)
}