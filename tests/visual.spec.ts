import { expect, test } from "@playwright/test";
import { contact, profile, projects, quickView } from "../content/data";

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

test("about photo snaps into pieces on scroll", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator("#origin").scrollIntoViewIfNeeded();
  // The canvas replaces the photo once it has loaded; it assembles as it comes into view.
  await expect(page.locator("#origin .portrait-dust")).toBeAttached({ timeout: 10_000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "test-results/screens/dissolve-0.png" });
  await page.mouse.wheel(0, 420);
  await page.waitForTimeout(900);
  await page.screenshot({ path: "test-results/screens/dissolve-mid.png" });
  expect(errors).toEqual([]);
});

test("journey: every section", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForTimeout(3000); // fonts + entrance

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
    await page.waitForTimeout(600); // mid-scroll
    await page.screenshot({ path: `test-results/screens/${name}-moving.png` });
    await page.waitForTimeout(2200); // settled
    await page.screenshot({ path: `test-results/screens/${name}.png` });
  }
  expect(errors).toEqual([]);
});

// Architecture v2 (docs/ARCHITECTURE.md): plain recruiter pages, no WebGL.
for (const width of widths) {
  test(`quick view: identity, projects and contact @ ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
    await page.goto("/quick/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(profile.name);
    await expect(page.locator(`a[href="mailto:${profile.email}"]`).first()).toBeInViewport();
    for (const slug of quickView.topProjects) {
      await expect(page.locator(`a[href="/projects/${slug}/"]`).first()).toBeAttached();
    }
    await expect(page.locator("canvas")).toHaveCount(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/screens/quick-${width}.png`, fullPage: true });
  });
}

test("every project has a case study page", async ({ page }) => {
  for (const project of projects) {
    await page.goto(`/projects/${project.slug}/`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(project.title);
    await expect(page.locator(`a[href="${project.repo}"]`).first()).toBeAttached();
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`/projects/${projects[0].slug}/`);
  await page.screenshot({ path: "test-results/screens/case-study-1440.png", fullPage: true });
});
