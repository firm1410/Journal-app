import { fireEvent, render } from "@testing-library/react-native"
import { DemoProvider } from "../src/features/demo/DemoProvider"
import {
  HomeScreen,
  JournalPage,
  LibraryScreen,
} from "../src/features/demo/screens"

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn() },
}))

const renderHome = () =>
  render(
    <DemoProvider>
      <HomeScreen />
    </DemoProvider>,
  )

describe("interactive journal demo", () => {
  it("completes a task and removes it from Home priorities", async () => {
    const screen = await renderHome()
    expect(screen.getByText("2 tasks")).toBeTruthy()
    await fireEvent.press(
      screen.getByRole("checkbox", { name: "Complete Call Mum" }),
    )
    expect(screen.queryByText("Call Mum")).toBeNull()
    expect(screen.getByText("1 task")).toBeTruthy()
  })

  it("fills a missing price and updates spending and loose ends together", async () => {
    const screen = await renderHome()
    await fireEvent.press(screen.getByText("Naruto · Volume 1"))
    await fireEvent.changeText(
      screen.getByLabelText("Price · THB · leave empty if unknown"),
      "150",
    )
    await fireEvent.press(screen.getByRole("button", { name: "Save changes" }))
    expect(screen.getByText("฿390")).toBeTruthy()
    expect(screen.getByText("All details are caught up.")).toBeTruthy()
  })


  it("deleting a transcript preserves the independently saved Library purchase", async () => {
    const screen = await render(
      <DemoProvider>
        <JournalPage />
        <LibraryScreen />
      </DemoProvider>,
    )
    await fireEvent.press(
      screen.getByText(
        "“Went to the gym and bought Naruto volume 1. Call Mum today.”",
      ),
    )
    await fireEvent.press(
      screen.getByRole("button", {
        name: "Delete transcript · keep saved cards",
      }),
    )
    expect(
      screen.queryByText(
        "“Went to the gym and bought Naruto volume 1. Call Mum today.”",
      ),
    ).toBeNull()
    await fireEvent.press(screen.getByRole("button", { name: "History" }))
    expect(screen.getByText("Naruto · Volume 1")).toBeTruthy()
    expect(screen.getByText("Price missing · Purchase")).toBeTruthy()
  })


  it("creates a collection field and saves its selected value on an item", async () => {
    const screen = await render(
      <DemoProvider>
        <LibraryScreen />
      </DemoProvider>,
    )
    await fireEvent.press(screen.getByRole("button", { name: "Book" }))
    await fireEvent.press(
      screen.getByRole("button", { name: "Configure Book fields" }),
    )
    await fireEvent.changeText(screen.getByLabelText("Field name"), "Format")
    await fireEvent.press(screen.getByRole("button", { name: "Single select" }))
    await fireEvent.changeText(
      screen.getByLabelText("Choices · separated by commas"),
      "Physical, Digital",
    )
    await fireEvent.press(screen.getByRole("button", { name: "Add field" }))
    await fireEvent.press(screen.getByRole("button", { name: "Close" }))
    await fireEvent.press(screen.getByText("Naruto · Volume 1"))
    await fireEvent.press(screen.getByRole("button", { name: "Physical" }))
    await fireEvent.press(screen.getByRole("button", { name: "Save changes" }))
    await fireEvent.press(screen.getByText("Naruto · Volume 1"))
    expect(
      screen.getByRole("button", { name: "Physical", selected: true }),
    ).toBeTruthy()
  })
})
