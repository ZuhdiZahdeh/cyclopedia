// scripts/utils/reporter.js
export function start(name) {
  console.log(`\n——— ▶ ${name} ———`);
}

export function ok(name, extra = "") {
  console.log(`✅ ${name}${extra ? " — " + extra : ""}`);
  return 0;
}

export function fail(name, messages = []) {
  console.error(`❌ ${name} — ${messages.length ? "تفاصيل بالأسفل" : "فشل"}`);
  for (const m of messages) console.error(" - " + m);
  return 1;
}

export function linesOf(buf) {
  return (buf || "").toString().split(/\r?\n/).filter(Boolean);
}
