"use client";

export default function ConfirmButton({ children, message = "Are you sure?", className = "btn btn-danger" }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
