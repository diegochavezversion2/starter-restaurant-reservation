import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import { listReservations, updateStatus } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function Search() {
    const initialPhoneData = {
        mobile_number: "",
    }

    const [phoneData, setPhoneData] = useState(initialPhoneData);
    const [error, setError] = useState(null);
    const [notFoundMessage, setNotFoundMessage] = useState(null);
    const [searchedReservations, setSearchedReservations] = useState([])
    const history = useHistory();

    async function handleSubmit(event) {
        event.preventDefault();
        setSearchedReservations([])
        setError(null)
        setNotFoundMessage(null)
        const abortController = new AbortController();
        listReservations(phoneData, abortController.signal).then((data) => {
            if (data.length === 0) {
                setNotFoundMessage('No reservations found')
            }
            setSearchedReservations(data);
        })
        .catch((error) => {
            setError(error);
        })
    }

    function handleChange({ target: { name, value}}) {
        setPhoneData((previousPhoneData) => ({
            ...previousPhoneData,
            [name]: value,
        }));
    }

    function handleCancel(event) {
        history.goBack();
    }

    async function handleCancelReservation(reservation_id) {
        if(window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            const abortController = new AbortController();
            updateStatus(reservation_id, "cancelled", abortController.signal)
            .catch((error) => setError(error));
        }
      }

    const reservationRows = searchedReservations.map((reservation) => (
        <tr key={reservation.reservation_id}>
          <th scope="row">{reservation.reservation_id}</th>
          <td>{reservation.first_name}</td>
          <td>{reservation.last_name}</td>
          <td>{reservation.mobile_number}</td>
          <td>{reservation.reservation_date}</td>
          <td>{reservation.reservation_time}</td>
          <td>{reservation.people}</td>
          <td data-reservation-id-status={reservation.reservation_id} >{reservation.status}</td>
          <td>
            <a href={`/reservations/${reservation.reservation_id}/edit`} >Edit</a>    
          </td>
          <td>
            <button data-reservation-id-cancel={reservation.reservation_id} onClick={() => handleCancelReservation(reservation.reservation_id)} >Cancel</button>    
          </td>
        </tr>
    ));

    return (
        <div>
            <div>
                <h1>Search By Phone</h1>
                <ErrorAlert error={error} />
                <form onSubmit={handleSubmit}>
                    <lable htmlFor="mobile_number">Mobile Number
                        <input required name="mobile_number" id="mobile_number" onChange={handleChange}>
                        </input>
                    </lable>
                    <button className="btn btn-primary" onClick={handleCancel}>Cancel</button>
                    <button className="btn btn-primary" type="submit">Find</button>
                </form>
            </div>
            {notFoundMessage === null ? null : <h3>{notFoundMessage}</h3>}
            <div>
                <table className="table">
                    <thead>
                        <tr class="table-success" >
                        <th scope="col">Reservation #</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                        <th scope="col">Party Size</th>
                        <th scope="col">Status</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Cancel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservationRows}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Search;