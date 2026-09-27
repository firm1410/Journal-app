import { StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Record from "../Record/Record"
import NavItem from "./components/NavItem"
import { nav } from "./constant/navConstant"

const Nav = () => {
  const { bottom } = useSafeAreaInsets()

  return (
    <View style={[styles.wrapper, { bottom: bottom + 12 }]}>
      {nav.slice(0, 2).map((res) => (
        <NavItem {...res} key={res.name} />
      ))}
      <View style={styles.blank} />
      <Record />
      {nav.slice(2, 4).map((res) => (
        <NavItem {...res} key={res.name} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    borderRadius: 48,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "92%",
  },
  blank: {
    alignItems: "center",
    borderRadius: 18,
    height: 48,
    justifyContent: "center",
    width: 72,
  },
  items: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
})
export default Nav
