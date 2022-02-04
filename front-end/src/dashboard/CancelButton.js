import React from "react";

export default function CancelButton({reservation_id, handleReservationCancellation}) {
  return (
    <button
      type="button"
      data-reservation-id-cancel={reservation_id}
      className="btn btn-danger"
      onClick={() => handleReservationCancellation(reservation_id)}
    >
      CANCEL
    </button>
  );
}
