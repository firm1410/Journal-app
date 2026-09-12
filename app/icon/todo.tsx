import { colors } from "@/constants/theme"
import Svg, { Path, type SvgProps } from "react-native-svg"

type IconProps = SvgProps & { size?: number }

const TodoIcon = ({ size = 24, color = colors.text, ...props }: IconProps) => (
  <Svg
    {...props}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M3.5 5.5l1.5 1.5l2.5 -2.5" />
    <Path d="M3.5 11.5l1.5 1.5l2.5 -2.5" />
    <Path d="M3.5 17.5l1.5 1.5l2.5 -2.5" />
    <Path d="M11 6l9 0" />
    <Path d="M11 12l9 0" />
    <Path d="M11 18l9 0" />
  </Svg>
)

export default TodoIcon
