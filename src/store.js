// store.js
import { create } from "zustand";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  updateEdge,
  MarkerType,
} from "reactflow";

// Theme persistence — runs on module load
const savedTheme = localStorage.getItem("vs-theme");
const isDarkInitially = savedTheme === "dark";
if (isDarkInitially) {
  document.documentElement.classList.add("dark");
}

export const useStore = create((set, get) => ({
  // ── ReactFlow state ──
  nodes: [],
  edges: [],
  nodeIDs: {},

  // ── Selection & Validation ──
  selectedNodeId: null,
  selectNode: (id) => set({ selectedNodeId: id }),
  clearSelection: () => set({ selectedNodeId: null }),

  invalidNodes: [],
  setInvalidNodes: (nodeIds) => set({ invalidNodes: nodeIds }),

  // ── Node ID generator ──
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  // ── Add node ──
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  // ── Remove node + its connected edges ──
  removeNode: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
    });
  },

  // ── Remove edge ──
  removeEdge: (id) => {
    set({ edges: get().edges.filter((e) => e.id !== id) });
  },

  // ── ReactFlow change handlers ──
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onEdgeUpdate: (oldEdge, newConnection) => {
    set({ edges: updateEdge(oldEdge, newConnection, get().edges) });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: "removable",
          animated: true,
          markerEnd: { type: MarkerType.Arrow, height: "20px", width: "20px" },
        },
        get().edges
      ),
    });
  },

  // ── Update a single field on a node ──
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, [fieldName]: fieldValue } };
        }
        return node;
      }),
    });
  },

  // ── Theme state ──
  isDark: isDarkInitially,

  toggleTheme: () => {
    const nextDark = !get().isDark;
    set({ isDark: nextDark });
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("vs-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("vs-theme", "light");
    }
  },

  setTheme: (dark) => {
    set({ isDark: dark });
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("vs-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("vs-theme", "light");
    }
  },
}));