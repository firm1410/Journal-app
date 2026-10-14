import { useState } from "react"

interface UseEditStepProps {
  transcribe: string
}
const useEditStep = ({ transcribe }: UseEditStepProps) => {
  const [editText, setEditText] = useState(transcribe)
  const [dateTime, setDateTime] = useState(new Date())

  return {
    editText,
    setEditText,
    dateTime,
    setDateTime,
  }
}
export default useEditStep
