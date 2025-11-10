import {useState} from "react";
import {addComic} from "../api/comicInfo.js";
import {Button, Form, Modal} from "react-bootstrap";

export function AddComicModal(props){
    const {show, onHide, onAdd} = props;
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

    const handleSave = async () => {
        if (!newComic.title || !newComic.bookNumber || !newComic.numberName) {
            alert("Fill in the Required fields!");
            return;
        }

        await addComic({
            ...newComic,
            genres: newComic.genres.map(g => g.trim()).filter(g => g),
        });

        onHide();

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
    };

    const required = <span className="text-danger">(Required)</span>

    return(
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header>
                <Modal.Title>New Comic</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label>Cover Img:</Form.Label>
                    <Form.Control
                        type="link"
                        value={newComic.cover}
                        onChange={e => setNewComic({...newComic, cover: e.target.value})}/>

                    <Form.Label>Title: {required}</Form.Label>
                    <Form.Control
                        type="text"
                        value={newComic.title}
                        onChange={e => setNewComic({...newComic, title: e.target.value})}/>

                    <Form.Label>Book #: {required}</Form.Label>
                    <Form.Control
                        type="number"
                        value={newComic.bookNumber}
                        onChange={e => setNewComic({...newComic, bookNumber: Number(e.target.value)})}/>

                    <Form.Label>Display #: {required}</Form.Label>
                    <Form.Control
                        type="text"
                        value={newComic.numberName}
                        onChange={e => setNewComic({...newComic, numberName: e.target.value})}/>

                    <Form.Label>Author:</Form.Label>
                    <Form.Control
                        type="text"
                        value={newComic.author}
                        onChange={e => setNewComic({...newComic, author: e.target.value})}/>

                    <Form.Label>Artist:</Form.Label>
                    <Form.Control
                        type="text"
                        value={newComic.artist}
                        onChange={e => setNewComic({...newComic, artist: e.target.value})}/>

                    <Form.Label>Publisher:</Form.Label>
                    <Form.Control
                        type="text"
                        value={newComic.publisher}
                        onChange={e => setNewComic({...newComic, publisher: e.target.value})}/>


                    <Form.Label>Genres:</Form.Label>
                    <Form.Control type="text"
                                  value={newComic.genres}
                                  onChange={e => setNewComic({...newComic, genres: e.target.value.split(/\s*,\s*/).map(g => g.trim())})}/>

                    <Form.Label>Price:</Form.Label>
                    <Form.Control
                        type="number"
                        value={newComic.price}
                        onChange={e => setNewComic({...newComic, price: e.target.value})}/>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => handleSave()}>Save</Button>
                <Button variant="danger" onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}