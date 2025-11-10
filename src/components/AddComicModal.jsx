import {useState} from "react";
import {addComic} from "../api/comicInfo.js";
import {Button, Form, Modal, Row, Col} from "react-bootstrap";

export function AddComicModal(props) {
    const {show, onHide, onAdd} = props;
    const [validated, setValidated] = useState(false);
    const [newComic, setNewComic] = useState({
        title: "",
        serie: "",
        bookNumber: "",
        numberName: "",
        price: "",
        released: "",
        cover: "",
        genres: [],
        author: "",
        artist: "",
        publisher: ""
    });

    const handleSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (!form.checkValidity()) {
            setValidated(true);
            return;
        }

        await addComic({
            ...newComic,
            genres: newComic.genres.map(g => g.trim()).filter(g => g),
        });

        setNewComic({
            title: "",
            serie: "",
            bookNumber: null,
            numberName: "",
            price: "",
            released: "",
            cover: "",
            synopsis: "",
            genres: [],
            author: "",
            artist: "",
            publisher: "",
        });

        setValidated(false);
        onHide();
    };

    const required = <span className="text-danger">(Required)</span>

    return (
        <Modal show={show} onHide={onHide} centered>
            <Form noValidate validated={validated} onSubmit={handleSave}>
                <Modal.Header closeButton>
                    <Modal.Title>New Comic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col className="my-2" xl={12} lg={12}>
                            <Form.Label>Cover Img:</Form.Label>
                            <Form.Control
                                type="text"
                                value={newComic.cover}
                                onChange={e => setNewComic({...newComic, cover: e.target.value})}/>
                        </Col>

                        <Col xl={12}>
                            <Form.Label>Serie:</Form.Label>
                            <Form.Control
                                type="text"
                                value={newComic.serie}
                                onChange={e => setNewComic({...newComic, serie: e.target.value})}/>
                        </Col>

                        <Col xl={12} className="my-2">
                            <Form.Label>Title: {required}</Form.Label>
                            <Form.Control required
                                          type="text"
                                          value={newComic.title}
                                          onChange={e => setNewComic({...newComic, title: e.target.value})}/>
                            <Form.Control.Feedback type="invalid">Title required!</Form.Control.Feedback>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                            <Form.Label>Book #: {required}</Form.Label>
                            <Form.Control required
                                          type="number"
                                          value={newComic.bookNumber}
                                          onChange={e => setNewComic({
                                              ...newComic,
                                              bookNumber: Number(e.target.value)
                                          })}/>
                            <Form.Control.Feedback type="invalid">Book # required!</Form.Control.Feedback>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                            <Form.Label>Display #: {required}</Form.Label>
                            <Form.Control required
                                          type="text"
                                          value={newComic.numberName}
                                          onChange={e => setNewComic({...newComic, numberName: e.target.value})}/>
                            <Form.Control.Feedback type="invalid">Display # required!</Form.Control.Feedback>
                        </Col>

                        <Col xl={6} lg={6} md={6} className="my-2">
                            <Form.Label>Author:</Form.Label>
                            <Form.Control
                                type="text"
                                value={newComic.author}
                                onChange={e => setNewComic({...newComic, author: e.target.value})}/>
                        </Col>

                        <Col xl={6} lg={6} md={6} className="my-2">
                            <Form.Label>Artist:</Form.Label>
                            <Form.Control
                                type="text"
                                value={newComic.artist}
                                onChange={e => setNewComic({...newComic, artist: e.target.value})}/>
                        </Col>

                        <Col xl={12} lg={12}>
                            <Form.Label>Publisher:</Form.Label>
                            <Form.Control
                                type="text"
                                value={newComic.publisher}
                                onChange={e => setNewComic({...newComic, publisher: e.target.value})}/>
                        </Col>

                        <Col xl={12} lg={12} className="my-2">
                            <Form.Label>Genres:</Form.Label>
                            <Form.Control type="text"
                                          value={newComic.genres}
                                          onChange={e => setNewComic({
                                              ...newComic,
                                              genres: e.target.value.split(/\s*,\s*/).map(g => g.trim())
                                          })}/>

                        </Col>

                        <Col xl={12} lg={12}>
                            <Form.Label>Price:</Form.Label>
                            <Form.Control
                                type="number"
                                value={newComic.price}
                                onChange={e => setNewComic({...newComic, price: e.target.value})}/>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" type="submit">Save</Button>
                    <Button variant="danger" onClick={onHide}>Cancel</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}