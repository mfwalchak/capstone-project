import React, { useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
//import { useForm } from "react-hook-form";
import ErrorAlert from "../layout/ErrorAlert";
//import ReservationCreate from "./ReservationCreate";
import { createReservation } from "../utils/api";
import { today } from "../utils/date-time.js";

function ReservationForm() {
    const history = useHistory();
    const [reservation, setReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "", //controlled input 10 digits
        reservation_date: "", //assign default value of current reservation_date
        reservation_time: "", //controlled input 
        people: "",
    })
    const reservationObject = reservation;
    const [ error, setError ] = useState(null);
    // const { register } = useForm(); //register is a callback that returns props for validation
    // const onSubmit = data => console.log(data);
  
    function handleChange(evt) {
        const value = evt.target.value;
        console.log("handleChange:", value);
        setReservation({...reservation, [evt.target.name]: value});
    }
    function handleNumberChange(evt) {
      const value = evt.target.value;
      setReservation({...reservation, [evt.target.name]: Number(value)});
  }
  
    function handleSubmit(evt) {
      //console.log(reservationObject);
      //alert(`A new reservation was submitted for ` + reservation.last_name + `, people of ` + reservation.people);
      evt.preventDefault();
      const day = new Date(`${reservation.reservation_date} ${reservation.reservation_time}`)

      createReservation(reservationObject)
        .then(() =>{
          history.push(`/dashboard?date=${reservation.reservation_date}`)
        })
        .catch(setError);
    }

    function handleCancel(){
      history.push("/");
    }

    return (
        <form>
            <label>
              First Name:
              <input type="text" name="first_name" value={reservation.first_name} onChange={handleChange} />
            </label>
            <label>
              Last Name:
              <input type="text" name="last_name" value={reservation.last_name} onChange={handleChange} />
            </label>
            <label>
              Mobile Number:
              <input type="text" name="mobile_number" value={reservation.mobile_number} onChange={handleChange} />
            </label>
            <label>
              Date:
              <input type="date" name="reservation_date" value={reservation.reservation_date} onChange={handleChange} />
            </label>
            <label>
              Time:
              <input type="time" name="reservation_time" value={reservation.reservation_time} onChange={handleChange} />
            </label>
            <label>
              Party Size:
              <input type="text" id="people" name="people" value={reservation.people} onChange={handleNumberChange} />
            </label>
            <ErrorAlert error={error} />
            <button type="submit" className="btn btn-primary" value="submit" onClick={handleSubmit}>Submit</button>
            <button type="cancel" className="btn btn-primary" value="cancel" onClick={handleCancel}>Cancel</button>

        </form>
    )
}




export default ReservationForm;