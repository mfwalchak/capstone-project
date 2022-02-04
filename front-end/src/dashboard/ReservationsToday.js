import React from "react";
import { Link } from "react-router-dom";
import CancelButton from "./CancelButton";

export default function ReservationsToday({reservations, formatPhoneNumber, handleReservationCancellation}) {

    
    let count = 1;
    return reservations.map((reservation) => {
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
      if (status !== "finished") {
        return (
          <tr key={reservation_id}>
            <th scope="row">{count++}</th>
            <td>
              {last_name}, {first_name}
            </td>
            <td>{reservation_date}</td>
            <td>{reservation_time}</td>
            <td>{people}</td>
            <td>{formatPhoneNumber(mobile_number)}</td>
            <td data-reservation-id-status={reservation_id}>{status}</td>
            <td>{status === "booked" ? <Link to={`/reservations/${reservation_id}/seat`} className="btn btn-primary">SEAT</Link> : null}</td>
            <td><Link to={`/reservations/${reservation_id}/edit`} className="btn btn-primary">
                 EDIT
             </Link></td>
             <td><CancelButton reservation_id={reservation_id} handleReservationCancellation={handleReservationCancellation} /></td>
          </tr>
        );
      }
      return null;
    });
  }