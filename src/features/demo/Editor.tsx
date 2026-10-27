import { useState } from "react"
import { Text, View } from "react-native"
import { useDemo, type EditorTarget } from "./useDemo"
import { today, validDate } from "./model"
import { router } from "expo-router"
import CustomField from "./CustomField"
import { Button, Card, Chip, Field, ui } from "./ui"

const Editor = ({ target }: { target: EditorTarget }) => {
  const { data, setData, close, notify } = useDemo()
  const task = data.tasks.find((value) => value.id === target.id)
  const event = data.events.find((value) => value.id === target.id)
  const source = data.sources.find((value) => value.id === target.id)
  const item = data.items.find((value) => value.id === target.id)
  const purchase = data.purchases.find((value) => value.id === target.id)
  const [detail, setDetail] = useState(
    task?.detail ??
      event?.detail ??
      source?.text ??
      item?.name ??
      purchase?.detail ??
      "",
  )
  const [date, setDate] = useState(
    task?.due ??
      event?.date ??
      source?.date ??
      purchase?.date ??
      target.date ??
      today(),
  )
  const [time, setTime] = useState(event?.time ?? "10:00")
  const [duration, setDuration] = useState(String(event?.duration ?? 60))
  const [amount, setAmount] = useState(purchase?.amount?.toString() ?? "")
  const [collection, setCollection] = useState(
    item?.collection ?? target.collection ?? "Book",
  )
  const [author, setAuthor] = useState(item?.author ?? "")
  const [status, setStatus] = useState(item?.status ?? "Unread")
  const [owned, setOwned] = useState(item?.owned ?? true)
  const [fieldName, setFieldName] = useState("")
  const [fieldType, setFieldType] = useState("Text")
  const [fieldOptions, setFieldOptions] = useState("")
  const [tag, setTag] = useState("")
  const [error, setError] = useState("")
  const [customValues, setCustomValues] = useState(item?.fields ?? {})
  const tagDate = target.date ?? today()
  const tags = data.tagsByDate[tagDate] ?? []
  const [id] = useState(() => target.id ?? `demo-${Date.now()}`)
  const save = () => {
    if (!detail.trim()) return setError("Add a description before saving.")
    if (
      target.kind !== "item" &&
      (target.kind !== "task" || date) &&
      !validDate(date)
    )
      return setError("Use a valid date in YYYY-MM-DD format.")
    if (target.kind === "source" && date > today())
      return setError("Journal records cannot be dated in the future.")
    if (target.kind === "event" && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
      return setError("Use a time in HH:MM format.")
    if (
      target.kind === "event" &&
      (!Number.isFinite(Number(duration)) || Number(duration) <= 0)
    )
      return setError("Choose a duration greater than zero minutes.")
    if (
      target.kind === "purchase" &&
      amount !== "" &&
      (!Number.isFinite(Number(amount)) || Number(amount) < 0)
    )
      return setError("Enter a positive price, or leave it empty.")
    if (target.kind === "item") {
      for (const field of data.collections[collection] ?? []) {
        const value = customValues[`${collection}:${field.name}`]
        if (!value) continue
        if (field.type === "Number" && !Number.isFinite(Number(value)))
          return setError(`${field.name} needs a number.`)
        if (field.type === "Date" && !validDate(value))
          return setError(`${field.name} needs a date in YYYY-MM-DD format.`)
      }
    }
    setData((current) => {
      const next = { ...current }
      if (target.kind === "task")
        next.tasks = [
          ...current.tasks.filter((value) => value.id !== id),
          {
            id,
            detail: detail.trim(),
            due: date,
            completed: task?.completed ?? false,
          },
        ]
      if (target.kind === "event")
        next.events = [
          ...current.events.filter((value) => value.id !== id),
          { id, detail: detail.trim(), date, time, duration: Number(duration) },
        ]
      if (target.kind === "purchase")
        next.purchases = current.purchases.map((value) =>
          value.id === id
            ? {
                ...value,
                detail: detail.trim(),
                date,
                amount: amount === "" ? null : Number(amount),
              }
            : value,
        )
      if (target.kind === "source") {
        next.sources = current.sources.map((value) =>
          value.id === id ? { ...value, text: detail.trim(), date } : value,
        )
        next.summaries = { ...current.summaries }
        delete next.summaries[date]
        if (source) delete next.summaries[source.date]
      }
      if (target.kind === "item")
        next.items = [
          ...current.items.filter((value) => value.id !== id),
          {
            id,
            name: detail.trim(),
            author,
            status,
            collection,
            owned,
            fields: customValues,
          },
        ]
      return next
    })
    notify("Changes saved to this demo session.")
    close()
  }
  const remove = () => {
    setData((current) => {
      const next = { ...current }
      if (target.kind === "task")
        next.tasks = current.tasks.filter((value) => value.id !== id)
      if (target.kind === "event")
        next.events = current.events.filter((value) => value.id !== id)
      if (target.kind === "source") {
        next.sources = current.sources.filter((value) => value.id !== id)
        next.summaries = { ...current.summaries }
        if (source) delete next.summaries[source.date]
      }
      if (target.kind === "item")
        next.items = current.items.map((value) =>
          value.id === id ? { ...value, archived: true } : value,
        )
      if (target.kind === "purchase")
        next.purchases = current.purchases.filter((value) => value.id !== id)
      return next
    })
    notify(
      target.kind === "source"
        ? "Transcript deleted. Saved cards are kept."
        : "Removed from this demo session.",
    )
    close()
  }
  if (target.kind === "tags")
    return (
      <>
        <Text style={ui.title}>Activity tags</Text>
        <Text style={ui.muted}>
          Your corrections stay separate from the generated story.
        </Text>
        <View style={ui.wrap}>
          {tags.map((value) => (
            <Chip
              key={value}
              label={`${value} ×`}
              onPress={() =>
                setData((current) => ({
                  ...current,
                  tagsByDate: {
                    ...current.tagsByDate,
                    [tagDate]: (current.tagsByDate[tagDate] ?? []).filter(
                      (entry) => entry !== value,
                    ),
                  },
                }))
              }
            />
          ))}
        </View>
        <Field label="New activity tag" value={tag} onChangeText={setTag} />
        {error ? (
          <Text accessibilityRole="alert" style={ui.muted}>
            {error}
          </Text>
        ) : null}
        <Button
          primary
          label="Add tag"
          onPress={() => {
            const normalized = tag.replace(/\s/g, "").toLowerCase()
            if (
              !normalized ||
              tags.some(
                (value) =>
                  value.replace(/\s/g, "").toLowerCase() === normalized,
              )
            )
              return setError("Enter a new, distinct tag name.")
            setData((current) => ({
              ...current,
              tagsByDate: {
                ...current.tagsByDate,
                [tagDate]: [...(current.tagsByDate[tagDate] ?? []), tag.trim()],
              },
            }))
            setTag("")
            setError("")
          }}
        />
      </>
    )
  if (target.kind === "collection")
    return (
      <>
        <Text style={ui.title}>
          {target.collection ? `${collection} fields` : "New collection"}
        </Text>
        {!target.collection && (
          <>
            <Field
              label="Collection name"
              value={detail}
              onChangeText={setDetail}
            />
            <Button
              label="Create collection"
              primary
              onPress={() => {
                if (
                  !detail.trim() ||
                  Object.keys(data.collections).some(
                    (name) =>
                      name.toLowerCase() === detail.trim().toLowerCase(),
                  )
                )
                  return setError("Choose a new collection name.")
                setData((current) => ({
                  ...current,
                  collections: { ...current.collections, [detail.trim()]: [] },
                }))
                close()
              }}
            />
          </>
        )}
        {target.collection && (
          <>
            <Text style={ui.muted}>
              Define the fields you want to keep for this collection.
            </Text>
            {(data.collections[collection] ?? []).map((field) => (
              <Card key={field.name}>
                <Text style={ui.heading}>{field.name}</Text>
                <Text style={ui.muted}>{field.type}</Text>
              </Card>
            ))}
            <Field
              label="Field name"
              value={fieldName}
              onChangeText={setFieldName}
            />
            <View style={ui.wrap}>
              {[
                "Text",
                "Number",
                "Date",
                "Checkbox",
                "Single select",
                "Multi-select",
                "Item link",
              ].map((value) => (
                <Chip
                  key={value}
                  label={value}
                  active={value === fieldType}
                  onPress={() => setFieldType(value)}
                />
              ))}
            </View>
            {(fieldType === "Single select" ||
              fieldType === "Multi-select") && (
              <Field
                label="Choices · separated by commas"
                value={fieldOptions}
                onChangeText={setFieldOptions}
              />
            )}
            <Button
              label="Add field"
              primary
              onPress={() => {
                if (
                  !fieldName.trim() ||
                  data.collections[collection].some(
                    (field) =>
                      field.name.toLowerCase() ===
                      fieldName.trim().toLowerCase(),
                  )
                )
                  return setError("Choose a distinct field name.")
                if (
                  (fieldType === "Single select" ||
                    fieldType === "Multi-select") &&
                  !fieldOptions.split(",").some((value) => value.trim())
                )
                  return setError("Add at least one choice.")
                setData((current) => ({
                  ...current,
                  collections: {
                    ...current.collections,
                    [collection]: [
                      ...current.collections[collection],
                      {
                        name: fieldName.trim(),
                        type: fieldType,
                        options: [
                          ...new Set(
                            fieldOptions
                              .split(",")
                              .map((value) => value.trim())
                              .filter(Boolean),
                          ),
                        ],
                      },
                    ],
                  },
                }))
                setFieldName("")
                setFieldOptions("")
                setError("")
              }}
            />
          </>
        )}
        {error ? (
          <Text accessibilityRole="alert" style={ui.muted}>
            {error}
          </Text>
        ) : null}
      </>
    )
  return (
    <>
      <Text style={ui.title}>
        {target.kind === "item"
          ? "A thing to keep"
          : target.kind === "source"
            ? "Your words"
            : target.kind === "purchase"
              ? "Purchase details"
              : `${target.id ? "Edit" : "New"} ${target.kind}`}
      </Text>
      <Field
        label={
          target.kind === "source"
            ? "Transcript"
            : target.kind === "item"
              ? "Item name"
              : "Description"
        }
        value={detail}
        onChangeText={setDetail}
        multiline={target.kind === "source"}
      />
      {target.kind !== "item" && (
        <Field
          label={
            target.kind === "task"
              ? "Due date · YYYY-MM-DD · optional"
              : "Journal date · YYYY-MM-DD"
          }
          value={date}
          onChangeText={setDate}
        />
      )}
      {target.kind === "event" && (
        <>
          <Field
            label="Start time · HH:MM"
            value={time}
            onChangeText={setTime}
          />
          <Field
            label="Duration · minutes"
            value={duration}
            onChangeText={setDuration}
            numeric
          />
        </>
      )}
      {target.kind === "purchase" && (
        <Field
          label="Price · THB · leave empty if unknown"
          value={amount}
          onChangeText={setAmount}
          numeric
        />
      )}
      {target.kind === "item" && (
        <>
          <Text style={ui.label}>Collection</Text>
          <View style={ui.wrap}>
            {Object.keys(data.collections).map((name) => (
              <Chip
                key={name}
                label={name}
                active={collection === name}
                onPress={() => setCollection(name)}
              />
            ))}
          </View>
          <View style={ui.wrap}>
            <Chip label="Owned" active={owned} onPress={() => setOwned(true)} />
            <Chip
              label="Wishlist"
              active={!owned}
              onPress={() => setOwned(false)}
            />
          </View>
          {collection === "Book" && (
            <>
              <Field label="Author" value={author} onChangeText={setAuthor} />
              <View style={ui.wrap}>
                {["Unread", "Reading", "Finished"].map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    active={status === value}
                    onPress={() => setStatus(value)}
                  />
                ))}
              </View>
            </>
          )}
          {(data.collections[collection] ?? [])
            .filter(
              (field) =>
                field.name !== "Author" && field.name !== "Reading status",
            )
            .map((field) => (
              <CustomField
                key={field.name}
                field={field}
                value={customValues[`${collection}:${field.name}`] ?? ""}
                items={data.items.filter(
                  (value) => value.id !== item?.id && !value.archived,
                )}
                onChange={(value) =>
                  setCustomValues((current) => ({
                    ...current,
                    [`${collection}:${field.name}`]: value,
                  }))
                }
              />
            ))}
          {item && (
            <>
              <Text style={ui.sectionTitle}>Dated history</Text>
              <Button
                label="View spending in Budget →"
                onPress={() => {
                  close()
                  router.push("/budget")
                }}
              />
              {data.purchases
                .filter((value) => value.itemId === item.id)
                .map((value) => (
                  <Card key={value.id}>
                    <Text style={ui.heading}>{value.detail}</Text>
                    <Text style={ui.muted}>
                      {value.date} ·{" "}
                      {value.amount === null
                        ? "Price missing"
                        : `฿${value.amount}`}
                    </Text>
                  </Card>
                ))}
            </>
          )}
        </>
      )}
      {target.kind === "source" && (
        <Text style={ui.muted}>
          Editing or moving this transcript clears its generated story.
          Previously saved cards keep their own dates and details.
        </Text>
      )}
      {error ? (
        <Text accessibilityRole="alert" style={ui.muted}>
          {error}
        </Text>
      ) : null}
      <Button label="Save changes" primary onPress={save} />
      {target.id && (
        <Button
          label={
            target.kind === "item"
              ? "Archive item · keep purchase history"
              : target.kind === "source"
                ? "Delete transcript · keep saved cards"
                : "Delete record"
          }
          onPress={remove}
        />
      )}
    </>
  )
}
export default Editor
