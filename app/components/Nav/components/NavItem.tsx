import { Link, usePathname } from "expo-router"
import { Pressable, StyleSheet } from "react-native"
import { cloneElement, isValidElement } from "react"
import { colors } from "@/constants/theme"
import { NavItemInterface } from "../models/NavInterface"

interface NavItemProps extends NavItemInterface {}

const NavItem = ({ name, route, Icon }: NavItemProps) => {
  const pathname = usePathname()
  const routePath = typeof route === "string" ? route : route.pathname
  const currentPath = pathname === "" ? "/" : pathname
  const isActive = currentPath === routePath
  const icon = isValidElement<{ color?: string }>(Icon)
    ? cloneElement(Icon, {
        color: isActive ? colors.navActiveIcon : colors.text,
      })
    : Icon

  return (
    <Link key={name} href={route} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={name}
        accessibilityState={{ selected: isActive }}
        style={({ pressed }) => [
          styles.item,
          isActive && styles.itemActive,
          pressed && styles.pressed,
        ]}
      >
        {icon}
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    borderRadius: 18,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  itemActive: {
    backgroundColor: colors.navActive,
    shadowColor: colors.shadowAccent,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.38,
    shadowRadius: 4,
    elevation: 4,
  },
  pressed: {
    backgroundColor: colors.navBackground,
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.42,
    shadowRadius: 5,
    elevation: 3,
    transform: [{ translateY: 1 }],
  },
})

export default NavItem
