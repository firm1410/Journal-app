import apiClient from "@/lib/api/apiClient"
import { Dispatch, SetStateAction, useCallback } from "react"
import { RecordingState } from "../../../../../models/RecordingInterface"

interface UseEditStepProps {
  transcribe: string
  date: Date
  setRecordingState: Dispatch<SetStateAction<RecordingState>>
}
const useEditStep = ({ transcribe, date }: UseEditStepProps) => {
  const onNext = useCallback(async () => {
    const response = await apiClient("/cards", {
      method: "POST",
      body: JSON.stringify({
        transcript: transcribe,
        date: date.toISOString(),
      }),
    })

    console.log(response)
  }, [transcribe, date])
  return {
    onNext,
  }
}
export default useEditStep
