const fs = require("fs");
const p = "components/ReviewsSection.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

if (!t.includes("useEffect")) {
  t = t.replace(
    'import { useState } from "react";',
    'import { useEffect, useState } from "react";'
  );
  console.log("useEffect imported.");
}

const anchor = 'const [reviews, setReviews] = useState<Review[]>(initialReviews);';
if (!t.includes("setReviews(initialReviews)")) {
  t = t.replace(
    anchor,
    anchor + '\n\n  useEffect(() => {\n    setReviews(initialReviews);\n  }, [initialReviews]);'
  );
  console.log("useEffect sync added.");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("ReviewsSection.tsx updated.");
} else {
  console.log("No changes needed.");
}