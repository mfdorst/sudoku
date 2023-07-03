export function isBoardCorrect(board) {
  if (!isBoardFilled) return false;
  if (!board.every((row) => isValidSequence(row))) return false;
  const transposedBoard = board.map((_, i) => board.map((row) => row[i]));
  if (!transposedBoard.every((col) => isValidSequence(col))) return false;
  const boxCoords = [0, 1, 2].flatMap((x) => [0, 1, 2].map((y) => [x, y]));
  if (!boxCoords.every(([x, y]) => isValidSequence(getBox(x, y, board))))
    return false;
  return true;
}

function getBox(x, y, board) {
  const rows = board.slice(y * 3, y * 3 + 3);
  return rows.flatMap((row) => row.slice(x * 3, x * 3 + 3));
}

function isBoardFilled(board) {
  return board.every((row) =>
    row.every((cell) => {
      const val = cell.map(Number);
      return val >= 1 && val <= 9;
    })
  );
}

// Verify that the sequence has all numbers 1-9
function isValidSequence(sequence) {
  const bitfield = sequence
    .map(Number)
    .reduce((acc, val) => acc | (1 << (val - 1)), 0);
  // 11111111bin == 511dec
  return bitfield === 511;
}
