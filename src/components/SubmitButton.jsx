// SubmitButton.jsx
import { useState } from "react";
import { Rocket } from "lucide-react";
import { useStore } from "../store";
import { shallow } from "zustand/shallow";
import { PipelineModal } from "./PipelineModal";
import { ErrorToast } from "./ErrorToast";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  setInvalidNodes: state.setInvalidNodes,
});

export const SubmitButton = () => {
  const { nodes, edges, setInvalidNodes } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setInvalidNodes([]); // Clear previous highlights

    try {
      const response = await fetch("http://localhost:8000/api/v1/pipelines/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      if (data.cycle_nodes) {
        setInvalidNodes(data.cycle_nodes);
      }
    } catch (err) {
      setError(
        err.message || "Failed to connect to backend. Make sure it is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setResult(null);
    setInvalidNodes([]);
  };
  const handleToastDismiss = () => setError(null);

  return (
    <>
      <div className="submit-bar">
        <span className="submit-bar__hint">
          Build your pipeline and click submit to validate.
        </span>
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          <Rocket size={16} />
          {loading ? "Validating..." : "Submit Pipeline"}
        </button>
      </div>

      {result && <PipelineModal result={result} onClose={handleModalClose} />}
      {error && <ErrorToast message={error} onDismiss={handleToastDismiss} />}
    </>
  );
};