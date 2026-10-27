import { useState } from "react"
import { Pressable, Text, View } from "react-native"
import { router } from "expo-router"
import { useDemo } from "./useDemo"
import {
  dateLabel,
  money,
  shiftDate,
  today,
  type Task,
  validDate,
} from "./model"
import { Button, Card, Chip, Empty, Field, Page, Section, ui } from "./ui"

const TaskRow = ({ task }: { task: Task }) => {
  const { setData, edit } = useDemo()
  return (
    <Card>
      <View style={ui.row}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel={`Complete ${task.detail}`}
          accessibilityState={{ checked: task.completed }}
          onPress={() =>
            setData((current) => ({
              ...current,
              tasks: current.tasks.map((value) =>
                value.id === task.id
                  ? { ...value, completed: !value.completed }
                  : value,
              ),
            }))
          }
          style={{ minHeight: 48, minWidth: 44, justifyContent: "center" }}
        >
          <Text style={{ ...ui.heading, fontSize: 26 }}>
            {task.completed ? "☑" : "○"}
          </Text>
        </Pressable>
        <View style={{ flex: 1, gap: 4 }}>
          <Text
            style={[
              ui.heading,
              task.completed && {
                textDecorationLine: "line-through",
                opacity: 0.5,
              },
            ]}
          >
            {task.detail}
          </Text>
          <Text style={ui.muted}>
            {task.due
              ? `${task.due < today() && !task.completed ? "Overdue · " : ""}${dateLabel(task.due)}`
              : "Whenever you have a moment"}
          </Text>
        </View>
        <Button
          label="Edit"
          onPress={() => edit({ kind: "task", id: task.id })}
        />
      </View>
    </Card>
  )
}
const Notice = () => {
  const { notice } = useDemo()
  return notice ? (
    <Text accessibilityRole="alert" style={ui.muted}>
      {notice}
    </Text>
  ) : null
}
export const HomeScreen = () => {
  const { data, edit } = useDemo()
  const date = today()
  const tasks = data.tasks.filter(
    (task) => !task.completed && task.due && task.due <= date,
  )
  const missing = data.purchases.filter((purchase) => purchase.amount === null)
  const spending = data.purchases
    .filter((purchase) => purchase.date === date)
    .reduce((total, purchase) => total + (purchase.amount ?? 0), 0)
  return (
    <Page
      eyebrow={dateLabel(date)}
      title="A little more present."
      action={<Text style={{ fontSize: 32 }}>☀</Text>}
    >
      <Text style={ui.muted}>A clear head. A day that feels like yours.</Text>
      <Notice />
      <Card inset>
        <Text style={ui.eyebrow}>Today, at a glance</Text>
        <View style={ui.row}>
          <View>
            <Text style={ui.amount}>
              {data.sources
                .filter((source) => source.date === date)
                .length.toString()
                .padStart(2, "0")}
            </Text>
            <Text style={ui.muted}>little moments kept</Text>
          </View>
          <View>
            <Text style={ui.amount}>{money(spending)}</Text>
            <Text style={ui.muted}>known spending</Text>
          </View>
        </View>
      </Card>
      <Section
        title="Make room for today"
        meta={`${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
      />
      {data.events
        .filter((event) => event.date === date)
        .map((event) => (
          <Card
            key={event.id}
            onPress={() => edit({ kind: "event", id: event.id })}
          >
            <Text style={ui.eyebrow}>{event.time} · Calendar</Text>
            <Text style={ui.heading}>{event.detail}</Text>
            <Text style={ui.muted}>A little time set aside →</Text>
          </Card>
        ))}
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
      {!tasks.length && (
        <Empty text="Nothing pressing. Leave a little space for yourself." />
      )}
      <Section title="A few loose ends" meta={`${missing.length} to finish`} />
      {missing.map((purchase) => (
        <Card
          key={purchase.id}
          onPress={() => edit({ kind: "purchase", id: purchase.id })}
        >
          <View style={ui.row}>
            <Text style={ui.heading}>{purchase.detail}</Text>
            <Text style={ui.heading}>↗</Text>
          </View>
          <Text style={ui.muted}>
            Add a price when you know it · {dateLabel(purchase.date)}
          </Text>
        </Card>
      ))}
      {!missing.length && <Empty text="All details are caught up." />}
      <Section title="Your day, in words" />
      <Card>
        <Text style={ui.heading}>Small moments make a story.</Text>
        <Text style={ui.muted}>
          Your daily summary is planned for 21:00 Bangkok time. Try a sample
          summary in Journal.
        </Text>
        <Button
          label="Open your journal →"
          onPress={() => router.push("/journal")}
        />
      </Card>
      <Text style={ui.muted}>
        Interactive demo · changes stay in memory until the app reloads.
      </Text>
    </Page>
  )
}
export const PlanScreen = () => {
  const { data, edit } = useDemo()
  const [date, setDate] = useState(today())
  const [mode, setMode] = useState("Calendar")
  const [completed, setCompleted] = useState(false)
  const events = data.events
    .filter((event) => event.date === date)
    .sort((a, b) => a.time.localeCompare(b.time))
  const tasks = data.tasks.filter(
    (task) => task.completed === completed && (!task.due || task.due <= date),
  )
  return (
    <Page
      eyebrow="A little intention"
      title="Your plan"
      action={
        <Button
          label="+ New"
          onPress={() =>
            edit({ kind: mode === "Calendar" ? "event" : "task", date })
          }
        />
      }
    >
      <View style={ui.wrap}>
        {["Calendar", "To-do"].map((value) => (
          <Chip
            key={value}
            label={value}
            active={mode === value}
            onPress={() => setMode(value)}
          />
        ))}
      </View>
      <Card inset>
        <View style={ui.row}>
          <Button label="‹" onPress={() => setDate(shiftDate(date, -1))} />
          <Text style={ui.heading}>{dateLabel(date)}</Text>
          <Button label="›" onPress={() => setDate(shiftDate(date, 1))} />
        </View>
        <Button label="Back to today" onPress={() => setDate(today())} />
      </Card>
      <Notice />
      {mode === "Calendar" ? (
        <>
          <Section
            title="Time set aside"
            meta={`${events.length} ${events.length === 1 ? "event" : "events"}`}
          />
          {events.map((event) => (
            <Card
              key={event.id}
              onPress={() => edit({ kind: "event", id: event.id })}
            >
              <Text style={ui.eyebrow}>
                {event.time} · {event.duration ?? 60} min
              </Text>
              <Text style={ui.heading}>{event.detail}</Text>
              <Text style={ui.muted}>Open to edit →</Text>
            </Card>
          ))}
          {!events.length && (
            <Empty text="A little breathing room. No appointments on this day." />
          )}
          <Section title="Tasks for the day" />
          {tasks
            .filter((task) => !task.completed)
            .map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
        </>
      ) : (
        <>
          <View style={ui.wrap}>
            <Chip
              label="To do"
              active={!completed}
              onPress={() => setCompleted(false)}
            />
            <Chip
              label="Completed"
              active={completed}
              onPress={() => setCompleted(true)}
            />
          </View>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
          {!tasks.length && (
            <Empty
              text={
                completed
                  ? "Finished tasks will find a home here."
                  : "Nothing waiting. Enjoy the space."
              }
            />
          )}
        </>
      )}
    </Page>
  )
}
export const JournalPage = () => {
  const { data, setData, edit } = useDemo()
  const [date, setDate] = useState(today())
  const sources = data.sources.filter((source) => source.date === date)
  return (
    <Page eyebrow="The moments between" title="Your journal">
      <Card inset>
        <View style={ui.row}>
          <Button label="‹" onPress={() => setDate(shiftDate(date, -1))} />
          <Text style={ui.heading}>{dateLabel(date)}</Text>
          <Button
            label="›"
            disabled={date >= today()}
            onPress={() => setDate(shiftDate(date, 1))}
          />
        </View>
      </Card>
      <Notice />
      <Section title="Today's story" meta="Sample summary" />
      <Card>
        <Text style={ui.eyebrow}>
          {data.summaries[date] ? "A day worth keeping" : "Still taking shape"}
        </Text>
        <Text style={ui.body}>
          {data.summaries[date] ??
            "Every small moment belongs here. Keep a few words, then bring them together into your daily story."}
        </Text>
        <Text style={ui.muted}>
          Demo summary uses your saved words. AI generation and the 21:00
          schedule are not connected.
        </Text>
      </Card>
      <View style={ui.wrap}>
        {(data.tagsByDate[date] ?? []).map((tag) => (
          <Chip key={tag} label={tag} />
        ))}
        <Chip
          label="Edit tags +"
          onPress={() => edit({ kind: "tags", date })}
        />
      </View>
      <Section title="In your own words" meta={`${sources.length} records`} />
      {sources.map((source, index) => (
        <Card
          key={source.id}
          onPress={() => edit({ kind: "source", id: source.id })}
        >
          <Text style={ui.eyebrow}>
            Moment {String(index + 1).padStart(2, "0")} · Transcript
          </Text>
          <Text style={ui.body}>“{source.text}”</Text>
          <Text style={ui.muted}>Review or edit →</Text>
        </Card>
      ))}
      {!sources.length && (
        <Empty text="No words kept for this day yet. Tap the microphone to try a sample capture." />
      )}
      <Button
        label={
          data.summaries[date]
            ? "Refresh sample summary"
            : "Bring the day together"
        }
        primary
        disabled={!sources.length}
        onPress={() =>
          setData((current) => ({
            ...current,
            summaries: {
              ...current.summaries,
              [date]: sources.map((source) => source.text).join(" "),
            },
          }))
        }
      />
    </Page>
  )
}
export const LibraryScreen = () => {
  const { data, edit } = useDemo()
  const [collection, setCollection] = useState("All")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [history, setHistory] = useState(false)
  const [period, setPeriod] = useState("Any time")
  const [fromDate, setFromDate] = useState(shiftDate(today(), -7))
  const [throughDate, setThroughDate] = useState(today())
  const validRange =
    validDate(fromDate) && validDate(throughDate) && fromDate <= throughDate
  const items = data.items.filter(
    (item) =>
      !item.archived &&
      (collection === "All" ||
        (collection === "Wishlist"
          ? !item.owned
          : item.collection === collection)) &&
      (status === "All" || item.status === status) &&
      `${item.name} ${item.author} ${Object.values(item.fields ?? {}).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  const records = data.purchases.filter(
    (purchase) =>
      (period !== "Date range" ||
        (validRange &&
          purchase.date >= fromDate &&
          purchase.date <= throughDate)) &&
      `${purchase.detail} ${purchase.category} ${Object.values(data.items.find((item) => item.id === purchase.itemId)?.fields ?? {}).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (collection === "All" || purchase.category === collection) &&
      (period !== "This week" ||
        purchase.date >=
          shiftDate(
            today(),
            -((new Date(`${today()}T12:00:00Z`).getUTCDay() + 6) % 7),
          )),
  )
  return (
    <Page
      eyebrow="A home for your things"
      title="Your library"
      action={
        <Button
          label="+ Item"
          onPress={() =>
            edit({
              kind: "item",
              collection: collection in data.collections ? collection : "Book",
            })
          }
        />
      }
    >
      <Field
        label="Search your things and history"
        value={query}
        onChangeText={setQuery}
      />
      <View style={ui.wrap}>
        <Chip
          label="Items"
          active={!history}
          onPress={() => setHistory(false)}
        />
        <Chip
          label="History"
          active={history}
          onPress={() => setHistory(true)}
        />
        <Chip label="Budget ↗" onPress={() => router.push("/budget")} />
      </View>
      <View style={ui.wrap}>
        {["All", ...Object.keys(data.collections), "Wishlist"].map((value) => (
          <Chip
            key={value}
            label={value}
            active={collection === value}
            onPress={() => {
              setCollection(value)
              setStatus("All")
            }}
          />
        ))}
      </View>
      {collection === "Book" && !history && (
        <View style={ui.wrap}>
          {["All", "Unread", "Reading", "Finished"].map((value) => (
            <Chip
              key={value}
              label={value}
              active={status === value}
              onPress={() => setStatus(value)}
            />
          ))}
        </View>
      )}
      {history && (
        <View style={ui.wrap}>
          {["Any time", "This week", "Date range"].map((value) => (
            <Chip
              key={value}
              label={value}
              active={period === value}
              onPress={() => setPeriod(value)}
            />
          ))}
        </View>
      )}
      {history && period === "Date range" && (
        <Card inset>
          <Field
            label="From · YYYY-MM-DD"
            value={fromDate}
            onChangeText={setFromDate}
          />
          <Field
            label="Through · YYYY-MM-DD"
            value={throughDate}
            onChangeText={setThroughDate}
          />
          {!validRange && (
            <Text accessibilityRole="alert" style={ui.muted}>
              Choose a valid date range with the start before the end.
            </Text>
          )}
        </Card>
      )}
      <Notice />
      <Section
        title={
          history
            ? "Dated moments"
            : collection === "All"
              ? "Things with a story"
              : collection
        }
        meta={`${history ? records.length : items.length} ${history ? "records" : "items"}`}
      />
      {history
        ? records.map((purchase) => (
            <Card
              key={purchase.id}
              onPress={() => edit({ kind: "purchase", id: purchase.id })}
            >
              <Text style={ui.eyebrow}>
                {dateLabel(purchase.date)} · {purchase.category}
              </Text>
              <Text style={ui.heading}>{purchase.detail}</Text>
              <Text style={ui.muted}>
                {purchase.amount === null
                  ? "Price missing"
                  : money(purchase.amount)}{" "}
                · Purchase
              </Text>
            </Card>
          ))
        : items.map((item) => (
            <Card
              key={item.id}
              onPress={() => edit({ kind: "item", id: item.id })}
            >
              <View style={ui.row}>
                <Text style={ui.eyebrow}>{item.collection}</Text>
                <Text style={ui.muted}>↗</Text>
              </View>
              <Text style={ui.heading}>{item.name}</Text>
              {Boolean(item.author) && (
                <Text style={ui.muted}>{item.author}</Text>
              )}
              <View style={ui.wrap}>
                <Chip label={item.owned ? "Owned" : "Wishlist"} active />
                {Boolean(item.status) && <Chip label={item.status} />}
              </View>
            </Card>
          ))}
      {!(history ? records.length : items.length) && (
        <Empty text="Nothing here yet. Try a different filter, or keep something new." />
      )}
      <Section title="Make the space yours" />
      {collection in data.collections && (
        <Button
          label={`Configure ${collection} fields`}
          onPress={() => edit({ kind: "collection", collection })}
        />
      )}
      <Button
        label="+ Create a collection"
        onPress={() => edit({ kind: "collection" })}
      />
    </Page>
  )
}
export const BudgetScreen = () => {
  const { data, edit } = useDemo()
  const [period, setPeriod] = useState("Week")
  const [category, setCategory] = useState("All")
  const [missingOnly, setMissingOnly] = useState(false)
  const date = today()
  const start =
    period === "Day"
      ? date
      : period === "Month"
        ? `${date.slice(0, 7)}-01`
        : shiftDate(
            date,
            -((new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7),
          )
  const records = data.purchases.filter(
    (purchase) => purchase.date >= start && purchase.date <= date,
  )
  const total = records.reduce(
    (sum, purchase) => sum + (purchase.amount ?? 0),
    0,
  )
  const visible = records.filter(
    (purchase) =>
      (category === "All" || category === purchase.category) &&
      (!missingOnly || purchase.amount === null),
  )
  const missing = records.filter((purchase) => purchase.amount === null).length
  return (
    <Page
      eyebrow="Library / Budget"
      title="A mindful spend"
      action={<Button label="Back" onPress={() => router.back()} />}
    >
      <View style={ui.wrap}>
        {["Day", "Week", "Month"].map((value) => (
          <Chip
            key={value}
            label={value}
            active={period === value}
            onPress={() => setPeriod(value)}
          />
        ))}
      </View>
      <Card inset>
        <Text style={ui.eyebrow}>
          {dateLabel(start)} — {dateLabel(date)}
        </Text>
        <Text style={ui.amount}>{money(total)}</Text>
        <Text style={ui.muted}>Known spending · THB</Text>
        <Text style={ui.muted}>
          {missing} missing {missing === 1 ? "price" : "prices"} · excluded from
          the total
        </Text>
      </Card>
      <Section title="Where it went" />
      <View style={ui.wrap}>
        {["All", ...new Set(records.map((purchase) => purchase.category))].map(
          (value) => (
            <Chip
              key={value}
              label={value}
              active={category === value}
              onPress={() => setCategory(value)}
            />
          ),
        )}
        <Chip
          label="Missing prices"
          active={missingOnly}
          onPress={() => setMissingOnly(!missingOnly)}
        />
      </View>
      {[...new Set(records.map((purchase) => purchase.category))].map(
        (name) => (
          <Card key={name} onPress={() => setCategory(name)}>
            <View style={ui.row}>
              <Text style={ui.heading}>{name}</Text>
              <Text style={ui.heading}>
                {money(
                  records
                    .filter((purchase) => purchase.category === name)
                    .reduce((sum, purchase) => sum + (purchase.amount ?? 0), 0),
                )}
              </Text>
            </View>
          </Card>
        ),
      )}
      <Section
        title="Every little purchase"
        meta={`${visible.length} records`}
      />
      {visible.map((purchase) => (
        <Card
          key={purchase.id}
          onPress={() => edit({ kind: "purchase", id: purchase.id })}
        >
          <Text style={ui.heading}>{purchase.detail}</Text>
          <Text style={ui.muted}>
            {dateLabel(purchase.date)} ·{" "}
            {purchase.amount === null
              ? "Add missing price →"
              : money(purchase.amount)}
          </Text>
        </Card>
      ))}
      {!visible.length && <Empty text="No purchases match these filters." />}
      <Text style={ui.muted}>
        Weeks start on Monday. Wishlist items never enter spending totals.
      </Text>
    </Page>
  )
}
