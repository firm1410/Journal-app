import { colors } from "@/constants/theme"
import Svg, { Path } from "react-native-svg"
import { IconProps } from "../models/IconInterface"

const MicIcon = ({ size = 24, color = colors.text, ...props }: IconProps) => (
  <Svg {...props} width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 5a3 3 0 0 1 3-3 3 3 0 0 1 3 3v5a3 3 0 0 1-3 3 3 3 0 0 1-3-3V5ZM5 10a7 7 0 0 0 14 0M8 21h8M12 17v4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default MicIcon
