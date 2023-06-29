import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

function Sudoku() {
  const [gridData, setGridData] = useState(
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
  });

  // Fetch a board after page load
  useEffect(() => {
    (async () => {
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
            .map((cell) => ({
              ...cell,
              val: cell.val === 0 ? " " : `${cell.val}`,
            })),
        }))
      );
    })();
  }, []);

  function selectCell(id, row, col) {
    setSelectedCell({ id, row, col });
  }

  useEffect(
    () =>
      setGridData((gridData) =>
        gridData.map(({ row, ...rowData }, rowIdx) => ({
          ...rowData,
          row: row.map((cell, colIdx) => {
            const selectedRow = selectedCell.row === rowIdx;
            const selectedCol = selectedCell.col === colIdx;
            const selected = selectedRow && selectedCol;
            return {
              ...cell,
              selectedRow,
              selectedCol,
              selected,
            };
          }),
        }))
      ),
    [selectedCell]
  );

  // Convert board data into table data elements
  const gridElements = gridData.map(({ id, row }, rowIdx) => (
    <tr key={id}>
      {row.map(({ id, val, selected, selectedRow, selectedCol }, colIdx) => {
        const selectedClass = selected ? "selected" : "";
        const selectedRowClass = selectedRow ? "selected-row" : "";
        const selectedColClass = selectedCol ? "selected-col" : "";
        return (
          <td
            key={id}
            className={`${selectedClass} ${selectedRowClass} ${selectedColClass}`}
            onClick={() => selectCell(id, rowIdx, colIdx)}
          >
            {val}
          </td>
        );
      })}
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

export default Sudoku;
