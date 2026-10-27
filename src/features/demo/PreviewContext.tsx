import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react"
const PreviewContext = createContext({ enabled: false, enter: () => {} })
export const PreviewProvider = ({ children }: PropsWithChildren) => {
  const [enabled, setEnabled] = useState(false)
  return (
    <PreviewContext.Provider value={{ enabled, enter: () => setEnabled(true) }}>
      {children}
    </PreviewContext.Provider>
  )
}
export const usePreview = () => useContext(PreviewContext)
