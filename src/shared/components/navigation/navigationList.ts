import HomeIcon from "@/src/shared/components/icons/HomeIcon"
import JournalIcon from "@/src/shared/components/icons/JournalIcon"
import TodoIcon from "@/src/shared/components/icons/TodoIcon"
import TrackerIcon from "@/src/shared/components/icons/TrackerIcon"

import type NavigationItemModel from "./components/NavigationItem/models/NavigationItemModel"

const navigationList: NavigationItemModel[] = [
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
    name: "Plan",
    route: "/plan",
    Icon: TodoIcon,
  },
  {
    name: "Library",
    route: "/library",
    Icon: TrackerIcon,
  },
]

export default navigationList
