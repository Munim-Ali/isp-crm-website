import { mkdir, writeFile } from "node:fs/promises";

// Original vector UI illustrations: fictional data, no live CRM requests.
const directory = "public/images/product";
await mkdir(directory, { recursive: true });
const colors = {
  ink: "#18181B",
  muted: "#52525B",
  line: "#D4D4D8",
  blue: "#004DFE",
  pale: "#F2F8FF",
  green: "#00A63E",
};
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
const rect = (x, y, w, h, fill = "#fff", r = 12, stroke = "none") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
const text = (x, y, value, size = 15, fill = colors.ink, weight = 400) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}">${esc(value)}</text>`;
const line = (x, y, w) => `<path d="M${x} ${y}h${w}" stroke="${colors.line}"/>`;
const circle = (x, y, r, fill) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const avatar = (x, y, initials, index = 0) =>
  circle(x, y, 19, ["#e6edff", "#efe8fc", "#fff0e0", "#e5f6f1"][index % 4]) +
  text(
    x - 11,
    y + 5,
    initials,
    12,
    ["#4777c8", "#9574bb", "#bd8b52", "#4c9b86"][index % 4],
    600,
  );
const pill = (x, y, label, active = true) =>
  rect(x, y, 78, 25, active ? "#edf8f2" : "#f1f3f7", 6) +
  circle(x + 12, y + 12, 3, active ? "#3b9a71" : "#99a3b2") +
  text(x + 22, y + 17, label, 11, active ? "#328366" : "#8c96a7", 500);
const names = [
  "Ahmed Hassan",
  "Sara Khan",
  "Usman Ali",
  "Fatima Malik",
  "Hassan Raza",
  "Ayesha Noor",
  "Bilal Ahmed",
];
const areas = [
  "Gulberg",
  "Johar Town",
  "Model Town",
  "Gulberg",
  "Faisal Town",
  "DHA",
  "Johar Town",
];
const nav = ["Dashboard", "Customers", "Records", "Users", "Plans"];

function frame(active, title, subtitle, body) {
  let sidebar =
    rect(0, 0, 1600, 1000, "#fff", 0) +
    rect(0, 0, 244, 1000, "#fafbfe", 0) +
    `<path d="M244 0v1000" stroke="${colors.line}"/>`;
  sidebar +=
    rect(27, 29, 34, 34, colors.blue, 10) +
    text(38, 53, "r", 27, "white", 700) +
    text(73, 52, "Your workspace", 16, colors.ink, 600) +
    text(30, 112, "WORKSPACE", 10, "#a9b3c2", 600);
  nav.forEach((item, i) => {
    const y = 136 + i * 51;
    if (item === active) sidebar += rect(17, y, 210, 42, "#edf3ff", 8);
    sidebar +=
      rect(32, y + 13, 15, 15, item === active ? "#d4e2ff" : "#eef1f7", 4) +
      text(
        60,
        y + 28,
        item,
        14,
        item === active ? colors.blue : "#7e8aa0",
        item === active ? 600 : 400,
      );
  });
  sidebar +=
    text(30, 454, "YOUR NETWORK", 10, "#a9b3c2", 600) +
    text(34, 496, "Service areas", 14, "#8390a7") +
    text(34, 540, "Dealers", 14, "#8390a7") +
    line(24, 899, 195) +
    avatar(45, 941, "YO") +
    text(75, 938, "Your organization", 12, colors.ink, 600) +
    text(75, 958, "Demo workspace", 11, "#a1aabd");
  sidebar +=
    line(244, 77, 1356) +
    text(285, 47, `${active} / Workspace`, 12, "#9aa6b9") +
    rect(1165, 22, 270, 34, "#f7f9fd", 7) +
    text(1185, 44, "⌕  Search your workspace", 12, "#a1adc0") +
    avatar(1537, 39, "YO") +
    text(288, 134, title, 29, colors.ink, 600) +
    text(289, 166, subtitle, 14, "#8b97ab");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><title>${esc(active)} — illustrative ISP CRM workspace</title><g font-family="Inter,Arial,Helvetica,sans-serif">${sidebar}${body}</g></svg>`;
}

let dashboard = "";
[
  {
    label: "Total customers",
    value: "1,284",
    note: "Every connection, accounted for",
  },
  {
    label: "Active connections",
    value: "1,196",
    note: "A clear view of your network",
  },
  { label: "Service areas", value: "12", note: "Neighborhoods you connect" },
  {
    label: "Internet plans",
    value: "8",
    note: "Plans that fit your customers",
  },
].forEach((stat, i) => {
  let x = 288 + i * 313;
  dashboard +=
    rect(x, 207, 292, 126, "#fff", 12, colors.line) +
    text(x + 22, 241, stat.label, 13, "#8895a9") +
    text(x + 22, 285, stat.value, 34, colors.ink, 600) +
    text(x + 22, 310, stat.note, 10, "#a4afbf");
});
dashboard +=
  rect(288, 358, 1230, 329, "#fff", 12, colors.line) +
  text(312, 394, "Your network, growing together", 17, colors.ink, 600) +
  text(312, 420, "Illustrative connection overview", 11, "#9aa6b8") +
  circle(1217, 395, 4, colors.blue) +
  text(1230, 400, "Active", 11, "#8d9aaf") +
  circle(1320, 395, 4, "#b6cffb") +
  text(1333, 400, "Inactive", 11, "#8d9aaf");
for (let i = 0; i < 4; i++)
  dashboard +=
    line(350, 461 + i * 52, 1130) +
    text(311, 465 + i * 52, ["150", "100", "50", "0"][i], 10, "#a4afc0");
const heights = [46, 72, 64, 102, 94, 130, 155, 144, 163, 187, 174, 201];
heights.forEach((h, i) => {
  let x = 371 + i * 92;
  dashboard +=
    rect(x, 617 - h, 25, h, colors.blue, 4) +
    rect(x + 31, 617 - h * 0.33, 17, h * 0.33, "#bdd2fa", 3) +
    text(
      x - 1,
      649,
      [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ][i],
      9,
      "#9ca8bb",
    );
});
dashboard +=
  text(290, 733, "Recent customer records", 17, colors.ink, 600) +
  text(1345, 733, "All fictional data", 11, "#a1adbf");
names.slice(0, 3).forEach((name, i) => {
  let y = 780 + i * 65;
  dashboard +=
    avatar(
      312,
      y,
      name
        .split(" ")
        .map((x) => x[0])
        .join(""),
      i,
    ) +
    text(344, y + 5, name, 14, colors.ink, 500) +
    text(677, y + 5, areas[i], 13, "#8b98ac") +
    text(976, y + 5, "Home 30 Mbps", 13, "#8b98ac") +
    pill(1376, y - 13, "Active") +
    line(289, y + 32, 1228);
});
await writeFile(
  `${directory}/dashboard.svg`,
  frame(
    "Dashboard",
    "A little clarity. A better day.",
    "The people, places, and plans behind your network.",
    dashboard,
  ),
);

let customers =
  rect(288, 207, 1230, 53, "#f8faff", 9) +
  text(
    307,
    239,
    "⌕  Search customers by name or connection ID",
    13,
    "#97a5ba",
  ) +
  rect(1280, 217, 102, 32, "#fff", 6, colors.line) +
  text(1298, 238, "All areas", 12, "#8190a9") +
  rect(1396, 217, 101, 32, "#fff", 6, colors.line) +
  text(1415, 238, "All plans", 12, "#8190a9");
customers +=
  rect(288, 283, 1230, 43, "#f8faff", 0) +
  text(311, 309, "CUSTOMER", 10, "#99a6b9", 600) +
  text(663, 309, "SERVICE AREA", 10, "#99a6b9", 600) +
  text(933, 309, "INTERNET PLAN", 10, "#99a6b9", 600) +
  text(1367, 309, "STATUS", 10, "#99a6b9", 600);
names.forEach((name, i) => {
  let y = 370 + i * 76;
  customers +=
    avatar(
      327,
      y,
      name
        .split(" ")
        .map((x) => x[0])
        .join(""),
      i,
    ) +
    text(363, y - 2, name, 14, colors.ink, 500) +
    text(
      363,
      y + 19,
      `${name.split(" ")[0].toLowerCase()}.home`,
      11,
      "#a4afc0",
    ) +
    text(663, y + 5, areas[i], 13, "#8090a8") +
    text(
      933,
      y + 5,
      ["Home 30 Mbps", "Business 50 Mbps", "Home 20 Mbps"][i % 3],
      13,
      "#8090a8",
    ) +
    pill(1367, y - 13, i === 2 ? "Inactive" : "Active", i !== 2) +
    line(288, y + 39, 1230);
});
customers += text(
  301,
  963,
  "Showing 7 sample records · Fictional demo data",
  11,
  "#a4afc0",
);
await writeFile(
  `${directory}/customers.svg`,
  frame(
    "Customers",
    "People before record numbers.",
    "Find the right person, with the whole story close by.",
    customers,
  ),
);

let records =
  rect(288, 211, 350, 713, "#fafcff", 12, colors.line) +
  avatar(338, 263, "AH", 0) +
  text(371, 260, "Ahmed Hassan", 17, colors.ink, 600) +
  text(371, 285, "ahmed.home", 12, "#98a5ba") +
  line(310, 314, 305);
[
  ["CONTACT", "ahmed@example.test"],
  ["MOBILE", "03XX XXXXXXX"],
  ["SERVICE AREA", "Gulberg"],
  ["DEALER", "Your local partner"],
  ["STATUS", "Active connection"],
].forEach(([label, value], i) => {
  const y = 355 + i * 105;
  records +=
    text(312, y, label, 10, "#9ba8bc", 600) +
    text(312, y + 28, value, 15, "#60738f");
});
records +=
  rect(663, 211, 854, 290, "#fff", 12, colors.line) +
  text(690, 253, "The connection at a glance", 19, colors.ink, 600) +
  text(
    690,
    282,
    "Everything your team needs to understand the setup.",
    13,
    "#95a2b6",
  ) +
  line(690, 309, 795);
[
  ["Internet plan", "Home 30 Mbps"],
  ["Monthly price", "PKR 3,000"],
  ["Connection ID", "ahmed.home"],
  ["ONU identifier", "XX:XX:XX:XX:01:24"],
].forEach(([l, v], i) => {
  const x = 690 + (i % 2) * 410,
    y = 351 + Math.floor(i / 2) * 88;
  records +=
    text(x, y, l, 11, "#9ca8bc") + text(x, y + 27, v, 16, "#5d7190", 500);
});
records +=
  rect(663, 526, 854, 190, "#f5f9ff", 12, "#dfe9fb") +
  text(690, 570, "One customer. One complete picture.", 21, "#3469c7", 600) +
  text(
    690,
    606,
    "Their package, service area, dealer, and connection details.",
    14,
    "#8096b7",
  ) +
  text(
    690,
    637,
    "Connected, so your team can give a better answer.",
    14,
    "#8096b7",
  ) +
  pill(690, 661, "Active");
records +=
  rect(663, 742, 854, 182, "#fff", 12, colors.line) +
  text(690, 782, "Identity documents", 18, colors.ink, 600) +
  text(
    690,
    813,
    "Protected access for authorized team members.",
    13,
    "#97a4b8",
  ) +
  rect(690, 838, 365, 58, "#f8faff", 8) +
  text(711, 874, "Identity document · Private", 13, "#8095b3");
await writeFile(
  `${directory}/records.svg`,
  frame(
    "Records",
    "The whole story, in one record.",
    "Illustrative customer profile · No real personal information.",
    records,
  ),
);

let users = "";
[
  { name: "Ayesha Khan", role: "Admin", initials: "AK" },
  { name: "Bilal Ahmed", role: "Manager", initials: "BA" },
  { name: "Hamza Raza", role: "Collector", initials: "HR" },
].forEach((person, i) => {
  const x = 288 + i * 417;
  users +=
    rect(x, 212, 396, 244, "#fff", 12, colors.line) +
    avatar(x + 197, 271, person.initials, i) +
    text(x + 125, 326, person.name, 19, colors.ink, 600) +
    rect(x + 147, 344, 100, 30, "#edf3ff", 15) +
    text(x + 166, 364, person.role, 12, colors.blue, 600) +
    text(
      x + 56,
      416,
      "The right information for the right role.",
      12,
      "#9aa8bc",
    );
});
users +=
  text(291, 514, "Clear roles. Confident teamwork.", 22, colors.ink, 600) +
  text(
    291,
    548,
    "Illustrative permissions — access depends on assigned organization roles.",
    13,
    "#97a6ba",
  ) +
  rect(288, 581, 1230, 49, "#f8faff", 8) +
  text(315, 612, "WORKSPACE PERMISSION", 11, "#94a2b8", 600) +
  text(909, 612, "ADMIN", 11, "#94a2b8", 600) +
  text(1113, 612, "MANAGER", 11, "#94a2b8", 600) +
  text(1345, 612, "COLLECTOR", 11, "#94a2b8", 600);
[
  "View customer records",
  "Update customer information",
  "Manage areas and plans",
  "Assign team roles",
].forEach((label, i) => {
  let y = 675 + i * 68;
  users += text(315, y, label, 14, "#7386a2");
  [934, 1150, 1386].forEach((x, j) => {
    let yes = j === 0 || (j === 1 && i < 3) || (j === 2 && i === 0);
    users +=
      circle(x, y - 4, 12, yes ? "#edf5ff" : "#f4f6fa") +
      text(
        x - 5,
        y + 1,
        yes ? "✓" : "–",
        12,
        yes ? colors.blue : "#b1bbca",
        600,
      );
  });
  users += line(288, y + 28, 1230);
});
await writeFile(
  `${directory}/users.svg`,
  frame(
    "Users",
    "Different roles. One shared understanding.",
    "Give your people the access they need, within each organization.",
    users,
  ),
);

let plans =
  rect(288, 208, 1230, 60, "#f5f9ff", 9) +
  text(310, 244, "Plans for the people you connect.", 15, "#6785b4", 500) +
  text(1130, 244, "Illustrative internet packages", 12, "#93a7c8");
[
  { speed: "20", name: "Home Essentials", price: "2,500" },
  { speed: "30", name: "Home Everyday", price: "3,000" },
  { speed: "50", name: "Business Connect", price: "4,000" },
  { speed: "100", name: "Business Plus", price: "6,500" },
].forEach((plan, i) => {
  const x = 288 + i * 313;
  plans +=
    rect(
      x,
      298,
      292,
      452,
      i === 1 ? "#f4f8ff" : "#fff",
      13,
      i === 1 ? "#b6cefa" : colors.line,
    ) +
    rect(x + 23, 324, 42, 42, "#e8f0ff", 12) +
    text(x + 36, 352, "↗", 22, colors.blue) +
    text(x + 23, 405, plan.name, 17, colors.ink, 600) +
    text(x + 23, 471, plan.speed, 49, colors.blue, 600) +
    text(x + 111, 470, "Mbps", 16, "#96a9c7") +
    line(x + 23, 502, 245) +
    text(x + 23, 546, `PKR ${plan.price}`, 24, colors.ink, 600) +
    text(x + 23, 573, "Sample monthly package price", 10, "#a4afc1") +
    pill(x + 23, 606, "Active") +
    text(x + 23, 700, "Connected to customer records", 11, "#98a7bc");
});
plans +=
  rect(288, 783, 1230, 127, "#fafcff", 12, colors.line) +
  text(
    315,
    824,
    "A package change shouldn’t become a guessing game.",
    20,
    colors.ink,
    600,
  ) +
  text(
    315,
    860,
    "Keep the package, customer, and monthly price together in one workspace.",
    14,
    "#8c9eb8",
  );
await writeFile(
  `${directory}/plans.svg`,
  frame(
    "Plans",
    "A plan for every kind of connection.",
    "Your internet packages, clearly organized. Sample pricing only.",
    plans,
  ),
);
console.log("Generated five original vector product preview images.");
