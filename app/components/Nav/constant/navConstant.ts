import HomeIcon from "@/app/icon/home"
import JournalIcon from "@/app/icon/journal"
import TodoIcon from "@/app/icon/todo"
import TrackerIcon from "@/app/icon/tracker"
import { NavItemInterface } from "../models/NavInterface"

export const nav: NavItemInterface[] = [
  {
    name: "Home",
    route: "/",
    Icon: HomeIcon({ size: 24 }),
  },
  {
    name: "Journal",
    route: "/journal",
    Icon: JournalIcon({ size: 24 }),
  },
  {
    name: "To do",
    route: "/todo",
    Icon: TodoIcon({ size: 24 }),
  },
  {
    name: "Tracker",
    route: "/tracker",
    Icon: TrackerIcon({ size: 24 }),
  },
]
