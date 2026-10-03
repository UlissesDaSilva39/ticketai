const fs = require("fs");
const p = "app/event/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

if (!t.includes("EventTabs")) {
  const imp = 'import ReviewsSection from "@/components/ReviewsSection";';
  if (t.includes(imp)) {
    t = t.replace(imp, imp + '\nimport EventTabs from "@/components/EventTabs";');
    console.log("Import added.");
  }
}

const oldProps = `export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;`;

const newProps = `export default async function EventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = tab || "about";`;

if (t.includes(oldProps)) {
  t = t.replace(oldProps, newProps);
  console.log("searchParams added.");
} else {
  console.log("Props anchor miss.");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
}