import { colors } from "@/constants/theme"
import Svg, { Path } from "react-native-svg"
import { IconProps } from "../models/IconInterface"

const TrackerIcon = ({
  size = 24,
  color = colors.text,
  ...props
}: IconProps) => (
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
    <Path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
    <Path d="M13 8l2 0" />
    <Path d="M13 12l2 0" />
  </Svg>
)

export default TrackerIcon
