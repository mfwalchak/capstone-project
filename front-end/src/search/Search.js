import React, { useEffect, useState } from "react";
import { findReservation } from "../utils/api";
//display a search box with the attribute <input name="mobile_number" />
//search box has placeholder text "Enter a customer's phone number"
//display a "Find" button
//clicking on Find submits a GET request like /reservations?mobile_number=800-555-1212
//system displays ALL reservations with the matching phone number, status does not apply
//display "No reservations found" if there are no matches

export default function Search() {
    const [ query, setQuery ] = useState("");
    const [ matchingReservations, setMatchingReservations ] = useState([]);
    const [ error, setError ] = useState(null);

    //handle the display logic in the same way we filter the reservations list on the dashboard
    //display based on mobile_number rather than newDate

    //useEffect(loadSearchResults, []);

    function loadSearchResults() {
      //console.log("*******loadDash********", newDate);
      const abortController = new AbortController();
      setError(null);
      findReservation({ mobile_number: query }, abortController.signal)
        //console.log("***********listReservationsNewDate***********", newDate)
        .then(setMatchingReservations)
        .catch(setError);
        
      return () => abortController.abort();
    }

    function DisplayMatchingReservations(){
        let count = 1;
        if (matchingReservations.length > 0) {
        return matchingReservations.map((reservation) => {
      const { first_name, last_name, reservation_date, reservation_time, people, mobile_number, reservation_id, status } = reservation;
            return(
            <tr>
                <th scope="row">{count++}</th>
                <td>
                  {last_name}, {first_name}
                </td>
                <td>{reservation_date}</td>
                <td>{reservation_time}</td>
                <td>{people}</td>
                <td>{mobile_number}</td>
                <td data-reservation-id-status={reservation_id}>{status}</td>
                {status === "booked" ? <a className="btn btn-primary" href={`/reservations/${reservation_id}/seat`}>SEAT</a> : null }
              </tr>
            )
        })
    } else {
        return (
            <p>No reservations found</p>
        )
    }
}


    return (
        <>
        <div>
            <input name="mobile_number" placeholder="Enter a customer's phone number" onChange={(evt) => setQuery(evt.target.value)} />
            <button onClick={loadSearchResults}>Find</button>
        </div>
        <div>
            <DisplayMatchingReservations />
        </div>
        </>
    )
}