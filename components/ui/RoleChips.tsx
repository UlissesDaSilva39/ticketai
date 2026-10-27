"use client";
export type Role = "Everyone" | "Fans" | "Artists & industry";

export function RoleChips({
  value,
  onChange,
}: {
  value: Role;
  onChange: (r: Role) => void;
}) {
  const roles: Role[] = ["Everyone", "Fans", "Artists & industry"];
  return (
    <div className="flex gap-2 overflow-x-auto">
      {roles.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`whitespace-nowrap rounded-full px-3 py-1 text-sm ${
            value === r ? "bg-purple-600 text-white" : "bg-white/10 text-white/70"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
