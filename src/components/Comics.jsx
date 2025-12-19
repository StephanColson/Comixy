import FlipMove from "react-flip-move";
import {Section} from "./Section.jsx";
import {SectionCard} from "./SectionCard.jsx";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {deleteComic, updateComic, uploadFile} from "../api/comicInfo.js";
import {addOwnedComic, removeOwnedComic} from "../api/userInfo.js";

function ComicDetails(props) {
    const {comic, show, onHide, setValidated, validated, handleSave} = props;
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


    if (!comic) return null;

    return (
        <>

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
                validated={validated}
                setValidated={setValidated}
                handleSave={handleSave}/>
        </Section>
    )
}