import {useState, useEffect} from "react";

export function useMediaQuery(query) {
  const getMatch = () =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false;
  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (event) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);

    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
