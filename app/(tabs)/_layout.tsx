import { DemoProvider } from "@/src/features/demo/DemoProvider"
import BottomNavigation from "@/src/shared/components/navigation/Navigation"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

const TabsRouteLayout = () => (
  <DemoProvider>
    <Stack screenOptions={{ headerShown: false }} />
    <StatusBar style="dark" />
    <BottomNavigation />
  </DemoProvider>
)

export default TabsRouteLayout
