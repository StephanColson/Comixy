import {Section} from "./Section.jsx";
import {Col, Row} from "react-bootstrap";
import {useState} from "react";
import FlipMove from "react-flip-move";

function EditionThumbnails(props){
    const {imgURLs} = props;
    const [images, setImages] = useState(imgURLs ?? []);

    if(!images.length) return null;

    function handleThumbnailClick(clickedIndex) {
        const updated = [...images];
        [updated[0], updated[clickedIndex]] = [updated[clickedIndex], updated[0]];
        setImages(updated);
    }

    return (
        <div>
            <img
                src={images[0]}
                alt="Edition Cover"
                className="img-fluid rounded mb-2 w-75 object-fit-cover"
            />

            {images.length > 1 && (
                <FlipMove
                    className="d-flex"
                    easing="ease-in-out"
                    appearAnimation="fade"
                >
                    {images.slice(1).map((url, i) => (
                        <div key={url} onClick={() => handleThumbnailClick(i + 1)}>
                            <img
                                src={url}
                                alt={`Thumbnail ${i + 1}`}
                                className="rounded w-50 object-fit-cover"
                            />
                        </div>
                    ))}
                </FlipMove>
            )}
        </div>
    )
}

function Edition(props){
    const {edition, onEdit} = props;

    return<>
        <Row className="mb-4 align-items-start">
            <Col xs={12} md={3}>
                <EditionThumbnails imgURLs={edition.imgURLs}/>
            </Col>

            <Col xs={12} md={9}>
                <Row className="g-2">

                    {edition.format && (
                        <Col xs={6}>
                            <strong>Format:</strong> {edition.format}
                        </Col>
                    )}

                    {edition.printType && (
                        <Col xs={6}>
                            <strong>Print Type:</strong> {edition.printType}
                        </Col>
                    )}

                    {edition.printYear && (
                        <Col xs={6}>
                            <strong>Year:</strong> {edition.printYear}
                        </Col>
                    )}

                    {edition.numberInCollection && (
                        <Col xs={6}>
                            <strong>Number:</strong> {edition.numberInCollection}
                        </Col>
                    )}

                    {edition.price && (
                        <Col xs={6}>
                            <strong>Price:</strong> €{edition.price}
                        </Col>
                    )}

                    <Col xs={6}>
                        <strong>Publisher:</strong> {edition.publisherDisplay}
                    </Col>

                    {edition.displayContributors?.length > 0 && (
                        <Col xs={12}>
                            <strong>Contributors:</strong>
                            <ul className="mb-0">
                                {edition.displayContributors.map((c, i) => (
                                    <li key={i}>
                                        {c.peopleName} — {c.roleName}
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    )}

                    <Col xs={12} className="mt-2">
                        <button className="btn btn-success btn-sm" onClick={() => onEdit(edition)}>
                            Edit Edition
                        </button>
                    </Col>
                </Row>
            </Col>
        </Row>
    </>
}

export function Editions(props){
    const {editions, onEditEdition} = props;

    if(!editions || editions.length === 0){
       return <div>No editions found</div>;
    }

    return<>
        <Section>
            {editions?.map(ed => <Col xs={12} lg={12} key={ed.id}>
                <Edition edition={ed} onEdit={onEditEdition}/>
            </Col>)}
        </Section>
    </>
}