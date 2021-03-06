import React from "react";

const PlaylistTable = props =>{
    return (           
        <table className="playlist-table"  >
            <thead className="palylist-table-header">
                <tr className="playlist-table-header-cell">
                    {props.headers && props.headers.map( (text, index) => <th key={text+index} className={text.toLowerCase()}>{text}</th>)}
                </tr>
            </thead>
            <tbody className="playlist-table-body" >
                { props.children }
            </tbody>
        </table>
    )
}


export default PlaylistTable;