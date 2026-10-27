import { Text, View } from "react-native"
import { Chip, Field, ui } from "./ui"
import type { Field as FieldDefinition, Item } from "./model"

const CustomField = ({
  field,
  value,
  items,
  onChange,
}: {
  field: FieldDefinition
  value: string
  items: Item[]
  onChange: (value: string) => void
}) => {
  if (field.type === "Checkbox")
    return (
      <Chip
        label={`${value === "true" ? "☑" : "○"} ${field.name}`}
        active={value === "true"}
        onPress={() => onChange(value === "true" ? "false" : "true")}
      />
    )
  if (
    field.type === "Item link" ||
    field.type === "Single select" ||
    field.type === "Multi-select"
  ) {
    const options =
      field.type === "Item link"
        ? items.map((item) => ({ id: item.id, label: item.name }))
        : (field.options ?? []).map((option) => ({ id: option, label: option }))
    const chosen: string[] = value ? JSON.parse(value) : []
    return (
      <View style={{ gap: 10 }}>
        <Text style={ui.label}>
          {field.name} · {field.type}
        </Text>
        <View style={ui.wrap}>
          {options.map((option) => (
            <Chip
              key={option.id}
              label={option.label}
              active={chosen.includes(option.id)}
              onPress={() =>
                onChange(
                  JSON.stringify(
                    chosen.includes(option.id)
                      ? chosen.filter((entry) => entry !== option.id)
                      : field.type === "Multi-select"
                        ? [...chosen, option.id]
                        : [option.id],
                  ),
                )
              }
            />
          ))}
        </View>
        {!options.length && (
          <Text style={ui.muted}>
            Add choices in collection settings first.
          </Text>
        )}
      </View>
    )
  }
  return (
    <Field
      label={`${field.name} · ${field.type === "Date" ? "YYYY-MM-DD" : field.type}`}
      value={value}
      onChangeText={onChange}
      numeric={field.type === "Number"}
    />
  )
}
export default CustomField
