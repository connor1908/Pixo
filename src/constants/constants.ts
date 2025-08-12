import { IoHomeOutline } from "react-icons/io5";
import { IoCompassOutline } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";

export const sidebarLinks = [
  {
    icon: IoHomeOutline,
    route: "/",
    label: "Home",
  },
  {
    icon: IoCompassOutline,
    route: "/explore",
    label: "Explore",
  },
  {
    icon: IoPeopleOutline,
    route: "/all-users",
    label: "People",
  },
  {
    icon: IoBookmarkOutline,
    route: "/saved",
    label: "Saved",
  },
  {
    icon: LuImagePlus,
    route: "/create-post",
    label: "Create Post",
  },
];

export const bottombarLinks = [
  {
    icon: IoHomeOutline,
    route: "/",
    label: "Home",
  },
  {
    icon: IoCompassOutline,
    route: "/explore",
    label: "Explore",
  },
  {
    icon: IoBookmarkOutline,
    route: "/saved",
    label: "Saved",
  },
  {
    icon: LuImagePlus,
    route: "/create-post",
    label: "Create Post",
  },
];
