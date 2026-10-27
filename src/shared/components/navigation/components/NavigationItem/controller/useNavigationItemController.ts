import type { LinkProps } from "expo-router"
import { usePathname } from "expo-router"

const useNavigationItemController = (route: LinkProps["href"]) => {
  const pathname = usePathname()
  const routePath = typeof route === "string" ? route : route.pathname
  const currentPath = pathname === "" ? "/" : pathname

  return {
    isActive:
      currentPath === routePath ||
      (routePath === "/library" && currentPath === "/budget"),
  }
}

export default useNavigationItemController
