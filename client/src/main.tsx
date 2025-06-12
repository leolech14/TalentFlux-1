import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { FluxProvider } from "./core/FluxProvider";

createRoot(document.getElementById("root")!).render(
  <FluxProvider>
    <App />
  </FluxProvider>
);
