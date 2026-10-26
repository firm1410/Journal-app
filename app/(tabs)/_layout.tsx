import BottomNavigation from "@/src/shared/components/navigation/Navigation"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

const TabsRouteLayout = () => (
  <>
    <Stack screenOptions={{ headerShown: false }} />
    <StatusBar style="dark" />
    <BottomNavigation />
  </>
)

export default TabsRouteLayout
