import HomeIcon from "@/app/icon/home"
import JournalIcon from "@/app/icon/journal"
import TodoIcon from "@/app/icon/todo"
import TrackerIcon from "@/app/icon/tracker"
import { NavItemInterface } from "../models/NavInterface"

export const nav: NavItemInterface[] = [
  {
    name: "Home",
    route: "/",
    Icon: HomeIcon,
  },
  {
    name: "Journal",
    route: "/journal",
    Icon: JournalIcon,
  },
  {
    name: "To do",
    route: "/todo",
    Icon: TodoIcon,
  },
  {
    name: "Tracker",
    route: "/tracker",
    Icon: TrackerIcon,
  },
]
