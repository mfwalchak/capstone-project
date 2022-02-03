import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";

//render a form to set initial reservation data
function ReservationForm() {
  const [error, setError] = useState(null);
  const history = useHistory();
  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "booked",
  });
  const reservationObject = reservation;

  //handle changes to form and submission event
  function handleChange(evt) {
    const value = evt.target.value;
    setReservation({ ...reservation, [evt.target.name]: value });
  }
  function handleNumberChange(evt) {
    const value = evt.target.value;
    setReservation({ ...reservation, [evt.target.name]: Number(value) });
  }
  function handleSubmit(evt) {
    evt.preventDefault();
    createReservation(reservationObject)
      .then(() => {
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      })
      .catch(setError);
  }
  function handleCancel(evt) {
    evt.preventDefault();
    history.goBack();
  }

  return (
    <div>
      <form>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={reservation.first_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={reservation.last_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Mobile Number:
          <input
            type="text"
            name="mobile_number"
            value={reservation.mobile_number}
            onChange={handleChange}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="reservation_date"
            value={reservation.reservation_date}
            onChange={handleChange}
          />
        </label>
        <label>
          Time:
          <input
            type="time"
            name="reservation_time"
            value={reservation.reservation_time}
            onChange={handleChange}
          />
        </label>
        <label>
          Party Size:
          <input
            type="text"
            id="people"
            name="people"
            value={reservation.people}
            onChange={handleNumberChange}
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
    </div>
  );
}

export default ReservationForm;
export { createReservation };
