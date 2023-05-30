import React, {useEffect} from "react";
import { tooEarlyOrTooLate, notOnTuesday, notOnPreviousDate } from "./FrontEndValidations";

function ReservationForm({ handleChange, handleSubmit, handleCancel, formData, setFrontEndError }) {
    // function handleSubmit(event) {
    //     event.preventDefault()
    //     console.log("HANDLE SUBMIT")
    // }

    // function validateForm() {
    //     console.log("validate form")
    //     setFrontEndError([])
    //     const frontEndValidations = []
    //     if (notOnPreviousDate(formData.reservation_date)) {
    //         frontEndValidations.push({id: 1, message: "Cannot make reservation that occurs in the past"})
    //     }
    //     if (notOnTuesday(formData.reservation_date)) {
    //         frontEndValidations.push({id: 2, message: "Cannot make reservation on a Tuesday"})
    //     }
    //     if (tooEarlyOrTooLate(formData.reservation_date, formData.reservation_time)) {
    //         frontEndValidations.push({id: 3, message: "Cannot make reservation for a bad time."})
    //     }
    //     if (frontEndValidations.length) {
    //         setFrontEndError(frontEndValidations);
    //         return
    //     }
    // }

    // useEffect(() => {
    //     validateForm()
    // }, [formData])
    
    return (
        <form onSubmit={handleSubmit}>
                <label htmlFor="first_name">First Name
                    <input id="first_name" name="first_name" type="text" onChange={handleChange} value={formData.first_name}/>
                </label>
                <label htmlFor="last_name">Last Name
                    <input id="last_name" name="last_name" type="text" onChange={handleChange} value={formData.last_name}/>
                </label>
                <label htmlFor="mobile_number">Mobile Number
                    <input id="mobile_number" name="mobile_number" type="text" pattern="\d{3}[\-]\d{3}[\-]\d{4}" placeholder="xxx-xxx-xxxx" onChange={handleChange} value={formData.mobile_number}/>
                </label>
                <label htmlFor="reservation_date">Reservation Date
                    <input id="reservation_date" name="reservation_date" type="date" onChange={handleChange} value={formData.reservation_date}/>
                </label>
                <label htmlFor="reservation_time">Reservation Time
                    <input id="reservation_time" name="reservation_time" type="time" onChange={handleChange} value={formData.reservation_time}/>
                </label>
                <label htmlFor="people">People
                    <input id="people" name="people" type="number" min="1" onChange={handleChange} value={formData.people}/>
                </label>
                <button className="btn btn-primary" onClick={handleCancel}>Cancel</button>
                <button className="btn btn-primary" type="submit">Submit</button>
        </form>
    )
}

export default ReservationForm;