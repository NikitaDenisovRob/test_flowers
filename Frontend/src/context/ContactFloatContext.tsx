import { createContext, useContext, useState, type ReactNode } from 'react'

interface Ctx {
  open: boolean
  setOpen: (v: boolean | ((p: boolean) => boolean)) => void
  visible: boolean
  setVisible: (v: boolean) => void
}

const ContactFloatCtx = createContext<Ctx>({
  open: false,
  setOpen: () => {},
  visible: false,
  setVisible: () => {},
})

export const useContactFloat = () => useContext(ContactFloatCtx)

export function ContactFloatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  return (
    <ContactFloatCtx.Provider value={{ open, setOpen, visible, setVisible }}>
      {children}
    </ContactFloatCtx.Provider>
  )
}
