import React, {useState} from "react";
import { finishTable, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import {useHistory} from "react-router-dom";
import {previous, next, today} from "../utils/date-time"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({reservationsError, reservations, showTables, tablesError, date, loadTables, loadReservations }) {
  const [deleteError, setDeleteError] = useState(null)
  const history = useHistory();


  const reservationRows = reservations.map(({reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status}) => (
    <tr key={reservation_id}>
      <th scope="row">{reservation_id}</th>
      <td>{first_name}</td>
      <td>{last_name}</td>
      <td>{mobile_number}</td>
      <td>{reservation_date}</td>
      <td>{reservation_time}</td>
      <td>{people}</td>
      <td data-reservation-id-status={reservation_id}>{status}</td>
      <td>
        {status === "booked"? <a className="btn btn-primary" href={`/reservations/${reservation_id}/seat`} >Seat</a>: null}    
      </td>
      <td>
        <a href={`/reservations/${reservation_id}/edit`} >Edit</a>    
      </td>
      <td>
        <button data-reservation-id-cancel={reservation_id} onClick={() => handleCancelReservation(reservation_id)} >Cancel</button>    
      </td>
    </tr>
  ));
  const tableRows = showTables.map((table) => (
    <tr key={table.table_id}>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={`${table.table_id}`} >{table.reservation_id === null ? "Free" : "Occupied"}</td> 
      <td>
        {table.reservation_id === null ? null : <button data-table-id-finish={`${table.table_id}`} onClick={() => handleDelete(table.table_id)}>Finish</button>}
      </td>    
    </tr>
  ));

  async function handleCancelReservation(reservation_id) {
    if(window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
        const abortController = new AbortController();
        updateStatus(reservation_id, "cancelled", abortController.signal)
        .then(loadTables)
        .then(loadReservations)
        .catch((error) => setDeleteError(error));
    }
  }

  async function handleDelete(table_id) {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      const abortController = new AbortController();
      finishTable(table_id, abortController.signal).then(loadTables).then(loadReservations)
      .catch((error) => setDeleteError(error));
    }
  }

  const previousHandler = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${previous(date)}`)
  }

  const todayHandler = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${today()}`);
  }

  const nextHandler = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${next(date)}`)
  }


  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div>
        <button className="btn btn-primary" onClick={previousHandler}>Previous</button>
        <button className="btn btn-primary" onClick={nextHandler}>Next</button>
        <button className="btn btn-primary" onClick={todayHandler}>Today</button>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <ErrorAlert error={deleteError} />
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
              <th scope="col">Link</th>
              <th scope="col">Edit</th>
              <th scope="col">Cancel</th>
            </tr>
          </thead>
          <tbody>
            {reservationRows}
          </tbody>
        </table>
      </div>
      <div>
        <table className="table">
          <thead>
            <tr class="table-success">
              <th scope="col">Table ID</th>
              <th scope="col">Table Name</th>
              <th scope="col">Capacity</th>
              <th scope="col">Availability</th>
              <th scope="col">Clear</th>
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div> 
    </main>
  );
}

export default Dashboard;
