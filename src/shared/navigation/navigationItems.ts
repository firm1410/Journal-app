import HomeIcon from "@/src/shared/components/icons/HomeIcon"
import JournalIcon from "@/src/shared/components/icons/JournalIcon"
import TodoIcon from "@/src/shared/components/icons/TodoIcon"
import TrackerIcon from "@/src/shared/components/icons/TrackerIcon"

import type NavigationItemModel from "./models/NavigationItemModel"

const navigationItems: NavigationItemModel[] = [
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

export default navigationItems
