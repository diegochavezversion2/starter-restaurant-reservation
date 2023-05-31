import React, {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function EditReservation() {
    const {reservationId} = useParams();
    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
    }
    const [reservation, setReservation] = useState({
        ...initialFormData
    });
    const [error, setError] = useState(null);
    const history = useHistory();
    
    useEffect(() => {
        const abortController = new AbortController();
        setError(null);
        readReservation(reservationId, abortController.signal)
          .then(setReservation)
          .catch(setError);
    
        return () => abortController.abort();
    }, [reservationId]);



    async function handleSubmit(event) {
        event.preventDefault();
        reservation.people = Number(reservation.people)
        const abortController = new AbortController();
        if (reservation.status !== "booked") {
            return
        }
        updateReservation(reservationId, reservation, abortController.signal).then(() => {
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch((error) => setError(error));
    }

    function handleChange({ target: { name, value}}) {
        setReservation((previousFormData) => ({
            ...previousFormData,
            [name]: value,
        }));
    }

    function handleCancel(event) {
        history.goBack();
    }

    return (
        <div>
            <h1>Edit Reservation</h1>
            <ErrorAlert error={error} />
            <ReservationForm handleChange={handleChange} handleSubmit={handleSubmit} handleCancel={handleCancel} formData={reservation} />
        </div>
    )
}

export default EditReservation;