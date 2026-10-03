const fs = require("fs");

// Add logging to the submit route
let p = "app/api/reviews/submit/route.ts";
let t = fs.readFileSync(p, "utf8");
const before = t;

if (!t.includes("[reviews/submit]")) {
  t = t.replace(
    'const { data, error } = await supabase',
    'console.log("[reviews/submit] called", { eventId, rating, hasComment: !!comment });\n    const { data, error } = await supabase'
  );
  t = t.replace(
    'if (error) return NextResponse.json({ error: error.message }, { status: 500 });',
    'if (error) { console.error("[reviews/submit] error:", error); return NextResponse.json({ error: error.message }, { status: 500 }); }\n    console.log("[reviews/submit] success:", data?.id);'
  );
  fs.writeFileSync(p, t);
  console.log("Submit logging added.");
} else {
  console.log("Submit logging already present.");
}

// Add logging to the delete route
p = "app/api/reviews/delete/route.ts";
t = fs.readFileSync(p, "utf8");

if (!t.includes("[reviews/delete]")) {
  t = t.replace(
    'const { error } = await supabase',
    'console.log("[reviews/delete] called for eventId=", eventId, "userId=", user.id);\n    const { error } = await supabase'
  );
  t = t.replace(
    'if (error) return NextResponse.json({ error: error.message }, { status: 500 });',
    'if (error) { console.error("[reviews/delete] error:", error); return NextResponse.json({ error: error.message }, { status: 500 }); }\n    console.log("[reviews/delete] success");'
  );
  fs.writeFileSync(p, t);
  console.log("Delete logging added.");
} else {
  console.log("Delete logging already present.");
}