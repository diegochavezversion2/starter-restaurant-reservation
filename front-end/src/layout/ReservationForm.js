import React from "react";

function ReservationForm({ handleChange, handleSubmit, handleCancel, formData }) {
    
    return (
        <form onSubmit={handleSubmit}>
                <label htmlFor="first_name">First Name
                    <input id="first_name" name="first_name" type="text" onChange={handleChange} value={formData.first_name}/>
                </label>
                <label htmlFor="last_name">Last Name
                    <input id="last_name" name="last_name" type="text" onChange={handleChange} value={formData.last_name}/>
                </label>
                <label htmlFor="mobile_number">Mobile Number
                    <input id="mobile_number" name="mobile_number" type="text" placeholder="xxx-xxx-xxxx" onChange={handleChange} value={formData.mobile_number}/>
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