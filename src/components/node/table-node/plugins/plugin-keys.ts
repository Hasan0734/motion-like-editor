import { PluginKey } from "@tiptap/pm/state";

export interface TableControlState {
  visible: boolean;
}

export const addRowPluginKey =
  new PluginKey<TableControlState>("add-row-plugin");

export const addColumnPluginKey =
  new PluginKey<TableControlState>("add-column-plugin");