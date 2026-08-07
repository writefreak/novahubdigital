"use client";

export type AccessRole = "add_only" | "full";

export function RoleSwitch({
  value,
  onChange,
  disabled,
  size = "md",
}: {
  value: AccessRole;
  onChange: (role: AccessRole) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const options: AccessRole[] = ["add_only", "full"];
  return (
    <div
      role="radiogroup"
      aria-label="Access level"
      className={`relative grid w-full min-w-0 grid-cols-2 rounded-full bg-muted p-1 ${
        size === "sm" ? "text-xs" : "text-sm"
      }`}
    >
      <div
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-accent transition-transform duration-300 ease-out"
        style={{
          transform: value === "full" ? "translateX(100%)" : "translateX(0)",
        }}
      />
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={value === opt}
          disabled={disabled}
          onClick={() => onChange(opt)}
          className={`relative z-10 min-w-0 truncate rounded-full px-2 py-1.5 text-center font-medium transition-colors disabled:opacity-50 ${
            value === opt ? "text-accent-foreground" : "text-muted-foreground"
          }`}
        >
          {opt === "add_only" ? "Add only" : "Full access"}
        </button>
      ))}
    </div>
  );
}
