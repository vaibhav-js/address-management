import { Button, ButtonGroup } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import FormModal from './TableFormModal'
import axios from "axios";
import '../styles/TableContent.scss'
import swal from "sweetalert";
import TableHead from "./TableHead";
import TableBody from "./TableBody";

const TableContent = () => {
    const [showModal, setShowModal] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [disableDeleteAllLocations, setDisableDeleteAllLocations] = useState(false);

    useEffect(() => {
        updateTableData();
      }, []);

    const columns = [
        { label: "Address", accessor: "address", sortable: false },
        { label: "City", accessor: "city", sortable: true },
        { label: "State", accessor: "state", sortable: true },
        { label: "Country", accessor: "country", sortable: true },
        { label: "Postal Code", accessor: "postal", sortable: true },
    ];  

    const updateTableData = async() => {
        try {
            const response = await axios.get('http://localhost:8080/getlocations', 
            {params: {token: localStorage.getItem('token')}})
            setTableData(response.data)
        } catch (error) {
            console.error(error);
        }
    };

    const removeAllLocations = async() => {
        setDisableDeleteAllLocations(true);
        try {
            const data = {token: localStorage.getItem('token')}
            const response = await axios.delete('http://localhost:8080/removealllocations' , {data})
            if (response.data.error === undefined && response.data.icon === "success") {
                updateTableData();
                await swal("Successfully deleted", "All locations", response.data.icon);
            } else {
                await swal("Oops :(", response.data.error, response.data.icon);
            }
        } catch (error) {
            console.error(error)
        }
        setDisableDeleteAllLocations(false);
    }

    const handleOpenModal = () => {
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
    };

    const handleSorting = (sortField, sortOrder) => {
        if (sortField && tableData.length > 0) {
            const sorted = [...tableData].sort((a,b) => {
                if (a[sortField] === null) return 1;
                if (b[sortField] === null) return -1;
                if (a[sortField] === null && b[sortField] === null) return 0;
                return (
                    a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
                        numeric: true,
                    }) * (sortOrder === "asc" ? 1 : -1)
                )
            })
            setTableData(sorted);
        }
    }
    return (
        <div>
            <div className="right-align">
                <ButtonGroup>
                    <Button 
                    variant="outline-secondary"
                    onClick={handleOpenModal}
                    className="add-button"
                    >
                        Add location
                    </Button>
                    <Button
                    variant="outline-secondary"
                    className="delete-button"
                    onClick={removeAllLocations}
                    disabled={disableDeleteAllLocations}
                    >
                        Delete All Locations
                    </Button>
                </ButtonGroup>
            </div>
            <FormModal show={showModal} handleClose={handleCloseModal} updateTableData={updateTableData}></FormModal>
            <table className="table">
                <TableHead columns={columns} handleSorting={handleSorting}/>
                <TableBody columns={columns} tableData={tableData} />
            </table>
        </div>
    );
}

export default TableContent;