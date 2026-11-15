import { access, mkdir, writeFile } from "node:fs/promises";

await mkdir("public/images", { recursive: true });
await mkdir("public/fonts", { recursive: true });
const assets = [
  [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=82&fm=webp",
    "public/images/team.webp",
  ],
  [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=82&fm=webp",
    "public/images/workspace.webp",
  ],
];
for (const [url, path] of assets) {
  try {
    await access(path);
    continue;
  } catch {
    /* Download only missing imagery. */
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Asset request failed: ${response.status}`);
  await writeFile(path, Buffer.from(await response.arrayBuffer()));
  console.log(`Saved ${path}`);
}
const css = await fetch(
  "https://fonts.googleapis.com/css2?family=Inter:wght@400..800&display=swap",
  {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    },
  },
);
if (!css.ok) throw new Error("Font CSS request failed");
const fontUrls = [...(await css.text()).matchAll(/url\((https:[^)]+)\)/g)];
const font = await fetch(fontUrls.at(-1)[1]);
if (!font.ok) throw new Error("Font download failed");
await writeFile(
  "public/fonts/inter-latin.woff2",
  Buffer.from(await font.arrayBuffer()),
);
console.log("Saved local Inter font");
const license = await fetch(
  "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt",
);
if (!license.ok) throw new Error("Font license download failed");
await writeFile("public/fonts/Inter-OFL.txt", await license.text());
