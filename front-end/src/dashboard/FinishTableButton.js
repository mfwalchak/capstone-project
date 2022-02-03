import React, { useState } from "react";
import { clearTable } from "../utils/api";

//component renders "finish" button upon table being seated, with functionaltiy to clear the table
export default function FinishTableButton({
  table_id,
  reservation_id,
  setResoStatus,
  setClearedState,
}) {
  const [error, setError] = useState(null);
  const params = { table_id, reservation_id };
  function handleClick() {
    const finish = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (finish) {
      const abortController = new AbortController();
      setError(null);
      clearTable(params, abortController.signal)
        .then(setClearedState)
        .then(setResoStatus)
        .catch(setError);
    } else {
      //do nothing
    }
  }
  //if table is seated with a valid reservation_id render the button
  if (reservation_id) {
    return (
      <button type="" data-table-id-finish={table_id} onClick={handleClick}>
        Finish
      </button>
    );
  }
  return null;
}
