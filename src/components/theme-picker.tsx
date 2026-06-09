"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Palette, X } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  {
    id: "usa",
    name: "USA Stars",
    colors: ["#071a3d", "#ffffff", "#e63946"],
  },
  {
    id: "canada",
    name: "Canada Maple",
    colors: ["#25090d", "#f8fafc", "#ef233c"],
  },
  {
    id: "mexico",
    name: "Mexico Verde",
    colors: ["#062c24", "#f4f1de", "#ce2b37"],
  },
  {
    id: "germany",
    name: "Germany Adler",
    colors: ["#111111", "#dd0000", "#ffcc00"],
  },
  {
    id: "spain",
    name: "Spain Roja",
    colors: ["#3a0b12", "#aa151b", "#f1bf00"],
  },
  {
    id: "france",
    name: "France Tricolore",
    colors: ["#071b3b", "#ffffff", "#ed2939"],
  },
  {
    id: "netherlands",
    name: "Netherlands Oranje",
    colors: ["#1b213b", "#f36c21", "#ffffff"],
  },
  {
    id: "croatia",
    name: "Croatia Checkers",
    colors: ["#101f46", "#ff0000", "#ffffff"],
  },
  {
    id: "argentina",
    name: "Argentina Celeste",
    colors: ["#082f49", "#74acdf", "#f6b40e"],
  },
  {
    id: "brazil",
    name: "Brasil Canarinho",
    colors: ["#043927", "#ffdf00", "#009c3b"],
  },
  {
    id: "japan",
    name: "Japan Hinomaru",
    colors: ["#21131a", "#bc002d", "#ffffff"],
  },
  {
    id: "senegal",
    name: "Senegal Teranga",
    colors: ["#063b2b", "#00853f", "#fdef42"],
  },
  {
    id: "macedonia",
    name: "Macedonia Sun",
    colors: ["#4a090d", "#d20000", "#ffe600"],
  },
] as const;

type ThemeId = (typeof themes)[number]["id"];

function applyTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("worldie-theme", theme);
}

export function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>("usa");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("worldie-theme");
    const initial = themes.some((item) => item.id === stored)
      ? (stored as ThemeId)
      : "usa";
    applyTheme(initial);
    const frame = requestAnimationFrame(() => setTheme(initial));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [open]);

  const selectTheme = (nextTheme: ThemeId) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <div ref={panelRef} className="fixed bottom-5 right-5 z-100 flex flex-col items-end">
      {open ? (
        <div className="theme-menu mb-3 max-h-[min(42rem,calc(100vh-6rem))] w-64 overflow-y-auto rounded-2xl border border-black/10 bg-white p-3 text-slate-950 shadow-2xl">
          <div className="flex items-center justify-between px-2 pb-2">
            <div>
              <p className="text-sm font-black">Themes</p>
              <p className="text-[11px] text-slate-500">Choose your matchday look</p>
            </div>
            <button
              type="button"
              aria-label="Close theme menu"
              onClick={() => setOpen(false)}
              className="grid size-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="grid gap-1">
            {themes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectTheme(item.id)}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3 text-left text-sm font-bold transition",
                  theme === item.id
                    ? "bg-slate-950 text-white"
                    : "hover:bg-slate-100",
                )}
              >
                <span className="flex -space-x-1">
                  {item.colors.map((color) => (
                    <span
                      key={color}
                      className="size-4 rounded-full border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                <span className="flex-1">{item.name}</span>
                {theme === item.id ? <Check className="size-4" /> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <button
        type="button"
        aria-label="Choose theme"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="theme-trigger grid size-12 place-items-center rounded-full bg-slate-950 text-white shadow-xl transition hover:scale-105"
      >
        <Palette className="size-5" />
      </button>
    </div>
  );
}
