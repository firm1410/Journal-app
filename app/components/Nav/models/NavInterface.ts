import { LinkProps } from "expo-router"
import { ReactNode } from "react"

export interface NavItemInterface {
  name: string
  route: LinkProps["href"]
  Icon: ReactNode
}
