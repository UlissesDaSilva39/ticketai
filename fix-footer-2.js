const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");

const broken = `            </div>
              <span
                className="block text-sm uppercase tracking-[0.3em] text-gray-400 mb-4"                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Discover. Connect. Experience.
              </span>`;

const fixed = `            </div>
            <p className="text-center text-sm text-gray-500">
              <span
                className="block text-sm uppercase tracking-[0.3em] text-gray-400 mb-4"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Discover. Connect. Experience.
              </span>`;

if (t.includes(broken)) {
  t = t.replace(broken, fixed);
  fs.writeFileSync(p, t);
  console.log("Footer <p> opening tag restored.");
} else {
  console.log("Footer block not found. Showing current state:");
  const i = t.indexOf('tracking-[0.3em]');
  console.log(JSON.stringify(t.slice(i - 200, i + 400)));
}