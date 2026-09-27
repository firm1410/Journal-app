import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import Nav from "../components/Nav/Nav"

const RootLayout = () => {
  return (
    <>
      <Stack />
      <StatusBar style="dark" />
      <Nav />
    </>
  )
}

export default RootLayout
