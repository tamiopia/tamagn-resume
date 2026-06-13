// toolbar.jsx
import { useState } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { DraggableNode } from "./components/DraggableNode";
import { PanelLeftClose, PanelLeftOpen,
  ArrowRightToLine, ArrowRightFromLine, Sparkles,
  Type, MessageSquare, Plug, GitBranch, Calculator, StickyNote,
  Layers,
} from "lucide-react";

export const PipelineToolbar = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Collapsed rail — shows only when sidebar is closed */}
      {!open && (
        <div className="toolbar-rail">
          <button
            className="toolbar-rail__open"
            onClick={() => setOpen(true)}
            title="Open sidebar"
          >
            <PanelLeftOpen size={18} />
          </button>
        </div>
      )}

      {/* Full sidebar */}
      {open && (
        <aside className="toolbar">
          <div className="toolbar__header">
            <div className="toolbar__logo-wrap">
              <div className="toolbar__logo-mark">
                <Layers size={12} color="#fff" strokeWidth={2.5} />
              </div>
              <div>
                <div className="toolbar__logo">VectorShift</div>
                <div className="toolbar__subtitle">Pipeline Builder</div>
              </div>
            </div>
            <div className="toolbar__header-actions">
              <ThemeToggle />
              <button
                className="toolbar__collapse-btn"
                onClick={() => setOpen(false)}
                title="Close sidebar"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>
          </div>

          <div className="toolbar__scroll">
            {/* ── General ── */}
            <div className="toolbar__section">
              <div className="toolbar__section-title">General</div>
              <div className="toolbar__nodes">
                <DraggableNode type="customInput"  label="Input"  icon={<ArrowRightToLine size={15} />}   color="#3B82F6" description="Pipeline input field" />
                <DraggableNode type="customOutput" label="Output" icon={<ArrowRightFromLine size={15} />} color="#10B981" description="Pipeline output result" />
                <DraggableNode type="text"         label="Text"   icon={<Type size={15} />}               color="#F59E0B" description="Text with variables" />
              </div>
            </div>

            {/* ── AI & Logic ── */}
            <div className="toolbar__section">
              <div className="toolbar__section-title">AI &amp; Logic</div>
              <div className="toolbar__nodes">
                <DraggableNode type="llm"    label="LLM"      icon={<Sparkles size={15} />}     color="#8B5CF6" description="Language model query" />
                <DraggableNode type="prompt" label="Prompt"   icon={<MessageSquare size={15} />} color="#EC4899" description="Structured prompt" />
                <DraggableNode type="api"    label="API Call" icon={<Plug size={15} />}           color="#06B6D4" description="External HTTP request" />
              </div>
            </div>

            {/* ── Utility ── */}
            <div className="toolbar__section">
              <div className="toolbar__section-title">Utility</div>
              <div className="toolbar__nodes">
                <DraggableNode type="conditional" label="Condition" icon={<GitBranch size={15} />}  color="#EF4444" description="If/else routing" />
                <DraggableNode type="math"        label="Math"      icon={<Calculator size={15} />} color="#84CC16" description="Arithmetic operations" />
                <DraggableNode type="note"        label="Note"      icon={<StickyNote size={15} />} color="#F59E0B" description="Canvas annotation" />
              
                
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};