import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react"
import type { DemoData } from "./model"

export type EditorTarget = {
  kind:
    "task" | "event" | "source" | "item" | "purchase" | "collection" | "tags"
  id?: string
  collection?: string
  date?: string
}
type DemoContextValue = {
  data: DemoData
  setData: Dispatch<SetStateAction<DemoData>>
  edit: (target: EditorTarget) => void
  close: () => void
  notice: string
  notify: (text: string) => void
}
export const DemoContext = createContext<DemoContextValue | null>(null)
export const useDemo = () => {
  const value = useContext(DemoContext)
  if (!value) throw new Error("Demo screens require DemoProvider")
  return value
}
