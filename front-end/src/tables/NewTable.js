import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations, seatTable } from "../utils/api";

function NewTable({ reservation_date, reservation_id, partySize }) {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [newTable, setNewTable] = useState({
    table_name: "",
    capacity: "",
  });


    function handleNumberChange(evt){
        const value = evt.target.value;
        setNewTable({...newTable, [evt.target.name]: Number(value)})
    }

  function handleSubmit(evt) {
      console.log("handleSubmit:", reservation_id);
      evt.preventDefault();
      seatTable(newTable)
      .then(() => {
        history.push("/dashboard");
      })
      .catch(setError);
  }
  function handleCancel() {
    history.push("/");
  }

  return (
    <form>
      <label>
        Table #
        <input type="text" name="table_name" value={newTable.table_name} onChange={handleNumberChange} />
      </label>
      <label>
        Capacity
        <input type="number" name="capacity" value={newTable.capacity} onChange={handleNumberChange} />
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
