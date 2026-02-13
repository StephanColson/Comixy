import {Section} from "./Section.jsx";
import {Col, Row} from "react-bootstrap";

function Edition(props){
    const {edition, onEdit} = props;

    return<>
        <Row className="mb-4 align-items-start">
            <Col xs={12} md={3}>
                <img
                    src={edition.imgURL}
                    alt="Edition cover"
                    className="img-fluid rounded shadow-sm"
                />
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