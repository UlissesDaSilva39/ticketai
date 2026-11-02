import NavRoot from "@/components/nav/NavRoot";

export default function NavPreview() {
  return (
    <NavRoot>
      <div style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ margin: 0 }}>Nav preview</h1>
        <p style={{ color: "#9aa4b2" }}>
          Resize the window: sidebar (desktop) becomes bottom nav (mobile) at 1023px.
        </p>
        <p style={{ color: "#9aa4b2" }}>
          Delete <code>app/nav-preview/</code> when you no longer need this page.
        </p>
      </div>
    </NavRoot>
  );
}

