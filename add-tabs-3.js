const fs = require("fs");
const p = "app/event/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

if (t.includes("<EventTabs")) {
  console.log("EventTabs already present.");
  process.exit(0);
}

const anchor = '<div className="max-w-7xl mx-auto px-4 py-12">\n        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">\n          <div className="lg:col-span-2">';

if (t.includes(anchor)) {
  const tabsBlock = `<EventTabs
        activeTab={activeTab}
        tabs={[
          { id: "about", label: "About" },
          { id: "lineup", label: "Lineup" },
          { id: "reviews", label: "Reviews" },
          { id: "good-to-know", label: "Good to Know" },
        ]}
      />
      ` + anchor;
  t = t.replace(anchor, tabsBlock);
  console.log("EventTabs inserted above grid.");
} else {
  console.log("Grid anchor miss — checking with looser match.");
  const regex = /<div className="max-w-7xl mx-auto px-4 py-12">\s*<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">\s*<div className="lg:col-span-2">/;
  if (regex.test(t)) {
    const tabsBlock = `<EventTabs
        activeTab={activeTab}
        tabs={[
          { id: "about", label: "About" },
          { id: "lineup", label: "Lineup" },
          { id: "reviews", label: "Reviews" },
          { id: "good-to-know", label: "Good to Know" },
        ]}
      />

      `;
    t = t.replace(regex, tabsBlock + '<div className="max-w-7xl mx-auto px-4 py-12">\n        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">\n          <div className="lg:col-span-2">');
    console.log("EventTabs inserted (loose).");
  } else {
    console.log("Still no match. Inspect the file.");
  }
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
}