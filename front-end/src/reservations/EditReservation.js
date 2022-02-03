import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  findReservation,
  updateReservation,
  createReservation,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function EditReservation() {
  const [error, setError] = useState(null);
  const [reservationForm, setReservationForm] = useState({});
  const { reservation_id } = useParams();
  const history = useHistory();

  //change handlers for reservation form
  function handleChange(evt) {
    const value = evt.target.value;
    setReservationForm({ ...reservationForm, [evt.target.name]: value });
  }
  function handleNumberChange(evt) {
    const value = evt.target.value;
    setReservationForm({
      ...reservationForm,
      [evt.target.name]: Number(value),
    });
  }
  function handleCancel(evt) {
    evt.preventDefault();
    history.goBack();
  }

  //if reservation is being updated PUT API request
  //if reservation does not exist this page has been reached directly in the url, create a new reservation
  function handleSubmit(evt) {
    evt.preventDefault();
    if (reservation_id) {
      updateReservation(reservationForm)
        .then(() => {
          history.push(`/dashboard?date=${reservationForm.reservation_date}`);
        })
        .catch(setError);
    } else {
      createReservation(reservationForm)
        .then(() => {
          history.push(`/dashboard?date=${reservationForm.reservation_date}`);
        })
        .catch(setError);
    }
  }

  //re-render whenever the reservation_id changes, displaying that reservation's current data
  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    if (reservation_id) {
      findReservation(reservation_id, abortController.signal)
        .then(setReservationForm)
        .catch(setError);
      return () => abortController.abort();
    }
  }, [reservation_id]);

  return (
    <div>
      <form>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={reservationForm.first_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={reservationForm.last_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Mobile Number:
          <input
            type="text"
            name="mobile_number"
            value={reservationForm.mobile_number}
            onChange={handleChange}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="reservation_date"
            value={reservationForm.reservation_date}
            onChange={handleChange}
          />
        </label>
        <label>
          Time:
          <input
            type="time"
            name="reservation_time"
            value={reservationForm.reservation_time}
            onChange={handleChange}
          />
        </label>
        <label>
          Party Size:
          <input
            type="text"
            id="people"
            name="people"
            value={reservationForm.people}
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
