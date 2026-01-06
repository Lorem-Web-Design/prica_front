import { useEffect, useState } from "react";
import Grid from "../components/grid";
import { ElementFromQuery } from "../@types/elementTypes";
import FROM_QUERY_ELEMENT from "../data/mock.element.json";

const STORAGE_KEY = "stock-history";

export default function StockList() {
  const [elementInfo, setElementInfo] = useState<ElementFromQuery>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? (JSON.parse(saved) as ElementFromQuery)
      : (FROM_QUERY_ELEMENT as ElementFromQuery);
  });

  const [editingCell, setEditingCell] = useState<{
    index: number;
    field: "stock" | "location";
  } | null>(null);

  const updateHistory = (
    index: number,
    field: "stock" | "location",
    value: string | number
  ) => {
    setElementInfo((prev) => {
      const newHistory = [...prev.history];
      newHistory[index] = {
        ...newHistory[index],
        [field]: value,
      };

      return {
        ...prev,
        history: newHistory,
      };
    });
  };

  // 💾 Guardar automáticamente en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(elementInfo));
  }, [elementInfo]);

  return (
    <Grid gap={12} def={1} sm={1} md={1} lg={1}>
      <h2>Historial del elemento</h2>

      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Ubicación</th>
          </tr>
        </thead>

        <tbody>
          {elementInfo.history.length === 0 ? (
            <tr>
              <td colSpan={2}>Este elemento aún no tiene un historial</td>
            </tr>
          ) : (
            elementInfo.history.map((history: any, index: number) => (
              <tr key={index}>
                <td
                  onClick={() => setEditingCell({ index, field: "stock" })}
                  style={{ cursor: "pointer" }}
                >
                  {editingCell?.index === index &&
                  editingCell.field === "stock" ? (
                    <input
                      autoFocus
                      type="number"
                      value={history.stock}
                      onChange={(e) =>
                        updateHistory(index, "stock", Number(e.target.value))
                      }
                      onBlur={() => setEditingCell(null)}
                    />
                  ) : (
                    history.stock
                  )}
                </td>

                <td
                  onClick={() => setEditingCell({ index, field: "location" })}
                  style={{ cursor: "pointer" }}
                >
                  {editingCell?.index === index &&
                  editingCell.field === "location" ? (
                    <input
                      autoFocus
                      value={history.location}
                      onChange={(e) =>
                        updateHistory(index, "location", e.target.value)
                      }
                      onBlur={() => setEditingCell(null)}
                    />
                  ) : (
                    history.location
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Grid>
  );
}
