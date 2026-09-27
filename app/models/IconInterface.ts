import { SvgProps } from "react-native-svg"

export interface IconProps extends SvgProps {
  size?: number
  color?: string
  strokeWidth?: number
  variant?: "outline" | "filled"
}
