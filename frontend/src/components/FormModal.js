import React, { useState } from "react";
import {Modal, Button, Form} from 'react-bootstrap'
import axios from "axios";
import swal from "sweetalert";

const FormModal = (props) => {
    const [formData, setFormData] = useState({})
    const [disableSubmitLocationForm, setDisableSubmitLocationForm] = useState(false);

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData(prevData => ({...prevData, [name]: value}))
    };

    const handleSubmit = async (e) => {
        setDisableSubmitLocationForm(true);
        e.preventDefault()
            try {
              const data = {
                formData,
                token: localStorage.getItem('token')
              }
            const response = await axios.post('http://localhost:8080/addlocation', data);
            console.log(response)
            if (response.data.icon === "success") {
                await swal("Success", "Location Added", response.data.icon);
            } else {
              await swal("Oops :(", "Something wrong happedned", response.data.icon);
            }
            } catch (error) {
              console.error('Error adding accessible', error);
            }
        props.handleClose();
        props.updateTableData();
        setDisableSubmitLocationForm(false);
        }
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Form Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" name="address" onChange={handleInputChange} required/>
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" name="city" onChange={handleInputChange} required/>
                        <Form.Label>State</Form.Label>
                        <Form.Control type="text" name="state" onChange={handleInputChange} required/>
                        <Form.Label>Country</Form.Label>
                        <Form.Control type="text" name="country" onChange={handleInputChange} required/>
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control type="text" name="postal" pattern="[0-9]*" onChange={handleInputChange} required/>
                    </Form.Group>
                    <Button 
                    variant="primary" 
                    type="submit"
                    disabled={disableSubmitLocationForm}
                    >
                        Submit
                    </Button>
                </Form>
            </Modal.Body>        
        </Modal>
    )
}

export default FormModal