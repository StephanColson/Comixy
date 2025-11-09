import FlipMove from "react-flip-move";
import {Section} from "./Section.jsx";
import {SectionCard} from "./SectionCard.jsx";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {updateComic} from "../api/comicInfo.js";

function ComicDetails(props){
    const {comic, show, onHide} = props;
    const [isEditing, setIsEditing] = useState(false);
    const [editedComic, setEditedComic] = useState(comic);

    useEffect(() => {
        setEditedComic(comic);
        setIsEditing(false);
    }, [comic]);

    if (!comic) return null;

    return(
        <>
            <Modal show={show} onHide={onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isEditing ? (
                            <Form>
                                <Row>
                                    <Col xl={4} lg={4}>
                                        <Form.Label>Title:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedComic.title}
                                            onChange={e => setEditedComic({...editedComic, title: e.target.value})}/>
                                    </Col>

                                    <Col xl={4} lg={4}>
                                        <Form.Label>Display #:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedComic.numberName}
                                            onChange={e => setEditedComic({...editedComic, numberName: e.target.value})}/>
                                    </Col>

                                    <Col xl={4} lg={4}>
                                        <Form.Label>Book #:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedComic.bookNumber}
                                            onChange={e => setEditedComic({...editedComic, bookNumber: e.target.value})}/>
                                    </Col>
                                </Row>
                            </Form>
                        ) : (`${comic.title} ${comic.numberName}`) }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isEditing ? (
                        <Form>
                            <Form.Label>Cover Img:</Form.Label>
                            <Form.Control type="link"
                                          value={editedComic.cover}
                                          onChange={e => setEditedComic({...editedComic, cover: e.target.value})}/>

                            <Form.Label>Serie:</Form.Label>
                            <Form.Control type="text"
                                          value={editedComic.serie}
                                          onChange={e => setEditedComic({...editedComic, serie: e.target.value})}/>

                            <Form.Label>Author:</Form.Label>
                            <Form.Control type="text"
                                          value={editedComic.author}
                                          onChange={e => setEditedComic({...editedComic, author: e.target.value})}/>

                            <Form.Label>Artist:</Form.Label>
                            <Form.Control type="text"
                                          value={editedComic.artist}
                                          onChange={e => setEditedComic({...editedComic, artist: e.target.value})}/>

                            <Form.Label>Publisher</Form.Label>
                            <Form.Control type="text"
                                          value={editedComic.publisher}
                                          onChange={e => setEditedComic({...editedComic, publisher: e.target.value})}/>

                            <Form.Label>Year Published:</Form.Label>
                            <Form.Control type="text"
                                          value={editedComic.released}
                                          onChange={e => setEditedComic({...editedComic, released: e.target.value})}/>

                            <Form.Label>Genres:</Form.Label>
                            <Form.Control type="text"
                                          value={editedComic.genres}
                                          onChange={e => setEditedComic({...editedComic, genres: e.target.value.split(/\s*,\s*/).map(g => g.trim())})}/>

                            <Form.Label>Price:</Form.Label>
                            <Form.Control type="number"
                                          value={editedComic.price}
                                          onChange={e => setEditedComic({...editedComic, price: e.target.value})}/>
                        </Form>
                    ) : (
                        <div className="d-flex">
                            <img src={comic.cover} className="img-fluid w-50"/>
                            <div className="mx-3">
                                <p>Author: {comic.author}</p>
                                <p>Artist: {comic.artist}</p>
                                <p>Publisher: {comic.publisher}</p>
                                <p>Year Published: {comic.released}</p>
                                <p>Genres: {comic.genres.join(", ")}</p>
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-center mt-3">
                        {isEditing ? (
                            <>
                                <Button
                                    onClick={async () => {
                                        await updateComic(editedComic);
                                        setIsEditing(false);
                                    }}>
                                    Save
                                </Button>

                                <Button className="mx-2" variant="danger"
                                        onClick={() => setIsEditing(false)}>Cancel</Button>
                            </>
                        ) : (<Button onClick={() => setIsEditing(true)}>Edit</Button>)}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

function Comic(props) {
    const {comic, onClick} = props;
    return (
        <SectionCard
            coverImg={comic.cover}
            title={comic.title}
            price={comic.price}
            genres={comic.genres.join(", ")}
            onClick={onClick}>
        </SectionCard>
    )
}

export function Comics(props) {
    const {comics} = props;
    const [selectedComic, setSelectedComic] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    return (
        <Section>
            <FlipMove typeName={Row}>
                {comics?.map(c => (
                    <Col md={6} lg={3} xl={3} key={c.id}>
                        <Comic comic={c} onClick={() => {
                            setSelectedComic(c), setShowDetails(true)
                        }}/>
                    </Col>
                ))}
            </FlipMove>

            <ComicDetails comic={selectedComic} show={showDetails} onHide={() => {
                setSelectedComic(null), setShowDetails(false)
            }}/>
        </Section>
    )
}