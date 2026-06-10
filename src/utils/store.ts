import { createStore } from "jotai";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const editorStore: any = createStore();
export * from "jotai";