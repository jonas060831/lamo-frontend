import { useEffect, useState } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    if (savedTheme) return savedTheme;

    // fallback to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    // remember user preference
    localStorage.setItem("theme", theme);
  }, [theme]);
  

  const toggleTheme = () =>
    setTheme(prev => (prev === "light" ? "dark" : "light"));

  return { theme, toggleTheme };
}