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
          .map(() => ({ id: nanoid(), val: " " })),
      }))
  );

  console.log(gridData);

  const gridElements = gridData.map(({ id, row }) => (
    <tr key={id}>
      {row.map(({ id, val }) => (
        <td key={id}>{val}</td>
      ))}
    </tr>
  ));

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
            .map(({ id }, j) => ({
              id,
              val: data[i][j],
            }))
            .map(({ id, val }) => ({ id, val: val === 0 ? " " : `${val}` })),
        }))
      );
    })();
  }, []);

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
