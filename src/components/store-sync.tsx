// "use client";

// import * as React from "react";
// import { useStore } from "@/lib/store";
// import type { Entry, Service } from "@/lib/types";

// export function StoreSync({
//   entries,
//   services,
// }: {
//   entries: Entry[];
//   services: Service[];
// }) {
//   const hydrate = useStore((s) => s.hydrate);

//   React.useEffect(() => {
//     hydrate(entries, services);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [entries, services]);

//   return null;
// }
