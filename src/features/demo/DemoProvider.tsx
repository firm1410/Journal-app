import { useState, type PropsWithChildren } from "react"
import { Modal, ScrollView, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { initialData } from "./model"
import { Button, ui } from "./ui"
import Editor from "./Editor"

import { DemoContext, type EditorTarget } from "./useDemo"

export const DemoProvider = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState(initialData)
  const [target, setTarget] = useState<EditorTarget | null>(null)
  const [notice, notify] = useState("")
  const { top, bottom } = useSafeAreaInsets()
  const close = () => setTarget(null)
  return (
    <DemoContext.Provider
      value={{ data, setData, edit: setTarget, close, notice, notify }}
    >
      {children}
      <Modal
        visible={Boolean(target)}
        animationType="slide"
        onRequestClose={close}
        presentationStyle="pageSheet"
      >
        <ScrollView
          style={ui.page}
          contentContainerStyle={{
            padding: 24,
            paddingTop: top + 20,
            paddingBottom: bottom + 40,
            gap: 22,
            maxWidth: 760,
            width: "100%",
            alignSelf: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={ui.row}>
            <Text style={ui.eyebrow}>Make it yours · sample data</Text>
            <Button label="Close" onPress={close} />
          </View>
          {target && (
            <Editor
              key={`${target.kind}-${target.id}-${target.collection}`}
              target={target}
            />
          )}
        </ScrollView>
      </Modal>
    </DemoContext.Provider>
  )
}
