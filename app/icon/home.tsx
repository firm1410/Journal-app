import Svg, { Path, type SvgProps } from "react-native-svg"
import { colors } from "@/constants/theme"

type IconProps = SvgProps & { size?: number }

const HomeIcon = ({ size = 24, color = colors.text, ...props }: IconProps) => (
  <Svg
    {...props}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M5 12H3l9-9 9 9h-2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7ZM9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default HomeIcon
