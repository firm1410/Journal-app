import { useState } from "react"

interface UseEditStepProps {
  transcribe: string
  initialDateTime: Date
}
const useEditStep = ({ transcribe, initialDateTime }: UseEditStepProps) => {
  const [editText, setEditText] = useState(transcribe)
  const [dateTime, setDateTime] = useState(initialDateTime)

  return {
    editText,
    setEditText,
    dateTime,
    setDateTime,
  }
}
export default useEditStep
