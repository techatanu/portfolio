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
