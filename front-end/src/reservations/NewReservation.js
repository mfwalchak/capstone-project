import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationForm() {
    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        mobileNum: "", //controlled input 10 digits
        date: "", //assign default value of current date
        time: "", //controlled input 
        party: "",
    })
    const { register } = useForm(); //register is a callback that returns props for validation
    const onSubmit = data;
  
    function handleChange(evt) {
        const value = evt.target.value;
        setState({...state, [evt.target.name]: value});
    }
  
    function handleSubmit(evt) {
      alert(`A new reservation was submitted for ` + state.lastName + `, party of ` + state.party);
      evt.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>6
              First Name:
              <input {...register("firstName")} type="text" name="firstName" value={state.firstName} onChange={handleChange} />
            </label>
            <label>
              Last Name:
              <input {...register("lastName")} type="text" name="lastName" value={state.lastName} onChange={handleChange} />
            </label>
            <label>
              Mobile Number:
              <input type="text" name="mobileNum" value={state.mobileNum} onChange={handleChange} />
            </label>
            <label>
              Date:
              <input type="text" name="date" value={state.date} onChange={handleChange} />
            </label>
            <label>
              Time:
              <input type="text" name="time" value={state.time} onChange={handleChange} />
            </label>
            <label>
              Party Size:
              <input type="text" name="party" value={state.party} onChange={handleChange} />
            </label>
            <input type="submit" value="Submit" />
        </form>
    )
}




export default ReservationForm;