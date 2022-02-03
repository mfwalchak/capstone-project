import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import createTable from "../utils/api";

//render form to create a new table
function NewTable({ reservation_date, reservation_id, partySize }) {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [newTable, setNewTable] = useState({
    table_name: "",
    capacity: "",
  });

  //handle form changes and submission
  function handleTableChange(evt) {
    const value = evt.target.value;
    setNewTable({ ...newTable, [evt.target.name]: value });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    newTable.capacity = Number(newTable.capacity);
    createTable(newTable)
      .then(() => {
        history.push("/dashboard");
      })
      .catch(setError);
  }
  function handleCancel(evt) {
    evt.preventDefault();
    history.goBack();
  }

  return (
    <form key={newTable.table_id}>
      <label>
        Table #
        <input
          type="text"
          name="table_name"
          value={newTable.table_name}
          onChange={handleTableChange}
        />
      </label>
      <label>
        Capacity
        <input
          type="number"
          name="capacity"
          min="1"
          value={newTable.capacity}
          onChange={handleTableChange}
        />
      </label>
      <ErrorAlert error={error} />
      <button
        type="submit"
        className="btn btn-primary"
        value="submit"
        onClick={handleSubmit}
      >
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
  );
}

export default NewTable;
