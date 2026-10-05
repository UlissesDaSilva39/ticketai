const fs = require("fs");
const p = "app/feed/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// The broken line is: <span> ? </span> (should be the star ★)
const broken = `<span key={n} className={n <= (a.rating || 0) ? "text-yellow-500" : "text-gray-300"}>
                              ?
                            </span>`;

const fixed = `<span key={n} className={n <= (a.rating || 0) ? "text-yellow-500" : "text-gray-300"}>
                              {"\\u2605"}
                            </span>`;

if (t.includes(broken)) {
  t = t.replace(broken, fixed);
  fs.writeFileSync(p, t);
  console.log("Star character fixed in feed.");
} else {
  // Fallback: replace any standalone ? inside the review star span
  const re = /(<span key=\{n\} className=\{n <= \(a\.rating \|\| 0\) \? "text-yellow-500" : "text-gray-300"\}>\s*)\?(\s*<\/span>)/;
  if (re.test(t)) {
    t = t.replace(re, '$1{"\\u2605"}$2');
    fs.writeFileSync(p, t);
    console.log("Star character fixed in feed (loose).");
  } else {
    console.log("Star pattern not found. Checking the review block:");
    const i = t.indexOf("a.rating !== undefined");
    console.log(JSON.stringify(t.slice(i, i + 400)));
  }
}