import { listTables } from "../utils/api";
import React, { useState, useEffect } from "react";
import FinishTableButton from "./FinishTableButton";
import ErrorAlert from "../layout/ErrorAlert";

//renders current tables in the restaurant
function FloorMap({ setResoStatus }) {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [clearedState, setClearedState] = useState(false);
  //re-renders whenever a table's seated status changes
  useEffect(() => {
    setError(null);
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setError);
  }, [clearedState]);

  return tables.map((table) => {
    return (
      <>
        <li key={table.table_id}>
          {`${table.table_name} seats ${table.capacity}`}
          <p data-table-id-status={`${table.table_id}`}>
            {!table.reservation_id ? "Free" : "Occupied"}
            <FinishTableButton
              table_id={table.table_id}
              reservation_id={table.reservation_id}
              setResoStatus={setResoStatus}
              setClearedState={setClearedState}
            />
          </p>
        </li>
        <ErrorAlert error={error} />
      </>
    );
  });
}

export default FloorMap;
