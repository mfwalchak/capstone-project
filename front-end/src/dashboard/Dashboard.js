import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { today, previous, next } from "../utils/date-time";
import FloorMap from "./Floormap";
import { listTables } from "../utils/api";

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
  const [tables, setTables] = useState([])

  useEffect(loadDashboard, [newDate]);

  function loadDashboard() {
    //console.log("*******loadDash********", newDate);
    const abortController = new AbortController();
    setError(null);
    listReservations({ date: newDate }, abortController.signal)
      //console.log("***********listReservationsNewDate***********", newDate)
      .then(setReservations)
      .catch(setError);
      
    return () => abortController.abort();
  }

  //console.log(reservations);

  function dateHandler(evt) {
    evt.preventDefault();
    console.log(evt.target.id);
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

  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
  }

  function ReservationsToday() {
    let count = 1;
    return reservations.map((reservation) => {
      const { first_name, last_name, reservation_date, reservation_time, people, mobile_number, reservation_id } = reservation;
      return (
        <tr>
          <th scope="row">{count++}</th>
          <td>
            {last_name}, {first_name}
          </td>
          <td>{reservation_date}</td>
          <td>{reservation_time}</td>
          <td>{people}</td>
          <td>{formatPhoneNumber(mobile_number)}</td>
          <a
            className="btn btn-primary"
            href={`/reservations/${reservation_id}/seat`}
          >
            SEAT
          </a>
        </tr>
      );
    });
  }

  // const [tableNameError, setTableNameError] = useState();
  // const [tableNames, setTableNames] = useState({
  //   table_name: "",
  //   reservation_id: "",
  // });
  // useEffect(LoadFloorMap, [newDate]);

  // function LoadFloorMap() {
  //   const abortController = new AbortController();
  //   setError(null);
  //   listTables()
  //     .then(setTables)
  //     .catch(setError);
  //   return () => abortController.abort();
  // }



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
      {/* <div>
        <NewTable
          reservation_date={reservations.reservation_date}
          reservation_id={reservations.reservation_id}
          partySize={reservations.people}
        />
      </div> */}
      <ErrorAlert error={error} date={newDate} />
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Res_ID</th>
            <th scope="col">Name</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Party Size</th>
            <th scope="col">Mobile</th>
          </tr>
        </thead>
        <tbody>
          <ReservationsToday />
        </tbody>
      </table>
      <div>
        <FloorMap />
      </div>
      {/* {JSON.stringify(reservations)} */}
    </main>
  );
}

export default Dashboard;

// //************************************************************************ */
// import React, { useEffect, useState } from "react";
// import { listReservations } from "../utils/api";
// import ErrorAlert from "../layout/ErrorAlert";

// /**
//  * Defines the dashboard page.
//  * @param date
//  *  the date for which the user wants to view reservations.
//  * @returns {JSX.Element}
//  */
// function Dashboard({ date }) {
//   const [reservations, setReservations] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(loadDashboard, [date]);

//   function loadDashboard() {
//     const abortController = new AbortController();
//     setError(null);
//     listReservations({ date }, abortController.signal)
//       .then(setReservations)
//       .catch(setError);
//     return () => abortController.abort();
//   }

//   return (
//     <main>
//       <h1>Dashboard</h1>
//       <div className="d-md-flex mb-3">
//         <h4 className="mb-0">Reservations for date</h4>
//       </div>
//       <ErrorAlert error={error} />
//       {JSON.stringify(reservations)}
//     </main>
//   );
// }

// export default Dashboard;
