import { createContext, PropsWithChildren, useContext } from 'react'

export type Use<Tag extends string> = `use${Capitalize<Tag>}`

export type Contextized<Ctx, Props = object> = {
  Provider(p: Props & PropsWithChildren): JSX.Element
  use(): Ctx
}

export function contextize<Ctx, Props = object | undefined>(
  useController: (props: Props) => Ctx, defaultCtx?: Ctx
): Contextized<Ctx, Props> {

  const ctx = createContext<Ctx>(defaultCtx as Ctx)

  function Provider({ children, ...props }: any) {
    const ctxVal = useController(props)
    return <ctx.Provider value={ctxVal} children={children} />
  }
  const use = () => useContext(ctx) // eslint-disable-line
  
  return { Provider, use }
}