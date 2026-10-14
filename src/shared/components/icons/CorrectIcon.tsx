import { colors } from "@/constants/theme"
import Svg, { Path } from "react-native-svg"

import type IconProps from "./IconProps"

const StopIcon = ({ size = 24, color = colors.text, ...props }: IconProps) => (
  <Svg
    {...props}
    width={size}
    height={size}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M5 12l5 5l10 -10" />
  </Svg>
)

export default StopIcon
