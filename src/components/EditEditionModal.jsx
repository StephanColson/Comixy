import {Modal, Button, Form} from "react-bootstrap";
import {useState} from "react";
import {updateEdition} from "../api/editionInfo.js";

export function EditEditionModal(props) {
    const {edition, onClose} = props;
    const [formData, setFormData] = useState({...edition});

    function handleChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    async function handleSave() {
        await updateEdition(formData);
        onClose();
    }

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Edition</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    <Form.Group className="mb-3">
                        <Form.Label>Format</Form.Label>
                        <Form.Control
                            name="format"
                            value={formData.format || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Print Type</Form.Label>
                        <Form.Control
                            name="printType"
                            value={formData.printType || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Number in Collection</Form.Label>
                        <Form.Control
                            name="numberInCollection"
                            value={formData.numberInCollection || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Add more fields as needed */}

                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}