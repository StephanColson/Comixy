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
                                    <Col xl={12} lg={12}>
                                        <Form.Control
                                            type="text"
                                            value={editedComic.title}
                                            onChange={e => setEditedComic({...editedComic, title: e.target.value})}/>
                                        <Form.Control
                                            type="text"
                                            value={editedComic.numberName}
                                            onChange={e => setEditedComic({...editedComic, numberName: e.target.value})}/>
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
                    <div className="d-flex">
                        <img src={comic.cover} className="img-fluid w-50"/>
                        <div className="mx-3">
                            <p>Author: {comic.author}</p>
                            <p>Artist: {comic.artist}</p>
                            <p>Publisher: {comic.publisher}</p>
                            <p>Genres: {comic.genres.join(", ")}</p>

                            <div className="mt-5">
                                {isEditing ? (
                                    <>
                                        <Button
                                            onClick={async () => {await updateComic(editedComic); setIsEditing(false);}}>
                                            Save
                                        </Button>

                                        <Button className="mx-2" variant="danger" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    </>
                                ) : (<Button onClick={() => setIsEditing(true)}>Edit</Button>)}
                            </div>
                        </div>
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

export function Comics (props) {
    const {comics} = props;
    const [selectedComic, setSelectedComic] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    return (
        <Section>
            <FlipMove typeName={Row}>
                {comics?.map(c => (
                    <Col md={6} lg={3} xl={3} key={c.id}>
                        <Comic comic={c} onClick={() => {setSelectedComic(c), setShowDetails(true)}}/>
                    </Col>
                ))}
            </FlipMove>

            <ComicDetails comic={selectedComic} show={showDetails} onHide={() => {setSelectedComic(null), setShowDetails(false)}}/>
        </Section>
    )
}