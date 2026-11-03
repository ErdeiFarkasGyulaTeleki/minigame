import { test, expect } from '@playwright/test';

async function play(squares, moves) {
  for (const [turn, move] of moves.entries()) {
    const square = typeof move === 'number' ? move : move.square;
    const player = typeof move === 'number' ? (turn % 2 === 0 ? 'X' : 'O') : move.player;

    await squares.nth(square).click(player === 'O' ? { button: 'right' } : undefined);
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
  await expect(squares.nth(0)).toHaveText('X');
  await expect(squares.nth(1)).toHaveText('O');
});

test('same player cannot play twice in a row', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0]);
  await expect(squares.nth(0)).toHaveText('X');

  await play(squares, [1]);
  await expect(squares.nth(1)).toHaveText('');
});

test('cannot override a taken square', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0]);
  await expect(squares.nth(0)).toHaveText('X');

  await play(squares, [{ square: 0, player: 'X' }]);
  await expect(squares.nth(0)).toHaveText('X');

  await play(squares, [{ square: 0, player: 'X' }]);
  await expect(squares.nth(0)).toHaveText('X');
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
    await expect(squares.nth(i)).toHaveText('');
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

test('draws are displayed correctly', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 1, 2, 4, 3, 5, 7, 6, 8]);
  await expect(page.getByText('Draw!')).toBeVisible();
});

test('wins are persisted across page reloads', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 3, 1, 4, 2]);

  await page.reload();

  await expect(page.getByText('X has won 1 games')).toBeVisible();
});

test('after a draw, the game can be reset and played again', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 1, 2, 4, 3, 5, 7, 6, 8]);

  const resetButton = page.getByRole('button', { name: 'Reset' });
  await resetButton.click();

  await play(squares, [0, 3, 1, 4, 2]);
  await expect(page.getByText('Game over! X won')).toBeVisible();
});

test('after a win, the game can be reset and played again', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 3, 1, 4, 2]);

  const resetButton = page.getByRole('button', { name: 'Reset' });
  await resetButton.click();
  await play(squares, [0, 3, 1, 4, 2]);
  await expect(page.getByText('Game over! X won')).toBeVisible();
});

test('after a win, the game can be reset and played again with different moves', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 3, 1, 4, 2]);

  const resetButton = page.getByRole('button', { name: 'Reset' });
  await resetButton.click();
  await play(squares, [0, 1, 2, 4, 3, 5, 7, 6, 8]);
  await expect(page.getByText('Draw!')).toBeVisible();
});

test('after a draw, the game can be reset and played again with different moves', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 1, 2, 4, 3, 5, 7, 6, 8]);
  const resetButton = page.getByRole('button', { name: 'Reset' });

  await resetButton.click();
  await play(squares, [0, 3, 1, 4, 2]);
  await expect(page.getByText('Game over! X won')).toBeVisible();
});

for (let i = 0; i < 9; i++) {
  test(`square ${i} can be clicked`, async ({ page }) => {
    const squares = page.locator('.square');

    await play(squares, [i]);
    await expect(squares.nth(i)).toHaveText('X');
  });
}

for (let i = 0; i < 9; i++) {
  test(`square ${i} can be right-clicked`, async ({ page }) => {
    const squares = page.locator('.square');
    await play(squares, [{ square: i, player: 'O' }]);
    await expect(squares.nth(i)).toHaveText('O');
  });
}

for (let i = 0; i < 9; i++) {
  test(`square ${i} cannot be clicked twice`, async ({ page }) => {
    const squares = page.locator('.square');
    await play(squares, [{ square: i, player: 'X' }, { square: i, player: 'X' }]);
    await expect(squares.nth(i)).toHaveText('X');
  });
}

for (let i = 0; i < 9; i++) {
  test(`square ${i} cannot be right-clicked twice`, async ({ page }) => {
    const squares = page.locator('.square');
    await play(squares, [{ square: i, player: 'O' }, { square: i, player: 'O' }]);
    await expect(squares.nth(i)).toHaveText('O');
  });
}

for (let i = 0; i < 9; i++) {
  test(`square ${i} cannot be clicked and right-clicked`, async ({ page }) => {
    const squares = page.locator('.square');
    await play(squares, [{ square: i, player: 'X' }, { square: i, player: 'O' }]);
    await expect(squares.nth(i)).toHaveText('X');
  });
}

for (let i = 0; i < 9; i++) {
  test(`square ${i} cannot be right-clicked and clicked`, async ({ page }) => {
    const squares = page.locator('.square');
    await play(squares, [{ square: i, player: 'O' }, { square: i, player: 'X' }]);
    await expect(squares.nth(i)).toHaveText('O');
  });
}

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (i === j) continue;
    test(`square ${i} and square ${j} can be clicked in any order`, async ({ page }) => {
      const squares = page.locator('.square');
      await play(squares, [i, j]);

      await expect(squares.nth(i)).toHaveText('X');
      await expect(squares.nth(j)).toHaveText('O');
    });
  }
};

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (i === j) continue;
    test(`square ${i} and square ${j} cannot both be right-clicked by the same player`, async ({ page }) => {
      const squares = page.locator('.square');
      await play(squares, [{ square: i, player: 'O' }, { square: j, player: 'O' }]);
      await expect(squares.nth(i)).toHaveText('O');
      await expect(squares.nth(j)).toHaveText('');
    });
  }
}

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (i === j) continue;
    test(`square ${i} and square ${j} can be clicked and right-clicked in any order`, async ({ page }) => {
      const squares = page.locator('.square');
      await play(squares, [{ square: i, player: 'X' }, { square: j, player: 'O' }]);
      await expect(squares.nth(i)).toHaveText('X');
      await expect(squares.nth(j)).toHaveText('O');
    });
  }
}

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (i === j) continue;
    test(`square ${i} and square ${j} can be right-clicked and clicked in any order`, async ({ page }) => {
      const squares = page.locator('.square');
      await play(squares, [{ square: i, player: 'O' }, { square: j, player: 'X' }]);
      await expect(squares.nth(i)).toHaveText('O');
      await expect(squares.nth(j)).toHaveText('X');
    });
  }
}

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (i === j) continue;
    for (let k = 0; k < 9; k++) {
      if (i === k || j === k) continue;
      test(`square ${i}, square ${j}, and square ${k} can be clicked in any order`, async ({ page }) => {
        const squares = page.locator('.square');
        await play(squares, [i, j, k]);
        await expect(squares.nth(i)).toHaveText('X');
        await expect(squares.nth(j)).toHaveText('O');
        await expect(squares.nth(k)).toHaveText('X');
      });
    }
  }
}

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (i === j) continue;
    for (let k = 0; k < 9; k++) {
      if (i === k || j === k) continue;
      test(`only the first of square ${i}, square ${j}, and square ${k} can be right-clicked by the same player`, async ({ page }) => {
        const squares = page.locator('.square');
        await play(squares, [
          { square: i, player: 'O' },
          { square: j, player: 'O' },
          { square: k, player: 'O' },
        ]);
        await expect(squares.nth(i)).toHaveText('O');
        await expect(squares.nth(j)).toHaveText('');
        await expect(squares.nth(k)).toHaveText('');
      });
    }
  }
}

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (i === j) continue;
    for (let k = 0; k < 9; k++) {
      if (i === k || j === k) continue;
      for (let l = 0; l < 9; l++) {
        if (i === l || j === l || k === l) continue;
        test(`square ${i}, square ${j}, square ${k}, and square ${l} can be clicked in any order`, async ({ page }) => {
          const squares = page.locator('.square');
          await play(squares, [i, j, k, l]);
          await expect(squares.nth(i)).toHaveText('X');
          await expect(squares.nth(j)).toHaveText('O');
          await expect(squares.nth(k)).toHaveText('X');
          await expect(squares.nth(l)).toHaveText('O');
        });
      }
    }
  }
}

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (i === j) continue;
    for (let k = 0; k < 9; k++) {
      if (i === k || j === k) continue;
      for (let l = 0; l < 9; l++) {
        if (i === j || i === k || i === l || j === k || j === l || k === l) continue;
        test(`only the first of square ${i}, square ${j}, square ${k}, and square ${l} can be right-clicked by the same player`, async ({ page }) => {
          const squares = page.locator('.square');
          await play(squares, [
            { square: i, player: 'O' },
            { square: j, player: 'O' },
            { square: k, player: 'O' },
            { square: l, player: 'O' },
          ]);
          await expect(squares.nth(i)).toHaveText('O');
          await expect(squares.nth(j)).toHaveText('');
          await expect(squares.nth(k)).toHaveText('');
          await expect(squares.nth(l)).toHaveText('');
        });
      }
    }
  }
}

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (i === j) continue;
    for (let k = 0; k < 9; k++) {
      if (i === k || j === k) continue;
      for (let l = 0; l < 9; l++) {
        if (i === l || j === l || k === l) continue;
        for (let m = 0; m < 9; m++) {
          if (i === m || j === m || k === m || l === m) continue;
          test(`square ${i}, square ${j}, square ${k}, square ${l}, and square ${m} can be clicked in any order`, async ({ page }) => {
            const squares = page.locator('.square');
            await play(squares, [i, j, k, l, m]);
            await expect(squares.nth(i)).toHaveText('X');
            await expect(squares.nth(j)).toHaveText('O');
            await expect(squares.nth(k)).toHaveText('X');
            await expect(squares.nth(l)).toHaveText('O');
            await expect(squares.nth(m)).toHaveText('X');
          });
        }
      }
    }
  }
}

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (i === j) continue;
    for (let k = 0; k < 9; k++) {
      if (i === k || j === k) continue;
      for (let l = 0; l < 9; l++) {
        if (i === l || j === l || k === l) continue;
        for (let m = 0; m < 9; m++) {
          if (i === m || j === m || k === m || l === m) continue;
          test(`right-clicking squares ${i}, ${j}, ${k}, ${l}, and ${m} only lets the same player move once`, async ({ page }) => {
            const squares = page.locator('.square');
            await play(squares, [
              { square: i, player: 'O' },
              { square: j, player: 'O' },
              { square: k, player: 'O' },
              { square: l, player: 'O' },
              { square: m, player: 'X' },
            ]);
            await expect(squares.nth(i)).toHaveText('O');
            await expect(squares.nth(j)).toHaveText('');
            await expect(squares.nth(k)).toHaveText('');
            await expect(squares.nth(l)).toHaveText('');
            await expect(squares.nth(m)).toHaveText('X');
          });
        }
      }
    }
  }
}

// for (let i = 0; i < 9; i++) {
//   for (let j = 0; j < 9; j++) {
//     for (let k = 0; k < 9; k++) {
//       for (let l = 0; l < 9; l++) {
//         for (let m = 0; m < 9; m++) {
//           test(`square ${i}, square ${j}, square ${k}, square ${l}, and square ${m} can be right-clicked in any order`, async ({ page }) => {
//             const squares = page.locator('.square');
//             await squares.nth(i).click({ button: 'right' });
//             await squares.nth(j).click({ button: 'right' });
//             await squares.nth(k).click({ button: 'right' });
//             await squares.nth(l).click({ button: 'right' });
//             await squares.nth(m).click();
//             await expect(await squares.nth(i).textContent()).toBe('X');
//             await expect(await squares.nth(j).textContent()).toBe('O');
//             await expect(await squares.nth(k).textContent()).toBe('X');
//             await expect(await squares.nth(l).textContent()).toBe('O');
//             await expect(await squares.nth(m).textContent()).toBe('X');
//           });
//         }
//       }
//     }
//   }
// }


// for (let i = 0; i < 9; i++) {
//   for (let j = 0; j < 9; j++) {
//     for (let k = 0; k < 9; k++) {
//       for (let l = 0; l < 9; l++) {
//         for (let m = 0; m < 9; m++) {
//           for (let n = 0; n < 9; n++) {
//             test(`square ${i}, square ${j}, square ${k}, square ${l}, square ${m}, and square ${n} can be clicked in any order`, async ({ page }) => {
//               const squares = page.locator('.square');
//               await squares.nth(i).click();
//               await squares.nth(j).click();
//               await squares.nth(k).click();
//               await squares.nth(l).click();
//               await squares.nth(m).click();
//               await squares.nth(n).click();
//               expect(await squares.nth(i).textContent()).toBe('X');
//               expect(await squares.nth(j).textContent()).toBe('O');
//               expect(await squares.nth(k).textContent()).toBe('X');
//               expect(await squares.nth(l).textContent()).toBe('O');
//               expect(await squares.nth(m).textContent()).toBe('X');
//               expect(await squares.nth(n).textContent()).toBe('O');
//             });
//           }
//         }
//       }
//     }
//   }
// }

// for (let i = 0; i < 9; i++) {
//   for (let j = 0; j < 9; j++) {
//     for (let k = 0; k < 9; k++) {
//       for (let l = 0; l < 9; l++) {
//         for (let m = 0; m < 9; m++) {
//           for (let n = 0; n < 9; n++) {
//             test(`square ${i}, square ${j}, square ${k}, square ${l}, square ${m}, and square ${n} can be right-clicked in any order`, async ({ page }) => {
//               const squares = page.locator('.square');
//               await squares.nth(i).click({ button: 'right' });
//               await squares.nth(j).click({ button: 'right' });
//               await squares.nth(k).click({ button: 'right' });
//               await squares.nth(l).click({ button: 'right' });
//               await squares.nth(m).click({ button: 'right' });
//               await squares.nth(n).click({ button: 'right' });
//               expect(await squares.nth(i).textContent()).toBe('X');
//               expect(await squares.nth(j).textContent()).toBe('O');
//               expect(await squares.nth(k).textContent()).toBe('X');
//               expect(await squares.nth(l).textContent()).toBe('O');
//               expect(await squares.nth(m).textContent()).toBe('X');
//               expect(await squares.nth(n).textContent()).toBe('O');
//             });
//           }
//         }
//       }
//     }
//   }
// }

// for (let i = 0; i < 9; i++) {
//   for (let j = 0; j < 9; j++) {
//     for (let k = 0; k < 9; k++) {
//       for (let l = 0; l < 9; l++) {
//         for (let m = 0; m < 9; m++) {
//           for (let n = 0; n < 9; n++) {
//             for (let o = 0; o < 9; o++) {
//               test(`square ${i}, square ${j}, square ${k}, square ${l}, square ${m}, square ${n}, and square ${o} can be clicked in any order`, async ({ page }) => {
//                 const squares = page.locator('.square');
//                 await squares.nth(i).click();
//                 await squares.nth(j).click();
//                 await squares.nth(k).click();
//                 await squares.nth(l).click();
//                 await squares.nth(m).click();
//                 await squares.nth(n).click();
//                 await squares.nth(o).click();
//                 expect(await squares.nth(i).textContent()).toBe('X');
//                 expect(await squares.nth(j).textContent()).toBe('O');
//                 expect(await squares.nth(k).textContent()).toBe('X');
//                 expect(await squares.nth(l).textContent()).toBe('O');
//                 expect(await squares.nth(m).textContent()).toBe('X');
//                 expect(await squares.nth(n).textContent()).toBe('O');
//                 expect(await squares.nth(o).textContent()).toBe('X');
//               });
//             }
//           }
//         }
//       }
//     }
//   }
// }

// for (let i = 0; i < 9; i++) {
//   for (let j = 0; j < 9; j++) {
//     for (let k = 0; k < 9; k++) {
//       for (let l = 0; l < 9; l++) {
//         for (let m = 0; m < 9; m++) {
//           for (let n = 0; n < 9; n++) {
//             for (let o = 0; o < 9; o++) {
//               test(`square ${i}, square ${j}, square ${k}, square ${l}, square ${m}, square ${n}, and square ${o} can be right-clicked in any order`, async ({ page }) => {
//                 const squares = page.locator('.square');
//                 await squares.nth(i).click({ button: 'right' });
//                 await squares.nth(j).click({ button: 'right' });
//                 await squares.nth(k).click({ button: 'right' });
//                 await squares.nth(l).click({ button: 'right' });
//                 await squares.nth(m).click({ button: 'right' });
//                 await squares.nth(n).click({ button: 'right' });
//                 await squares.nth(o).click({ button: 'right' });
//                 expect(await squares.nth(i).textContent()).toBe('X');
//                 expect(await squares.nth(j).textContent()).toBe('O');
//                 expect(await squares.nth(k).textContent()).toBe('X');
//                 expect(await squares.nth(l).textContent()).toBe('O');
//                 expect(await squares.nth(m).textContent()).toBe('X');
//                 expect(await squares.nth(n).textContent()).toBe('O');
//                 expect(await squares.nth(o).textContent()).toBe('X');
//               });
//             }
//           }
//         }
//       }
//     }
//   }
// }
