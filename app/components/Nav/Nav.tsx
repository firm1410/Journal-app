import MicIcon from "@/app/icon/mic"
import { colors } from "@/constants/theme"
import { Pressable, StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import NavItem from "./components/NavItem"
import { nav } from "./constant/navConstant"

const Nav = () => {
  const { bottom } = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View style={[styles.wrapper, { bottom: bottom + 12 }]}>
      <View style={styles.items}>
        {nav.slice(0, 2).map((res) => (
          <NavItem {...res} key={res.name} />
        ))}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Record a journal entry"
        onPress={() => router.push("/journal?compose=record")}
        style={({ pressed }) => [
          styles.record,
          pressed && styles.recordPressed,
        ]}
      >
        <MicIcon size={24} color={colors.background} />
      </Pressable>
      <View style={styles.items}>
        {nav.slice(2, 4).map((res) => (
          <NavItem {...res} key={res.name} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    backgroundColor: colors.navBackground,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "92%",
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.48,
    shadowRadius: 14,
    elevation: 10,
  },
  items: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  record: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.accent,
    shadowColor: colors.shadowAccent,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.42,
    shadowRadius: 7,
    elevation: 7,
  },
  recordPressed: {
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ translateY: 2 }],
  },
})
export default Nav
