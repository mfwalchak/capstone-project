import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { today, previous, next } from "../utils/date-time";
import FloorMap from "./Floormap";
import { useHistory } from "react-router-dom";
import { cancelReso } from "../utils/api";
import ReservationsToday from "./ReservationsToday"

//import { useParams } from "react-router-dom";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const query = useQuery();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [newDate, setNewDate] = useState(query.get("date") || date);
  const [resoStatus, setResoStatus] = useState("");
  const history = useHistory();

  //reload dashboard elements when date or reservation status changes
  useEffect(loadDashboard, [newDate, resoStatus]);

  function loadDashboard() {
    const abortController = new AbortController();
    setError(null);
    listReservations({ date: newDate }, abortController.signal)
      .then(setReservations)
      .catch(setError);

    return () => abortController.abort();
  }

  //handles prev, next and today button changes
  function dateHandler(evt) {
    evt.preventDefault();
    if (evt.target.id === "today") {
      setNewDate(today);
    }
    if (evt.target.id === "prev") {
      setNewDate(previous);
    }
    if (evt.target.id === "next") {
      setNewDate(next);
    }
  }
  //regex forces phone number digits into correct US formatting for display
  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
  }
  //handler for reservation cancellation, makes DELETE API call and refreshes the page
  async function handleReservationCancellation(reservation_id) {
    const cancellation = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (cancellation) {
      try {
        await cancelReso(reservation_id);
        history.go();
      } catch (error) {
        setError(error);
      }
    }
  }
  //render function lists reservations for the current date
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {newDate}</h4>
      </div>
      <div>
        <button id="prev" onClick={dateHandler}>
          Prev
        </button>
        <button id="today" onClick={dateHandler}>
          Today
        </button>
        <button id="next" onClick={dateHandler}>
          Next
        </button>
      </div>
      <ErrorAlert error={error} date={newDate} />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Res_ID</th>
            <th scope="col">Name</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Party Size</th>
            <th scope="col">Mobile</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <ReservationsToday 
            reservations={reservations}
            formatPhoneNumber={formatPhoneNumber}
            handleReservationCancellation={handleReservationCancellation} />
        </tbody>
      </table>
      <div>
        <ul>
        <FloorMap setResoStatus={setResoStatus} />
        </ul>
      </div>
    </main>
  );
}

export default Dashboard;
