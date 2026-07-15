import { test, expect } from "@playwright/test";

test.describe("TaskFlow Critical User Journeys", () => {
  // Use a unique email per run or rely on the seed script having a default test user
  const testEmail = "test@example.com";
  const testPassword = "password123";

  test.beforeEach(async ({ page }) => {
    // Mock Supabase Auth (signInWithPassword)
    await page.route("**/auth/v1/token?grant_type=password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "fake-jwt",
          token_type: "bearer",
          expires_in: 3600,
          refresh_token: "fake-refresh",
          user: {
            id: "fake-user-id",
            email: testEmail,
            user_metadata: { role: "team_lead", name: "E2E User" },
          },
        }),
      });
    });

    // Mock Dashboard and My Tasks (GET /api/v1/tasks* and /api/v1/dashboard*)
    await page.route("**/api/v1/tasks*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [], total: 0 }),
      });
    });

    await page.route("**/api/v1/dashboard*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: { metrics: { total_tasks: 0, completed_tasks: 0, active_projects: 0 }, activity: [], my_tasks: [] }, total: 0 }),
      });
    });


    // Mock Projects API (GET /api/v1/projects and POST /api/v1/projects)
    await page.route("**/api/v1/projects*", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              id: "proj-1",
              name: "E2E Automated Project",
              description: "Created by Playwright",
              status: "active",
              created_by: "fake-user-id",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [{
              id: "proj-1",
              name: "E2E Automated Project",
              description: "Created by Playwright",
              status: "active",
              created_by: "fake-user-id",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }],
            total: 1,
          }),
        });
      }
    });
  });

  test("Authentication & Dashboard Routing", async ({ page }) => {
    // Navigate to root which should show the landing page
    await page.goto("/");
    await expect(page).toHaveTitle(/TaskFlow/);

    // Then navigate to login
    await page.goto("/login");
    await expect(page).toHaveURL(/.*\/login/);

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
