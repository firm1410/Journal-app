import { colors } from "@/constants/theme"
import Svg, { Path } from "react-native-svg"
import type IconProps from "./IconProps"

const ChevronRightIcon = ({
  size = 24,
  color = colors.text,
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <Svg {...props} width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="m9 5 7 7-7 7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default ChevronRightIcon
