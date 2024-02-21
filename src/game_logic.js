export function isBoardCorrect(grid) {
  const checkNoDuplicates = arr => new Set(arr).size === arr.length && arr.every(val => val !== " ");

  return grid.every(checkNoDuplicates) &&
    [...Array(9).keys()].every(col => checkNoDuplicates(grid.map(row => row[col]))) &&
    [0, 1, 2].every(row => [0, 1, 2].every(col =>
      checkNoDuplicates(grid.slice(row * 3, row * 3 + 3)
                            .flatMap(row => row.slice(col * 3, col * 3 + 3)))
    ));
}
