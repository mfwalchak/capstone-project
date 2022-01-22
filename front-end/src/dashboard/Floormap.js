// import { listTables } from "../utils/api";
// import React, { useState, useEffect } from "react";




// function Floormap(tables) {

//     return tables.map(table => {
//         return(
//             <ul>
//                 <li>{table.table_name}</li>
//             </ul>
//         )
//     })

//     // const [tableNameError, setTableNameError] = useState()
//     // const [tableNames, setTableNames] = useState({
//     //     table_name: "",
//     //     reservation_id: ""
//     // })

//     // useEffect(LoadFloorMap, [tableNames])

//     // function LoadFloorMap(){
//     //     const abortController = new AbortController();
//     //     setTableNameError(null);
//     //     listTables(tableNames, abortController.signal)
//     //       .then(setTableNames)
//     //       .catch(setTableNameError);
//     //     return () => abortController.abort();
//     // }

//     //     tableNames.map(table => {
//     //         return (
//     //             <ul>
//     //                 <li>{table.table_name}</li>
//     //             </ul>
//     //         )
//     // })

//     // return(
//     //     <div>
//     //         <LoadFloorMap />
//     //     </div>
//     // )
// }
// export default Floormap;