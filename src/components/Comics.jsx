import FlipMove from "react-flip-move";
import {Section} from "./Section.jsx";
import {SectionCard} from "./SectionCard.jsx";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {deleteComic, updateComic, uploadFile} from "../api/comicInfo.js";
import {addOwnedComic, removeOwnedComic} from "../api/userInfo.js";

function ComicDetails(props) {
    const {comic, show, onHide, selectedUser, setValidated, validated, handleSave} = props;
    const [isEditing, setIsEditing] = useState(false);
    const [editedComic, setEditedComic] = useState(comic);
    const [owned, setOwned] = useState(false);

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;

        const comicToSave = editedComic.coverFile
            ? {
                ...editedComic,
                imageURL: await uploadFile(editedComic.coverFile),
            }
            : { ...editedComic };

        const { coverFile, ...comicData } = comicToSave;

        const success = await handleSave(comicData, form);

        if (success) {
            setIsEditing(false);
            setValidated(false);
        }
    };

    useEffect(() => {
        setEditedComic(comic);
        setIsEditing(false);
        setOwned(selectedUser?.ownedComics?.includes(comic?.id) || false);
    }, [comic, selectedUser]);

    const handleToggleOwned = async () => {
        if (!selectedUser) return;

        if (owned) {
            await removeOwnedComic(selectedUser, comic);
            setOwned(false);
        } else {
            await addOwnedComic(selectedUser, comic);
            setOwned(true);
        }
    }

    if (!comic) return null;

    return (
        <>
            <Modal key={selectedUser ? selectedUser.id : "no-user detected"} show={show} onHide={onHide} centered>
                {isEditing ? (
                    <Form noValidate validated={validated} onSubmit={handleEditSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <Row>
                                    <Col xl={4} lg={4} md={12} className="mb-2">
                                        <Form.Label>Title:</Form.Label>
                                        <Form.Control required
                                                      type="text"
                                                      value={editedComic.title}
                                                      onChange={e => setEditedComic({
                                                          ...editedComic,
                                                          title: e.target.value
                                                      })}/>
                                        <Form.Control.Feedback type="invalid">Title required!</Form.Control.Feedback>
                                    </Col>

                                    <Col xl={4} lg={4} md={6} sm={6} xs={6}>
                                        <Form.Label>Book #:</Form.Label>
                                        <Form.Control required
                                                      type="text"
                                                      value={editedComic.bookNumber}
                                                      onChange={e => setEditedComic({
                                                          ...editedComic,
                                                          bookNumber: e.target.value
                                                      })}/>
                                        <Form.Control.Feedback type="invalid">Book # required!</Form.Control.Feedback>
                                    </Col>
                                </Row>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col className="mt-1" xl={12} lg={12}>
                                    <Form.Label>Cover Img:</Form.Label>
                                    <Form.Control required
                                                  type="file"
                                                  onChange={e => setEditedComic({
                                                      ...editedComic,
                                                      coverFile: e.target.files[0]
                                                  })}/>
                                    <Form.Control.Feedback type="invalid">Accepted files: (.png, .webp, . jpeg, .jpg)</Form.Control.Feedback>
                                </Col>

                                <Col className="my-2" xl={12} lg={12}>
                                    <Form.Label>Serie:</Form.Label>
                                    <Form.Control type="text"
                                                  value={editedComic.serieID}
                                                  onChange={e => setEditedComic({
                                                      ...editedComic,
                                                      serieID: e.target.value
                                                  })}/>
                                </Col>

                                <Col xl={6} lg={6}>
                                    <Form.Label>Author:</Form.Label>
                                    <Form.Control type="text"
                                                  value={editedComic.authorID}
                                                  onChange={e => setEditedComic({
                                                      ...editedComic,
                                                      authorID: e.target.value
                                                  })}/>
                                </Col>

                                <Col xl={6} lg={6}>
                                    <Form.Label>Artist:</Form.Label>
                                    <Form.Control type="text"
                                                  value={editedComic.artistID}
                                                  onChange={e => setEditedComic({
                                                      ...editedComic,
                                                      artistID: e.target.value
                                                  })}/>
                                </Col>

                                <Col className="my-2" xl={12} lg={12}>
                                    <Form.Label>Publisher</Form.Label>
                                    <Form.Control type="text"
                                                  value={editedComic.publisherID}
                                                  onChange={e => setEditedComic({
                                                      ...editedComic,
                                                      publisherID: e.target.value
                                                  })}/>
                                </Col>

                                <Col xl={12} lg={12}>
                                    <Form.Label>Year Published:</Form.Label>
                                    <Form.Control type="text"
                                                  value={editedComic.year}
                                                  onChange={e => setEditedComic({
                                                      ...editedComic,
                                                      year: e.target.value
                                                  })}/>
                                </Col>

                                <Col className="my-2" xl={12} lg={12}>
                                    <Form.Label>Genres:</Form.Label>
                                    <Form.Control type="text"
                                                  value={editedComic.genres}
                                                  onChange={e => setEditedComic({
                                                      ...editedComic,
                                                      genres: e.target.value.split(/\s*,\s*/).map(g => g.trim())
                                                  })}/>

                                </Col>

                                <Col xl={12} lg={12}>
                                    <Form.Label>Price:</Form.Label>
                                    <Form.Control type="number"
                                                  value={editedComic.price}
                                                  onChange={e => setEditedComic({
                                                      ...editedComic,
                                                      price: e.target.value
                                                  })}/>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer className="d-flex justify-content-end">
                            <div>
                                <Button type="submit">Save</Button>
                                <Button className="mx-2" variant="danger" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </div>
                        </Modal.Footer>
                    </Form>) : (
                    <>
                        <Modal.Header>
                            <Modal.Title>{`${comic.title} ${comic.bookNumber}`}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="d-flex">
                                <img src={comic.imageURL || "No cover image"} className="img-fluid w-50"/>
                                <div className="mx-3">
                                    <p>Author: {comic.authorID?.trim() || "unknown"}</p>
                                    <p>Artist: {comic.artistID?.trim() || "unknown"}</p>
                                    <p>Publisher: {comic.publisherID?.trim() || "unknown"}</p>
                                    <p>Year Published: {comic.year || "unknown"}</p>
                                    <p>Genres: {comic.genres?.length ? comic.genres.join(", ") : "unknown"}</p>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="d-flex justify-content-between">
                            <div>
                                {selectedUser && (
                                    <Button variant={owned ? "outline-warning" : "outline-success"} onClick={handleToggleOwned}>
                                        {owned ? "Remove from my library" : "Add to my library"}
                                    </Button>
                                )}
                            </div>

                            <div>
                                {selectedUser && (
                                    <>
                                        <Button onClick={() => setIsEditing(true)}>Edit</Button>
                                        <Button className="mx-2" variant="danger" onClick={async () => {
                                            await deleteComic(comic);
                                            onHide();
                                        }}>
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </>
    )
}

function ComicGallery(props) {
    const {comic, onClick} = props;
    return (
        <SectionCard coverImg={comic.imageURL} onClick={onClick}>
            <div className="fw-bold">{comic.title} {comic.bookNumber}</div>
            <hr/>
            {comic.price && (
                <div className="mt-3 text-info fw-bold fs-5 bg-secondary-subtle rounded">
                    {comic.price} €
                </div>
            )}
        </SectionCard>
    )
}

function ComicList(props){
    const {comic} = props;
    return <>
        <div>
            <h3 className="fs-4">{comic.title}</h3>
        </div>
    </>
}

export function Comics(props) {
    const {comics, carouselMode = false, selectedUser, setValidated, validated, handleSave} = props;
    const [selectedComic, setSelectedComic] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    if (carouselMode) {
        return (
            <>
                <div className="d-flex justify-content-center">
                    {comics.map((c) => (
                        <div key={c.id} className="w-25 mb-5">
                            <ComicGallery comic={c} onClick={() => {
                                setSelectedComic(c);
                                setShowDetails(true);
                            }}/>
                        </div>
                    ))}
                </div>

                <ComicDetails
                    comic={selectedComic}
                    show={showDetails}
                    onHide={() => {
                        setSelectedComic(null);
                        setShowDetails(false);
                    }}
                    selectedUser={selectedUser}
                />
            </>
        );
    }

    return (
        <Section>
            <FlipMove typeName={Row}>
                <Col className="mt-4">
                    <div>
                        <ul>
                            {comics.map(cl =>
                                <li key={cl.id}>
                                    <ComicList comic={cl}/>
                                </li>
                            )}
                        </ul>
                    </div>
                </Col>

                <Col className="mt-4">
                    <div className="border border-dark">
                        <Row className="m-2">
                            {comics?.map(c => (
                                <Col xl={4} lg={4} md={4} key={c.id}>
                                    <ComicGallery comic={c} onClick={() => {
                                        setSelectedComic(c), setShowDetails(true)
                                    }}/>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Col>
            </FlipMove>

            <ComicDetails
                comic={selectedComic}
                show={showDetails}
                onHide={() => {
                    setSelectedComic(null), setShowDetails(false)
                }}
                selectedUser={selectedUser}
                validated={validated}
                setValidated={setValidated}
                handleSave={handleSave}/>
        </Section>
    )
}