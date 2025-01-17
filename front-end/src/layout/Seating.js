import React, {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {updateAvailability, readReservation, listTables} from "../utils/api";
import ErrorAlert from "./ErrorAlert";
import { tableDoesNotExists, reservationDoesNotExist, tableIsNotBigEnough, tableIsOccupied } from "./FrontEndValidations";

function Seating() {
    const {reservationId} = useParams();
    const [tables, setTables] = useState([])
    const [tablesError, setTablesError] = useState(null);
    const [tableId, setTableId] = useState();
    const [reservation, setReservation] = useState({});
    const [error, setError] = useState(null);
    const [frontEndError, setFrontEndError] = useState([]);


    useEffect(() => {
        const abortController = new AbortController();
        setError(null);
        readReservation(reservationId, abortController.signal)
          .then(setReservation)
          .catch(setError);
    
        return () => abortController.abort();
    }, [reservationId]);

    useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(data => setTables(data))
      .catch(setTablesError)
    return () => abortController.abort();
  }


    const history = useHistory();

    const tableRows = tables.map((table) => (
        <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
    ));

    function handleChange(event) {
        setTableId(Number(event.target.value))
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setFrontEndError([])
        setError(null);
        const tableSelect = tables.find(
            (table) => Number(table.table_id) === Number(tableId)
        );
        const validations = [];
        if (tableDoesNotExists(tableSelect.table_id)) {
            validations.push({id: 4, message: "Table does not exist."})
        }
        if (reservationDoesNotExist(reservation.reservation_id)) {
            validations.push({id: 5, message: "Reservation does not exist."})
        }
        if (tableIsOccupied(tableSelect.reservation_id)) {
            validations.push({id: 6, message: "Table is occupied."})
        }
        if (tableIsNotBigEnough(reservation.people, tableSelect.capacity)) {
            validations.push({id: 7, message: "Table is not big enough."})
        }
        if (validations.length) {
            setFrontEndError(validations);
            return
        }
        const abortController = new AbortController();
        updateAvailability(reservationId, tableId, abortController.signal).then(() => {
            history.push(`/dashboard?date=${reservation.reservation_date}`)
        })
        .catch((error) => setError(error))
    }

    function handleCancel(event) {
        history.goBack();
    }

    return (
        <div>
            <h1>Assign Seating</h1>
            <ErrorAlert className="alert alert-danger" error={error} />
            <ErrorAlert className="alert alert-danger" error={tablesError} />
            {frontEndError.length? 
            <div id="alert-Div" className="alert alert-danger">
                {frontEndError.map((e) => {
                    return <div key={e.id}>{e.message}</div>;
                })}
            </div> : null }
            <form onSubmit={handleSubmit}>
                <lable htmlFor="table_id">Table Name
                    <select required name="table_id" id="table_id" onChange={handleChange}>
                        <option>-- Select a Table --</option>
                        {tableRows}
                    </select>
                </lable>
                <button className="btn btn-primary" onClick={handleCancel}>Cancel</button>
                <button className="btn btn-primary" type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Seating;