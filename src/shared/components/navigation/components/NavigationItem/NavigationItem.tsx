import { colors, shadows } from "@/constants/theme"
import { Link } from "expo-router"
import { Pressable, StyleSheet, View } from "react-native"

import useNavigationItemController from "./controller/useNavigationItemController"
import type NavigationItemModel from "./models/NavigationItemModel"

const NavigationItem = ({ name, route, Icon }: NavigationItemModel) => {
  const { isActive } = useNavigationItemController(route)

  return (
    <Link href={route} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={name}
        accessibilityState={{ selected: isActive }}
      >
        {({ pressed }) => (
          <View
            style={[
              styles.item,
              isActive && styles.itemActive,
              pressed && styles.itemActive,
            ]}
          >
            <Icon
              color={isActive ? colors.navActiveIcon : colors.text}
              pointerEvents="none"
            />
          </View>
        )}
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    borderRadius: "100%",
    display: "flex",
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  itemActive: {
    boxShadow: shadows.navItemActive,
    transform: [{ translateY: 1 }],
  },
})

export default NavigationItem
