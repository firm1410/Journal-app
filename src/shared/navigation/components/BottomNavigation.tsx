import { StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import RecordButton from "@/src/features/recording/components/RecordButton"
import useRecordingController from "@/src/features/recording/controllers/useRecordingController"
import NavigationItem from "./NavigationItem"
import navigationItems from "../navigationItems"

const BottomNavigation = () => {
  const { bottom } = useSafeAreaInsets()
  const recording = useRecordingController()

  return (
    <View style={[styles.wrapper, { bottom: bottom + 12 }]}>
      {navigationItems.slice(0, 2).map((item) => (
        <NavigationItem {...item} key={item.name} />
      ))}
      <View style={styles.recordingSpace} />
      <RecordButton {...recording} />
      {navigationItems.slice(2).map((item) => (
        <NavigationItem {...item} key={item.name} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 48,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: "absolute",
    width: "92%",
  },
  recordingSpace: {
    alignItems: "center",
    borderRadius: 18,
    height: 48,
    justifyContent: "center",
    width: 72,
  },
})

export default BottomNavigation
