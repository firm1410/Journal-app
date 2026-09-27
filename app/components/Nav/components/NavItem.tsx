import { colors, shadows } from "@/constants/theme"
import { Link, usePathname } from "expo-router"
import { Pressable, StyleSheet, View } from "react-native"
import { NavItemInterface } from "../models/NavInterface"

type NavItemProps = NavItemInterface

const NavItem = ({ name, route, Icon }: NavItemProps) => {
  const pathname = usePathname()
  const routePath = typeof route === "string" ? route : route.pathname
  const currentPath = pathname === "" ? "/" : pathname

  const isActive = currentPath === routePath

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
    borderRadius: "100%",
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  itemActive: {
    boxShadow: shadows.navItemActive,
    transform: [{ translateY: 1 }],
  },
})

export default NavItem
