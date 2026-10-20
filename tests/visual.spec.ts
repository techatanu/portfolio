import { expect, test } from "@playwright/test";
import { contact, profile } from "../content/data";

const widths = [375, 768, 1440];

for (const width of widths) {
  test(`recruiter test + full-page screenshot @ ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    // Spec §1 recruiter test: name, role, internship badge and contact above the fold, no WebGL needed.
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText(profile.name.split(" ")[0]);
    await expect(h1).toBeInViewport();
    await expect(page.getByText("Open to remote AI/ML internships").first()).toBeInViewport();
    await expect(page.locator(`a[href="mailto:${profile.email}"]`).first()).toBeInViewport();

    await expect(page.getByRole("heading", { level: 2, name: contact.heading })).toBeAttached();
    await page.screenshot({ path: `test-results/screens/home-${width}.png`, fullPage: true });
    await page.screenshot({ path: `test-results/screens/hero-${width}.png` });
  });
}

test("reduced motion: native scroll, content intact", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html.lenis")).toHaveCount(0);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator("#contact")).toBeInViewport();
  await page.screenshot({ path: "test-results/screens/reduced-motion-1440.png" });
  await context.close();
});

test("portrait dissolves into particles on scroll", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  // Particles take over the photo once three.js has loaded and the image is sampled.
  await expect(page.locator('#hero-portrait-reveal[data-portrait="particles"]')).toBeAttached({ timeout: 15_000 });
  await page.waitForTimeout(3000); // load-time assembly (2.2s) + crossfade
  await page.screenshot({ path: "test-results/screens/dissolve-0.png" });

  const heroHeight = await page.locator("#hero").evaluate((el) => el.getBoundingClientRect().height);
  // Progress = scrolled / (0.6 × hero height). Capture the photo mid-crumble and nearly gone.
  for (const pct of [15, 35, 60]) {
    await page.evaluate((y) => window.scrollTo(0, y), heroHeight * 0.6 * (pct / 100));
    await page.waitForTimeout(900);
    await page.screenshot({ path: `test-results/screens/dissolve-${pct}.png` });
  }

  // Scrolling back to the top re-forms the photo.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  await expect(page.locator("#hero-portrait")).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
});

test("journey: level HUD, skills deck, warp and code singularity", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator('#hero-portrait-reveal[data-portrait="particles"]')).toBeAttached({ timeout: 15_000 });
  await page.waitForTimeout(3000); // singularity fade-in + portrait assembly

  // [element id, extra px scrolled past its top, screenshot name]
  const stops: [string, number, string][] = [
    ["origin", 200, "journey-1-about"],
    ["skills", 700, "journey-2-skills-deck"],
    ["skills", 1600, "journey-3-skills-deck-deeper"],
    ["artifacts", 300, "journey-4-projects"],
    ["timeline", 300, "journey-5-experience"],
    ["singularity", -300, "journey-6-goals"],
    ["contact", -200, "journey-7-contact"],
  ];
  for (const [id, offset, name] of stops) {
    await page.evaluate(
      ([target, dy]) =>
        window.scrollTo(0, (document.getElementById(target as string)?.offsetTop ?? 0) + (dy as number)),
      [id, offset],
    );
    await page.waitForTimeout(600); // catch the "LEVEL UNLOCKED" banner and the warp streaks
    await page.screenshot({ path: `test-results/screens/${name}-warp.png` });
    await page.waitForTimeout(2200); // settled
    await page.screenshot({ path: `test-results/screens/${name}.png` });
  }
  expect(errors).toEqual([]);
});
