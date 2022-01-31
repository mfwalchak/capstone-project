import { listTables } from "../utils/api";
import React, { useState, useEffect } from "react";
import FinishTableButton from "./FinishTableButton";

function FloorMap() {
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        const abortController = new AbortController();
        listTables(abortController.signal).then(setTables).catch(setError);
    }, [])

    return tables.map((table)=> {
        return (
            <ul>
                <li key={table.table_id}>{`${table.table_name} seats ${table.capacity}`} 
                <p data-table-id-status={`${table.table_id}`}>{!table.reservation_id ? "Free" : "Occupied"}
                <FinishTableButton table={table} />
                </p>
                </li>
            </ul>
        )
    });
}

export default FloorMap;
