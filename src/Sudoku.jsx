import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";
import { isBoardCorrect } from "./game_logic";

function Sudoku({ newGameRequested, setNewGameRequested }) {
  const savedGrid = JSON.parse(localStorage.getItem("sudoku"));

  // Initialize grid to saved state with empty grid as fallback
  const [gridData, setGridData] = useState(
    savedGrid ||
    Array(9)
      .fill()
      .map(() => ({
        id: nanoid(),
        row: Array(9)
          .fill()
          .map(() => ({ id: nanoid(), val: " ", selected: false })),
      }))
  );
  const [selectedCell, setSelectedCell] = useState({
    id: null,
    row: null,
    col: null,
    val: 0,
  });

  async function fetchNewBoard() {
    const res = await fetch(
      "https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value}}}"
    );
    let data = await res.json();
    data = data.newboard.grids[0].value;
    setGridData((gridData) =>
      gridData.map(({ id, row }, i) => ({
        id,
        row: row
          .map((cell, j) => ({
            ...cell,
            val: data[i][j],
          }))
          .map((cell) =>
            cell.val === 0
              ? { ...cell, val: " ", permanent: false }
              : { ...cell, val: `${cell.val}`, permanent: true }
          ),
      }))
    );
  }

  useEffect(() => {
    if (isBoardCorrect(gridData.map(({ row }) => row.map(({ val }) => val)))) {
      console.log("You won!");
    }
  }, [gridData]);

  // Save grid locally on every change
  useEffect(() => {
    localStorage.setItem("sudoku", JSON.stringify(gridData));
  }, [gridData]);

  function selectCell(id, row, col, val) {
    setSelectedCell({ id, row, col, val });
  }

  // Fetch a board after page load
  useEffect(() => {
    if (savedGrid === null) {
      fetchNewBoard();
    }
  }, [savedGrid]);

  // Fetch new board when new game is requested
  useEffect(() => {
    if (newGameRequested) {
      fetchNewBoard();
    }
    setNewGameRequested(false);
  }, [newGameRequested, setNewGameRequested]);

  // Keep selected rows/columns up to date
  useEffect(
    () =>
      setGridData((gridData) =>
        gridData.map(({ row, ...rowData }, rowIdx) => ({
          ...rowData,
          row: row.map((cell, colIdx) => {
            const selectedRow = selectedCell.row === rowIdx;
            const selectedCol = selectedCell.col === colIdx;
            const selectedPrimary = selectedRow && selectedCol;
            const selectedSecondary =
              !selectedPrimary &&
              (selectedCell.row === rowIdx || selectedCell.col === colIdx);
            const selectedTertiary =
              !selectedPrimary && selectedCell.val === cell.val;
            return {
              ...cell,
              selectedPrimary,
              selectedSecondary,
              selectedTertiary,
            };
          }),
        }))
      ),
    [selectedCell]
  );

  // Register event listener for keystrokes
  useEffect(() => {
    const listener = (e) => {
      const isDelete = e.key === "Backspace" || e.key === "Delete";
      const isNumber = /^[1-9]$/i.test(e.key);
      if ((!isDelete && !isNumber) || selectedCell.id === null) {
        return;
      }
      const val = isDelete ? " " : e.key;
      setGridData((gridData) =>
        gridData.map(({ row, ...rowData }) => ({
          ...rowData,
          row: row.map((cell) =>
            cell.selectedPrimary ? { ...cell, val } : cell
          ),
        }))
      );
    };
    document.addEventListener("keyup", listener);
    return () => document.removeEventListener("keyup", listener);
  }, [selectedCell]);

  // Convert board data into table data elements
  const gridElements = gridData.map(({ id, row }, rowIdx) => (
    <tr key={id}>
      {row.map(
        (
          {
            id,
            val,
            selectedPrimary,
            selectedSecondary,
            selectedTertiary,
            permanent,
          },
          colIdx
        ) => {
          const classes = [
            selectedPrimary ? "selected-primary" : "",
            selectedSecondary ? "selected-secondary" : "",
            selectedTertiary ? "selected-tertiary" : "",
            permanent ? "permanent" : "",
          ].join(" ");
          return (
            <td
              key={id}
              className={classes}
              onClick={() => selectCell(id, rowIdx, colIdx, val)}
            >
              {val}
            </td>
          );
        }
      )}
    </tr>
  ));

  return (
    <>
      <main className="sudoku">
        <table>
          <colgroup>
            <col />
            <col />
            <col />
          </colgroup>
          <colgroup>
            <col />
            <col />
            <col />
          </colgroup>
          <colgroup>
            <col />
            <col />
            <col />
          </colgroup>
          <tbody>{gridElements.slice(0, 3)}</tbody>
          <tbody>{gridElements.slice(3, 6)}</tbody>
          <tbody>{gridElements.slice(6, 9)}</tbody>
        </table>
      </main>
    </>
  );
}

Sudoku.propTypes = {
  newGameRequested: PropTypes.bool,
  setNewGameRequested: PropTypes.func,
};

export default Sudoku;
