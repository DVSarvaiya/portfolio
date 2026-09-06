// Re-export shim for legacy imports. The canonical implementation lives in
// src/app/components/TechCube.js so it can sit alongside the other section
// components. This file forwards the same default export so any existing
// `import TechCube from "@/app/TechCube"` keeps working unchanged.

import TechCube from "./components/TechCube";

export default TechCube;
