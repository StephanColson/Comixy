import FlipMove from "react-flip-move";
import {Section} from "./Section.jsx";
import {SectionCard} from "./SectionCard.jsx";
import {Col, Modal, Row} from "react-bootstrap";
import {useState} from "react";

function ComicDetails(props){
    const {comic, show, onHide} = props;

    if (!comic) return null;

    return(
        <>
            <Modal show={show} onHide={onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {comic.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Author: {comic.author}</div>
                    <div>Artist: {comic.artist}</div>
                    <div>Publisher: {comic.publisher}</div>
                </Modal.Body>
            </Modal>
        </>
    )
}

function Comic (props) {
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