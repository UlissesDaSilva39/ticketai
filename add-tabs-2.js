const fs = require("fs");
const p = "app/event/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// Find the content grid div where sections live
const gridAnchor = '<div className="lg:col-span-2">';

if (!t.includes("<EventTabs")) {
  // Insert the tab bar just before the content grid
  const tabsBlock = `        </div>
      </div>

      <EventTabs
        activeTab={activeTab}
        tabs={[
          { id: "about", label: "About" },
          { id: "lineup", label: "Lineup" },
          { id: "reviews", label: "Reviews" },
          { id: "good-to-know", label: "Good to Know" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
`;

  // Find the second occurrence of the grid opening (the actual content block)
  const matches = [...t.matchAll(/<div className="max-w-7xl mx-auto px-4 py-12">\s*<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">\s*<div className="lg:col-span-2">/g)];

  if (matches.length > 0) {
    const last = matches[matches.length - 1];
    const start = last.index;
    const end = start + last[0].length;

    // Replace the matched block with itself + EventTabs inserted BEFORE
    // Wait — we need EventTabs AFTER the hero, not before. Insert it inside the grid div, before the sections.
    // Better: insert EventTabs right after "<div className=\"lg:col-span-2\">"
    const insertPoint = end;
    const tabsInsert = `\n\n            <EventTabs
              activeTab={activeTab}
              tabs={[
                { id: "about", label: "About" },
                { id: "lineup", label: "Lineup" },
                { id: "reviews", label: "Reviews" },
                { id: "good-to-know", label: "Good to Know" },
              ]}
            />`;

    t = t.slice(0, insertPoint) + tabsInsert + t.slice(insertPoint);
    console.log("EventTabs component inserted.");
  } else {
    console.log("Grid anchor not found.");
  }
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
}