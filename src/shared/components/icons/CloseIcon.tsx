import { colors } from "@/constants/theme"
import Svg, { Path } from "react-native-svg"
import type IconProps from "./IconProps"

const CloseIcon = ({
  size = 24,
  color = colors.text,
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <Svg
    {...props}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)

export default CloseIcon
