//file path: reservations/:resrvation_id/seat

import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { seatTable } from "../utils/api";
//contains a dropdown ordered by table number with the form <select name="table_id" />
//do not seat a reservation party larger than the table's capacity - filter out at this level?
//submit button assigns the selected table to the reservation
//PUT request to /tables/:table_id/seat to save the table assignment, body containing
//{ data: { reservation_id: x } }.
//cancel button returns user to the previous page

export default function SeatReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [error, setError] = useState(null);
  //const [error, setError] = useState(null);
  const [selectTable, setSelectTable] = useState({});
  const [tables, setTables] = useState([]);
  const [tableIdentifier, setTableIdentifier] = useState({});
  //creates a shallow copy of selectTable to update reservation_id
  //refactor this and pass down the TABLE SET STATE FROM THE PARENT COMPONENT TO MODIFY DIRECTLY
  //let selectTableClone = JSON.parse(JSON.stringify(selectTable));

  function handleSubmit(evt) {
    const abortController = new AbortController();
    evt.preventDefault();
    //console.log(`seatTable resId: ${reservation_id} tableId:${selectTable.table_id}`);
    selectTable.reservation_id = reservation_id;
    //console.log("selectTablePassedIntoAPI", selectTable);
    console.log("selectTableTO API", selectTable)
    //console.log("useParams", reservation_id); //this pulls the reservation id
    // async function seatTable(reservation_id, table_id){
    seatTable( selectTable, abortController.signal)
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

  //state update is one step behind
  function handleSelect(evt) {
    //vt.preventDefault();
    //set the currently selected table
    console.log(
      "selectTable",
        selectTable,
      "selectTargetValue:",
        evt.target.value
    );
    //setSelectTable({[evt.target.name]: evt.target.value });
    setTableIdentifier(evt.target.value);
    setSelectTable(JSON.parse(evt.target.value));
    //console.log("selectTable state after selectOnChange:", selectTable);
  }

  //calls the list of tables for the initial render
  //if a table has a reservation_id strikethrough/gray out/something
  useEffect(() => {
    //makes an api call to list the restaurant tables
    //returns an array "tables" where each index is an object "table" with key:value pairs table_id: x, table_name: x, capacity: x, and reservation_id: x
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
