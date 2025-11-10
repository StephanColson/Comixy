import FlipMove from "react-flip-move";
import {Section} from "./Section.jsx";
import {SectionCard} from "./SectionCard.jsx";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {deleteComic, updateComic} from "../api/comicInfo.js";

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
                                    <Col xl={4} lg={4} md={12} className="mb-2">
                                        <Form.Label>Title:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedComic.title}
                                            onChange={e => setEditedComic({...editedComic, title: e.target.value})}/>
                                    </Col>

                                    <Col xl={4} lg={4} md={6} sm={6} xs={6}>
                                        <Form.Label>Display #:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedComic.numberName}
                                            onChange={e => setEditedComic({...editedComic, numberName: e.target.value})}/>
                                    </Col>

                                    <Col xl={4} lg={4} md={6} sm={6} xs={6}>
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
                            <Row>
                                <Col className="mt-1" xl={12} lg={12}>
                                    <Form.Label>Cover Img:</Form.Label>
                                    <Form.Control type="text"
                                                  value={editedComic.cover}
                                                  onChange={e => setEditedComic({...editedComic, cover: e.target.value})}/>
                                </Col>

                                <Col className="my-2" xl={12} lg={12}>
                                    <Form.Label>Serie:</Form.Label>
                                    <Form.Control type="text"
                                                  value={editedComic.serie}
                                                  onChange={e => setEditedComic({...editedComic, serie: e.target.value})}/>
                                </Col>

                                <Col xl={6} lg={6}>
                                    <Form.Label>Author:</Form.Label>
                                    <Form.Control type="text"
                                                  value={editedComic.author}
                                                  onChange={e => setEditedComic({...editedComic, author: e.target.value})}/>
                                </Col>

                                <Col xl={6} lg={6}>
                                    <Form.Label>Artist:</Form.Label>
                                    <Form.Control type="text"
                                                  value={editedComic.artist}
                                                  onChange={e => setEditedComic({...editedComic, artist: e.target.value})}/>
                                </Col>

                                <Col className="my-2" xl={12} lg={12}>
                                    <Form.Label>Publisher</Form.Label>
                                    <Form.Control type="text"
                                                  value={editedComic.publisher}
                                                  onChange={e => setEditedComic({...editedComic, publisher: e.target.value})}/>
                                </Col>

                                <Col xl={12} lg={12}>
                                    <Form.Label>Year Published:</Form.Label>
                                    <Form.Control type="text"
                                                  value={editedComic.released}
                                                  onChange={e => setEditedComic({...editedComic, released: e.target.value})}/>
                                </Col>

                                <Col className="my-2" xl={12} lg={12}>
                                    <Form.Label>Genres:</Form.Label>
                                    <Form.Control type="text"
                                                  value={editedComic.genres}
                                                  onChange={e => setEditedComic({...editedComic, genres: e.target.value.split(/\s*,\s*/).map(g => g.trim())})}/>

                                </Col>

                                <Col xl={12} lg={12}>
                                    <Form.Label>Price:</Form.Label>
                                    <Form.Control type="number"
                                                  value={editedComic.price}
                                                  onChange={e => setEditedComic({...editedComic, price: e.target.value})}/>
                                </Col>
                            </Row>
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

                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex mt-3">
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
                        ) : (
                            <>
                                <Button onClick={() => setIsEditing(true)}>Edit</Button>
                                <Button className="mx-2" variant="danger"
                                        onClick={async () => {
                                            await deleteComic(comic);
                                            onHide();
                                        }}
                                >Delete</Button>
                            </>
                        )}
                    </div>
                </Modal.Footer>
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
    const {comics, carouselMode = false} = props;
    const [selectedComic, setSelectedComic] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    if (carouselMode) {
        return (
            <>
                <div className="d-flex justify-content-center">
                    {comics.map((c) => (
                        <div key={c.id} className="w-25 mb-5">
                            <Comic comic={c} onClick={() => { setSelectedComic(c); setShowDetails(true); }} />
                        </div>
                    ))}
                </div>

                <ComicDetails
                    comic={selectedComic}
                    show={showDetails}
                    onHide={() => { setSelectedComic(null); setShowDetails(false); }}
                />
            </>
        );
    }

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