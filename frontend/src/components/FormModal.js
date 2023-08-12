import React, { useState } from "react";
import {Modal, Button, Form} from 'react-bootstrap'

const FormModal = (props) => {
    const [formData, setFormData] = useState({})

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData(prevData => ({...prevData, [name]: value}))
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData);
        props.handleClose();
    }
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Form Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" onChange={handleInputChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            </Modal.Body>        
        </Modal>
    )
}

export default FormModal