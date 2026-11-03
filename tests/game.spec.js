// @ts-check

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('the board has 9 squares', async ({ page }) => {
  const squares = page.locator('.square');
  await expect(squares).toHaveCount(9);
});

test('players take turns', async ({ page }) => {
  const squares = page.locator('.square');

  await squares.nth(0).click();
  expect(await squares.nth(0).textContent()).toBe('X');

  await squares.nth(1).click({ button: 'right' });
  expect(await squares.nth(1).textContent()).toBe('O');
});

test('same player cannot play twice in a row', async ({ page }) => {
  const squares = page.locator('.square');

  await squares.nth(0).click();
  expect(await squares.nth(0).textContent()).toBe('X');

  await squares.nth(1).click();
  expect(await squares.nth(1).textContent()).toBe('');
});

test('cannot override a taken squre', async ({ page }) => {
  const squares = page.locator('.square');

  await squares.nth(0).click();
  expect(await squares.nth(0).textContent()).toBe('X');

  await squares.nth(0).click({ button: 'right' });
  expect(await squares.nth(0).textContent()).toBe('X');
});

test('X wins', async ({ page }) => {
  const squares = page.locator('.square');

  await squares.nth(0).click();
  await squares.nth(3).click({ button: 'right' });
  await squares.nth(1).click();
  await squares.nth(4).click({ button: 'right' });
  await squares.nth(2).click();

  await expect(page.getByText('Game over! X won')).toBeVisible();
});

test('draw', async ({ page }) => {
  const squares = page.locator('.square');

  await squares.nth(0).click();
  await squares.nth(1).click({ button: 'right' });
  await squares.nth(2).click();
  await squares.nth(4).click({ button: 'right' });
  await squares.nth(3).click();
  await squares.nth(5).click({ button: 'right' });
  await squares.nth(7).click();
  await squares.nth(6).click({ button: 'right' });
  await squares.nth(8).click();

  await expect(page.getByText('Draw!')).toBeVisible();
});