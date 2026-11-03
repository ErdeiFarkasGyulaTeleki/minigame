// @ts-check

import { test, expect } from '@playwright/test';

// @ts-ignore
async function play(squares, moves) {
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];

    await squares.nth(move).click(i % 2 === 0 ? {} : { button: 'right' });
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('the board has 9 squares', async ({ page }) => {
  const squares = page.locator('.square');
  await expect(squares).toHaveCount(9);
});

test('players take turns', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 1]);
  expect(await squares.nth(0).textContent()).toBe('X');

  expect(await squares.nth(1).textContent()).toBe('O');
});

test('same player cannot play twice in a row', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0]);
  expect(await squares.nth(0).textContent()).toBe('X');

  await play(squares, [1]);
  expect(await squares.nth(1).textContent()).toBe('');
});

test('cannot override a taken squre', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0]);
  expect(await squares.nth(0).textContent()).toBe('X');

  await play(squares, [0]);
  expect(await squares.nth(0).textContent()).toBe('X');

  await play(squares, [0]);
  expect(await squares.nth(0).textContent()).toBe('X');
});

test('X wins', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 3, 1, 4, 2]);

  await expect(page.getByText('Game over! X won')).toBeVisible();
});

test('draw', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 1, 2, 4, 3, 5, 7, 6, 8]);

  await expect(page.getByText('Draw!')).toBeVisible();
});

test('reset button resets the game', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 3, 1, 4, 2]);

  const resetButton = page.getByRole('button', { name: 'Reset' });
  await resetButton.click();

  for (let i = 0; i < 9; i++) {
    expect(await squares.nth(i).textContent()).toBe('');
  }
});

test('last played cell is highlighted', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0]);

  await expect(squares.nth(0)).toContainClass('lastcell');
});

test('wins are stored in localStorage', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 3, 1, 4, 2]);

  const wins = await page.evaluate(() => localStorage.getItem('wins'));
  expect(wins).toBe(JSON.stringify({ X: 1, O: 0 }));
});

test('turns are displayed correctly', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0]);
  await expect(page.getByText("O's turn")).toBeVisible();
});

test('wins are displayed correctly', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 3, 1, 4, 2]);
  await expect(page.getByText('X has won 1 games')).toBeVisible();
});