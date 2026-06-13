// ErrorToast.jsx
import { useEffect } from "react";
import { XCircle, X } from "lucide-react";

export const ErrorToast = ({ message, onDismiss }) => {
  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="error-toast" role="alert">
      <div className="error-toast__icon">
        <XCircle size={18} color="#EF4444" />
      </div>
      <div className="error-toast__content">
        <div className="error-toast__message">{message}</div>
      </div>
      <button
        className="error-toast__close"
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        <X size={14} />
      </button>
    </div>
  );
};