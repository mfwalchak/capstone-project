import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { seatTable } from "../utils/api";

export default function SeatReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [error, setError] = useState(null);
  const [selectTable, setSelectTable] = useState({});
  const [tables, setTables] = useState([]);
  const [tableIdentifier, setTableIdentifier] = useState({});

  //handle seat button submission, PUT API request to table with reservation id
  function handleSubmit(evt) {
    const abortController = new AbortController();
    evt.preventDefault();
    selectTable.reservation_id = reservation_id;
    seatTable(selectTable, abortController.signal)
      .then(() => {
        history.push("/dashboard");
      })
      .catch(setError);
    return () => abortController.abort();
  }

  function handleCancel(evt) {
    evt.preventDefault();
    history.goBack();
  }

  function handleSelect(evt) {
    setTableIdentifier(evt.target.value);
    setSelectTable(JSON.parse(evt.target.value));
  }

  //GET API call to render tables only once upon page load
  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    listTables(abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }, []);

  //populate the dropdown list with tables
  function SelectTable() {
    return tables.map((table) => {
      return (
        <option key={table.table_id} value={JSON.stringify(table)}>
          {table.table_name} - {table.capacity}
        </option>
      );
    });
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <select name="table_id" value={tableIdentifier} onChange={handleSelect}>
          <option>Select a Table</option>
          <SelectTable />
        </select>
        <button type="submit" className="btn btn-primary" value="submit">
          Submit
        </button>
        <button
          type="cancel"
          className="btn btn-primary"
          value="cancel"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
      <ErrorAlert error={error} />
    </>
  );
}
