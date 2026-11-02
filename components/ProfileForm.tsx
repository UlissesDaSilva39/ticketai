"use client";
import { useState } from "react";

export default function ProfileForm({
  initial = { username: "", city: "" },
  onSubmit,
}: {
  initial?: { username: string; city: string };
  onSubmit?: (data: { username: string; city: string }) => void;
}) {
  const [form, setForm] = useState(initial);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit?.(form);
      }}
      style={{ display: "flex", flexDirection: "column", gap: "12px" }}
    >
      <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "13px", fontWeight: 600 }}>Username</span>
        <input
          required
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
          placeholder="djpoxy"
        />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "13px", fontWeight: 600 }}>City</span>
        <input
          required
          value={form.city}
          onChange={e => setForm({ ...form, city: e.target.value })}
          style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
          placeholder="London"
        />
      </label>

      <button type="submit" style={{ padding: "12px", borderRadius: "8px", border: 0, background: "#111", color: "#fff", fontWeight: 600 }}>
        Save
      </button>
    </form>
  );
}
