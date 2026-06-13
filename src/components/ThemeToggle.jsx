// ThemeToggle.jsx
import { Sun, Moon } from "lucide-react";
import { useStore } from "../store";

export const ThemeToggle = () => {
  const isDark = useStore((state) => state.isDark);
  const toggleTheme = useStore((state) => state.toggleTheme);

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};