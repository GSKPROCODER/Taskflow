import { test, expect } from "@playwright/test";

test.describe("TaskFlow Critical User Journeys", () => {
  // Use a unique email per run or rely on the seed script having a default test user
  const testEmail = "test@example.com";
  const testPassword = "password123";

  test("Authentication & Dashboard Routing", async ({ page }) => {
    // Navigate to root which should redirect to login
    await page.goto("/");
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page).toHaveTitle(/TaskFlow/);

    // Fill credentials (assuming test@example.com is seeded or already registered)
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    // Check if we have Sign In instead of Log in
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Verify dashboard components load
    await expect(page.locator("text=Total Tasks")).toBeVisible();
  });

  test("Team Lead Journey: Create Project & Task", async ({ page }) => {
    // Note: This test assumes the test user is a team_lead or developer
    // that can see projects. If RBAC strictly requires team_lead, this user must be one.

    // Log in directly for this test
    await page.goto("/login");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Navigate to Projects
    await page.click("text=Projects");
    await expect(page).toHaveURL(/.*\/projects/);

    // Verify "New Project" button is visible
    const newProjectBtn = page.locator("text=New Project");
    await expect(newProjectBtn).toBeVisible();

    // Click to open modal
    await newProjectBtn.click();

    // Fill the project form
    await page.fill('input[name="name"]', "E2E Automated Project");
    await page.fill('textarea[name="description"]', "Created by Playwright");

    // Check if the 'Create Project' submit button exists and click it
    await page.click('button:has-text("Create Project")');

    // Verify the project appears in the list (or it redirects, depending on flow)
    // The UI should show "E2E Automated Project"
    await expect(
      page.locator("text=E2E Automated Project").first(),
    ).toBeVisible();
  });
});
