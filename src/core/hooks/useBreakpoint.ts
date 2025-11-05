import * as React from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";
const MOBILE_MAX = 639;                
const TABLET_MIN = 640, TABLET_MAX = 1024;
const DESKTOP_MIN = 1025;             

function currentBp(): Breakpoint {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w <= MOBILE_MAX) return "mobile";
    if (w >= TABLET_MIN && w <= TABLET_MAX) return "tablet";
    return "desktop";
}

export function useBreakpoint() {
    const [bp, setBp] = React.useState<Breakpoint>(() => currentBp());
    React.useEffect(() => {
        const m1 = window.matchMedia(`(max-width:${MOBILE_MAX}px)`);
        const m2 = window.matchMedia(`(min-width:${TABLET_MIN}px) and (max-width:${TABLET_MAX}px)`);
        const m3 = window.matchMedia(`(min-width:${DESKTOP_MIN}px)`);
        const update = () => setBp(currentBp());

        const add = (mql: MediaQueryList, cb: (e: MediaQueryListEvent) => void) =>
            mql.addEventListener ? mql.addEventListener("change", cb) : mql.addListener(cb);
        const rmv = (mql: MediaQueryList, cb: (e: MediaQueryListEvent) => void) =>
            mql.removeEventListener ? mql.removeEventListener("change", cb) : mql.removeListener(cb);

        add(m1, update); add(m2, update); add(m3, update);
        update();
        return () => { rmv(m1, update); rmv(m2, update); rmv(m3, update); };
    }, []);
    return bp;
}

export function useIsCompact() {
    const bp = useBreakpoint();
    return bp !== "desktop";
}
