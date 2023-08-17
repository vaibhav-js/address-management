import React from "react";

const TableBody = ({tableData, columns}) => {
    return (
        <tbody>
                {
                (Array.isArray(tableData) && tableData.length > 0) ? (tableData.map(data => (
                    <tr key={data.id}>
                        {columns.map(({accessor}) => {
                            const tData = data[accessor] ? data[accessor] : "---";
                            return <td key={accessor}>{tData}</td>
                        })}
                    </tr>
                    ))) :   <tr>
                                <td colSpan="6">No locations found</td>
                            </tr>
                }
        </tbody>
    );
};

export default TableBody;