import { useEffect, useRef, useState } from "react";

/**
 * Tracks the border-box width of the returned ref's element via ResizeObserver.
 * Used to drive the grid's responsive layout from the *component's* rendered
 * width rather than the window's — so it behaves the same whether the story is
 * resized through the Storybook viewport toolbar or a manual resizable wrapper.
 */
export function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setWidth(entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width);
      }
    });
    observer.observe(el);
    setWidth(el.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  return { ref, width } as const;
}
