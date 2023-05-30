import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {createReservation} from "../utils/api";
import ErrorAlert from "./ErrorAlert";
import ReservationForm from "./ReservationForm";
import { tooEarlyOrTooLate, notOnTuesday, notOnPreviousDate } from "./FrontEndValidations";


function NewReservation() {
    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    }

    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState(null);
    const [frontEndError, setFrontEndError] = useState([]);
    const history = useHistory();
    function handleChange({ target: { name, value}}) {
        setFormData((previousFormData) => ({
            ...previousFormData,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setFrontEndError([])
        const frontEndValidations = []
        if (notOnPreviousDate(formData.reservation_date)) {
            frontEndValidations.push({id: 1, message: "Cannot make reservation that occurs in the past"})
        }
        if (notOnTuesday(formData.reservation_date)) {
            frontEndValidations.push({id: 2, message: "Cannot make reservation on a Tuesday"})
        }
        if (tooEarlyOrTooLate(formData.reservation_date, formData.reservation_time)) {
            frontEndValidations.push({id: 3, message: "Cannot make reservation for a bad time."})
        }
        if (frontEndValidations.length) {
            setFrontEndError(frontEndValidations);
            return
        }
        formData.people = Number(formData.people)
        const abortController = new AbortController();
        createReservation(formData, abortController.signal).then(() => {
            history.push(`/dashboard?date=${formData.reservation_date}`);
        })
        .catch((error) => setError(error));
    }

    function handleCancel(event) {
        history.goBack();
    }

    return (
        <div>
            <h1>Create Reservation</h1>
            <ErrorAlert error={error} />
            {frontEndError.length? 
            <div id="alert-Div" className="alert alert-danger m-2">
                {frontEndError.map((e) => {
                    return <div key={e.id}>{e.message}</div>;
                })}
            </div> : null }
            <ReservationForm handleChange={handleChange} handleSubmit={handleSubmit} handleCancel={handleCancel} formData={formData} />
        </div>
    )
}

export default NewReservation;