import type IconProps from "@/src/shared/components/icons/IconProps"
import type { LinkProps } from "expo-router"
import type { ComponentType } from "react"

type NavigationItemModel = {
  name: string
  route: LinkProps["href"]
  Icon: ComponentType<IconProps>
}

export default NavigationItemModel
