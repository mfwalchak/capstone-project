// Take in the current table's information from the Floormap
// Disply a Finish button on each table.
// Button must have data-table-id-finish={table.table_id}
// Clicking will display popup alert "Is this table ready to seat new guests? This canot be undone."
// On "Ok" the system sends a DELETE request to /tables/:table_id/seat
// System returns 400 if the table is not occupied
// Refresh the tables list with a GET request to /tables so the E2E tests continue
// Cancel button makes no changes

export default function FinishTableButton(table){
    function handleClick(){
        console.log("this is working for this table data:", table)
    }
    return (
        <button type="" data-table-id-finish={table.table_id} onClick={handleClick}>Finish</button>
    )
}