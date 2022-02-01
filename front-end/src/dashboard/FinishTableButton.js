// Take in the current table's information from the Floormap
// Disply a Finish button on each table.
// Button must have data-table-id-finish={table.table_id}
// Clicking will display popup alert "Is this table ready to seat new guests? This canot be undone."
// On "Ok" the system sends a DELETE request to /tables/:table_id/seat
// System returns 400 if the table is not occupied
// Refresh the tables list with a GET request to /tables so the E2E tests continue
// Cancel button makes no changes
import React, { useState } from "react";
import { clearTable } from "../utils/api"
import { useHistory } from "react-router-dom";

export default function FinishTableButton({ table_id, reservation_id, setResoStatus, setClearedState }){
    const [error, setError ] = useState(null);
    const history = useHistory();
    //const { table_id, reservation_id } = table;
    const params = { table_id, reservation_id }
    function handleClick(){
        console.log("handleClick params:", params)
        //console.log("finishTableSetClearedState", "table_id:", table_id, "reservation_id", reservation_id, "setClearedState", setClearedState);
        const finish = window.confirm("Is this table ready to seat new guests? This cannot be undone.")
        if (finish){
            const abortController = new AbortController();
            setError(null);
            clearTable(params, abortController.signal)
            .then(setClearedState)
            .then(setResoStatus)
            .catch(setError)
        } else{
            //do nothing
        }
    }
    if (reservation_id) {
        return (
            <button type="" data-table-id-finish={table_id} onClick={handleClick}>Finish</button>
        )
     } return null;
}