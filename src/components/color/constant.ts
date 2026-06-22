import { Color, GroupColors } from "./type";

export const RECENT_COLORS_KEY = "recentlyUsedColors";
export const MAX_RECENT = 3;

export const colors: Color[] = [
  {
    name: "Default",
    value: "default",
    type: "",
  },
  {
    name: "Gray",
    value: "gray",
    type: "",
  },
  {
    name: "Brown",
    value: "brown",
    type: "",
  },
  {
    name: "Orange",
    value: "orange",
    type: "",
  },
  {
    name: "Yellow",
    value: "yellow",
    type: "",
  },
  {
    name: "Green",
    value: "green",
    type: "",
  },
  {
    name: "Blue",
    value: "blue",
    type: "",
  },
  {
    name: "Purple",
    value: "purple",
    type: "",
  },
  {
    name: "Pink",
    value: "pink",
    type: "",
  },
  {
    name: "Red",
    value: "red",
    type: "",
  },
];

export const groupColors: GroupColors[] = [
  {
    title: "Text color",
    colors: colors.map((color) => ({ ...color, type: "text" })),
  },
  {
    title: "Background color",
    colors: colors.map((color) => ({ ...color, type: "background" })),
  },
];
