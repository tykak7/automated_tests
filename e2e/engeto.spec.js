// @ts-check
const { test, expect } = require('@playwright/test');

test('Title is correct', async ({ page }) => {
  await page.goto('https://engeto.cz/');

  // Check that we're on the correct page
  await expect(page).toHaveTitle(/Kurzy/);
});

test('Cookies dialog shows correct info', async ({ page }) => {
  await page.goto('https://engeto.cz/');

  // Check that Cookie accept dialog is on 
  await expect(page.getByText(/Cookies/)).toBeVisible();

  // Check that user can view info about cookies
  const linkToCookiesInfo = page.getByRole('button', {name: 'Informace o cookies'})
  await expect(linkToCookiesInfo).toBeVisible();
  await linkToCookiesInfo.click();

  // Check that necessary Cookies switch is on and cannot be turned off
  const necessaryCookiesSwitch = page.getByRole('switch', {}).first();
  await expect(necessaryCookiesSwitch).toBeVisible();
  await expect(necessaryCookiesSwitch).toBeDisabled();

  // Check that Cookies info expand is in correct position
  await expect(page.getByText(/Zobrazit cookies/).first()).toBeVisible();
  await expect(page.getByText(/Skrýt cookies/).first()).not.toBeVisible();
  
  await page.getByText(/Zobrazit cookies/).first().click();
  await expect(page.getByText(/Zobrazit cookies/).first()).not.toBeVisible();
  await expect(page.getByText(/Skrýt cookies/).first()).toBeVisible();

  // Check that user can accept only necessary cookies
  const necessaryCookiesButton = page.locator('#cookiescript_reject');
  await expect(necessaryCookiesButton).toBeEnabled();
  await necessaryCookiesButton.click();
  await expect(page.getByText(/Cookies/)).not.toBeVisible();
});

test('Page redirect works', async ({ page }) => {
  await page.goto('https://engeto.cz/');

  // Check that we're on the correct page
  await expect(page).toHaveTitle(/Kurzy/);

  //Close Cookies dialog as soon as it's on
  
  const necessaryCookiesButton = page.locator('#cookiescript_reject');
  await page.addLocatorHandler(necessaryCookiesButton, async () => {
    await necessaryCookiesButton.click();
  });
  await expect(page.getByText(/Cookies/)).not.toBeVisible();

  // Go to Terminy Kurzu page
  await page.getByRole('link', { name: 'Zobrazit termíny kurzů' } ).click();
  await expect(page.locator('#h-terminy-kurzu')).toBeVisible();

  // Open the details of the first course on the list
  await page.getByText(/detail Termínu/i).first().click();
  const addToCartButton = page.getByText('Přihlas se na termín');
  await expect(addToCartButton).toBeEnabled();
});