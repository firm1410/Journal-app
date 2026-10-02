import type { SvgProps } from "react-native-svg"

type IconProps = SvgProps & {
  size?: number
  color?: string
  strokeWidth?: number
  variant?: "outline" | "filled"
}

export default IconProps
