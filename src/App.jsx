// App.jsx
import { useEffect } from "react";
import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { SubmitButton } from "./components/SubmitButton";
import { NodeDetailsPanel } from "./components/NodeDetailsPanel";

function App() {
  useEffect(() => {
    const saved = localStorage.getItem("vs-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="app-container">
      <div className="workspace">
        <PipelineToolbar />
        <PipelineUI />
        <NodeDetailsPanel />
      </div>
      <SubmitButton />
    </div>
  );
}

export default App;