import { IconProps } from "@/app/models/IconInterface"
import { LinkProps } from "expo-router"
import { ComponentType } from "react"

export interface NavItemInterface {
  name: string
  route: LinkProps["href"]
  Icon: ComponentType<IconProps>
}
