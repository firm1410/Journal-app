export type Task = {
  id: string
  detail: string
  due: string
  completed: boolean
}
export type Event = {
  id: string
  detail: string
  date: string
  time: string
  duration?: number
}
export type Source = { id: string; text: string; date: string }
export type Item = {
  id: string
  name: string
  collection: string
  owned: boolean
  status: string
  author: string
  archived?: boolean
  fields?: Record<string, string>
}
export type Purchase = {
  id: string
  itemId: string
  detail: string
  date: string
  amount: number | null
  category: string
}
export type Field = { name: string; type: string; options?: string[] }
export const today = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
export const shiftDate = (date: string, days: number) => {
  const value = new Date(`${date}T12:00:00Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}
export const dateLabel = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    weekday: "short",
    timeZone: "Asia/Bangkok",
  })
export const money = (amount: number) =>
  `฿${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
export const initialData = () => {
  const date = today()
  return {
    tasks: [
      { id: "t1", detail: "Call Mum", due: date, completed: false },
      {
        id: "t2",
        detail: "Send May the photos",
        due: shiftDate(date, -1),
        completed: false,
      },
      {
        id: "t3",
        detail: "A little time for reading",
        due: "",
        completed: false,
      },
    ] as Task[],
    events: [
      { id: "e1", detail: "Dentist", date, time: "10:00" },
      {
        id: "e2",
        detail: "Gym session",
        date: shiftDate(date, 1),
        time: "18:00",
      },
    ] as Event[],
    sources: [
      {
        id: "s1",
        text: "Had katsudon for lunch with May. Need to send her the photos.",
        date,
      },
      {
        id: "s2",
        text: "Went to the gym and bought Naruto volume 1. Call Mum today.",
        date,
      },
    ] as Source[],
    items: [
      {
        id: "i1",
        name: "Naruto · Volume 1",
        collection: "Book",
        owned: true,
        status: "Unread",
        author: "Masashi Kishimoto",
      },
      {
        id: "i2",
        name: "Naruto · Volume 2",
        collection: "Book",
        owned: false,
        status: "Unread",
        author: "Masashi Kishimoto",
      },
      {
        id: "i3",
        name: "Katsudon",
        collection: "Food",
        owned: true,
        status: "",
        author: "",
      },
    ] as Item[],
    purchases: [
      {
        id: "p1",
        itemId: "i1",
        detail: "Naruto · Volume 1",
        date,
        amount: null,
        category: "Book",
      },
      {
        id: "p2",
        itemId: "i3",
        detail: "Katsudon with May",
        date,
        amount: 240,
        category: "Food",
      },
      {
        id: "p3",
        itemId: "i3",
        detail: "Katsudon lunch",
        date: shiftDate(date, -2),
        amount: 220,
        category: "Food",
      },
    ] as Purchase[],
    collections: {
      Book: [
        { name: "Author", type: "Text" },
        { name: "Reading status", type: "Single select" },
      ],
      Food: [
        {
          name: "Classification",
          type: "Multi-select",
          options: ["Junk food", "Home cooked", "Eating out"],
        },
      ],
    } as Record<string, Field[]>,
    tagsByDate: { [date]: ["Gym", "Eating out"] } as Record<string, string[]>,
    summaries: {} as Record<string, string>,
  }
}
export type DemoData = ReturnType<typeof initialData>

export const validDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(`${value}T12:00:00Z`)) &&
  new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value
