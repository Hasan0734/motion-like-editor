import { Dispatch, SetStateAction } from "react";
import { groupColors, MAX_RECENT, RECENT_COLORS_KEY } from "./constant";
import { Color, GroupColors } from "./type";

export const getRecentColors = (): Color[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(RECENT_COLORS_KEY);
    return stored ? JSON.parse(stored) : [];
};


export const handleAddRecentUsed = (color: Color, setItems: Dispatch<SetStateAction<GroupColors[]>>) => {
    const currentRecent = getRecentColors();

    const filtered = currentRecent.filter(
        (c) => c.value !== color.value || c.type !== color.type,
    );

    const updatedRecent = [color, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updatedRecent));

    setItems(() => {
        const recentItem = { title: "Recently used", colors: updatedRecent };
        return [recentItem, ...groupColors];
    });
};
