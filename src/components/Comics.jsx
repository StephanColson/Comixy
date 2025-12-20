import FlipMove from "react-flip-move";
import {Section} from "./Section.jsx";
import {SectionCard} from "./SectionCard.jsx";
import {Col, Row} from "react-bootstrap";
import {useState} from "react";

function ComicGallery(props) {
    const {comic, onSelect} = props;
    return (
        <SectionCard className="card-pop" coverImg={comic.imageURL} onClick={() => onSelect(comic)} role="button">
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
    const {comic, onSelect} = props;
    return <>
        <div>
            <span className="fs-4 link-info pop-effect" role="button" onClick={() => onSelect(comic)}>{comic.title}</span>
        </div>
    </>
}

export function Comics(props) {
    const {comics, carouselMode = false, onSelectComic} = props;
    const [selectedComic, setSelectedComic] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    if (carouselMode) {
        return (
            <>
                <div className="d-flex justify-content-center">
                    {comics.map((c) => (
                        <div key={c.id} className="w-25 mb-5">
                            <ComicGallery comic={c} onSelect={onSelectComic}/>
                        </div>
                    ))}
                </div>
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
                                    <ComicList comic={cl} onSelect={onSelectComic}/>
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
                                    <ComicGallery comic={c} onSelect={onSelectComic}/>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Col>
            </FlipMove>
        </Section>
    )
}