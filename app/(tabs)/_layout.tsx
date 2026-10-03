import BottomNavigation from "@/src/shared/navigation/Navigation"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

const TabsRouteLayout = () => (
  <>
    <Stack />
    <StatusBar style="dark" />
    <BottomNavigation />
  </>
)

export default TabsRouteLayout
