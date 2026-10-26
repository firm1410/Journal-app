import { act, renderHook } from "@testing-library/react-native"
import { setAudioModeAsync } from "expo-audio"
import useRecordingController from "../src/shared/components/navigation/components/RecordingControl/controllers/useRecordingController"
import { RecordingState } from "../src/shared/components/navigation/components/RecordingControl/models/RecordingInterface"

const mockStop = jest.fn()
const mockStream = { stop: mockStop }

jest.mock("expo-audio", () => ({
  requestRecordingPermissionsAsync: jest.fn(async () => ({ granted: true })),
  setAudioModeAsync: jest.fn(async () => {}),
  useAudioStream: () => ({ stream: mockStream }),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe("recording cancellation", () => {
  it.each([
    RecordingState.TRANSCRIBING,
    RecordingState.DONE_TRANSCRIBING,
    RecordingState.EDITING,
    RecordingState.SELECT_CARD,
    RecordingState.COMPLETED,
  ])("stops audio and resets the flow from %s", async (state) => {
    const { result } = await renderHook(() => useRecordingController())

    await act(async () => {
      await result.current.toggleRecording()
    })
    expect(result.current.transcribe).not.toBe("")

    await act(() => {
      result.current.setRecordingState(state)
    })
    await act(() => {
      result.current.cancelRecording()
    })

    expect(mockStop).toHaveBeenCalledTimes(1)
    expect(result.current.recordingState).toBe(RecordingState.IDLE)
    expect(result.current.transcribe).toBe("")

    await act(async () => {
      await result.current.toggleRecording()
    })
    expect(result.current.recordingState).toBe(RecordingState.TRANSCRIBING)
  })

  it("does not reopen when pending audio setup finishes after cancellation", async () => {
    let finishSetup = () => {}
    jest.mocked(setAudioModeAsync).mockImplementationOnce(
      () => new Promise<void>((resolve) => { finishSetup = resolve }),
    )
    const { result } = await renderHook(() => useRecordingController())
    let pending: Promise<void> | undefined

    await act(async () => {
      pending = result.current.toggleRecording()
      await Promise.resolve()
    })
    expect(setAudioModeAsync).toHaveBeenCalledTimes(1)

    await act(() => {
      result.current.cancelRecording()
    })
    await act(async () => {
      finishSetup()
      await pending
    })

    expect(result.current.recordingState).toBe(RecordingState.IDLE)
    expect(result.current.transcribe).toBe("")
  })
})
