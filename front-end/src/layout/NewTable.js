import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {createTable} from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function NewTable({loadTables}) {
    const initialTableData = {
        table_name: "",
        capacity: "",
    }

    const [tableData, setTableData] = useState(initialTableData);
    const [error, setError] = useState(null);

    const history = useHistory();

    function handleChange({ target: { name, value}}) {
        setTableData((previousTableData) => ({
            ...previousTableData,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        tableData.capacity = Number(tableData.capacity)
        const abortController = new AbortController();
        createTable(tableData, abortController.signal).then(() => {
            loadTables().then(history.push(`/dashboard`))
        })
        .catch((error) => setError(error));
    }

    function handleCancel(event) {
        history.goBack();
    }

    return (
        <div>
            <h1>Create Table</h1>
            <ErrorAlert className="alert alert-danger" error={error} />
            <form onSubmit={handleSubmit}>
                <label htmlFor="table_name">Table Name
                    <input id="table_name" name="table_name" type="text" minLength="2" onChange={handleChange} value={tableData.table_name}/>
                </label>
                <label htmlFor="capacity">Capacity
                    <input id="capacity" name="capacity" type="number" min="1" onChange={handleChange} value={tableData.capacity}/>
                </label>
                <button className="btn btn-primary" type="button" onClick={handleCancel}>Cancel</button>
                <button className="btn btn-primary" type="submit">Submit</button>
            </form>
        </div>  
    )
}

export default NewTable;