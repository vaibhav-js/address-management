import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";
import "../styles/TableHead.scss"


const TableHead = ({columns, handleSorting}) => {
    const [sortField, setSortField] = useState("");
    const [order, setSortOrder] = useState("asc");
    const handleSortingChange = (accessor) => {
        const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc";
        setSortField(accessor);
        setSortOrder(sortOrder);
        handleSorting(accessor, sortOrder)
    }

    return (
        <thead>
            <tr>
                {columns.map(({label, accessor, sortable}) => {
                    const cl = sortable
                    ? sortField === accessor && order === "asc"
                     ? "up"
                     : sortField === accessor && order === "desc"
                     ? "down"
                     : "default"
                    : "";
                    return (
                    <th 
                    key={accessor} 
                    onClick={sortable ? () => handleSortingChange(accessor) : null }
                    className={sortable ? "sortable" : ""}
                    >
                        {label}
                        {sortable && (
                            <FontAwesomeIcon icon={cl === "up" ? faArrowUp : cl === "down" ? faArrowDown : faArrowsUpDown} />
                        )}
                    </th>
                    )
                })}
            </tr>
        </thead>
    );
};

export default TableHead;