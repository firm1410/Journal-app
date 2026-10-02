import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

import BottomNavigation from "./components/BottomNavigation"

const TabsLayout = () => (
  <>
    <Stack />
    <StatusBar style="dark" />
    <BottomNavigation />
  </>
)

export default TabsLayout
