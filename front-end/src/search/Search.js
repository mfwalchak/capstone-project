import React, { useState } from "react";
import { findReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function Search() {
  const [query, setQuery] = useState("");
  const [matchingReservations, setMatchingReservations] = useState([]);
  const [error, setError] = useState(null);

  //API GET call passes in mobile number paramaters
  function loadSearchResults() {
    const abortController = new AbortController();
    setError(null);
    findReservation({ mobile_number: query }, abortController.signal)
      .then(setMatchingReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  //render reservations that match the search by mobile number results
  function DisplayMatchingReservations() {
    let count = 1;
    if (matchingReservations.length > 0) {
      return matchingReservations.map((reservation) => {
        const {
          first_name,
          last_name,
          reservation_date,
          reservation_time,
          people,
          mobile_number,
          reservation_id,
          status,
        } = reservation;
        return (
            <tr key={reservation_id}>
              <th scope="row">{count++}</th>
              <td>
                {last_name}, {first_name}
              </td>
              <td>{reservation_date}</td>
              <td>{reservation_time}</td>
              <td>{people}</td>
              <td>{mobile_number}</td>
              <td data-reservation-id-status={reservation_id}>{status}</td>
            </tr>
        );
      });
    } else {
      return <tr key="not_found"><th>"No reservations found"</th></tr>;
    }
  }

  return (
    <>
      <div>
        <input
          name="mobile_number"
          placeholder="Enter a customer's phone number"
          onChange={(evt) => setQuery(evt.target.value)}
        />
        <button type="submit" onClick={loadSearchResults}>
          Find
        </button>
      </div>
      <div>
        <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">name</th>
            <th scope="col">date</th>
            <th scope="col">time</th>
            <th scope="col">party size</th>
            <th scope="col">mobile</th>
            <th scope="col">status</th>
          </tr>
        </thead>
        <tbody>
        <DisplayMatchingReservations />
        </tbody>
        </table>
      </div>
      <div>
        <ErrorAlert error={error} />
      </div>
    </>
  );
}
