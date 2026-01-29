import {Section} from "./Section.jsx";
import {Col, Row} from "react-bootstrap";

function Edition(props){
    const {edition} = props;

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

                    {edition.numberInCollection && (
                        <Col xs={6}>
                            <strong>Number:</strong> {edition.numberInCollection}
                        </Col>
                    )}

                    <Col xs={6}>
                        <strong>Publisher:</strong>{" "}
                        {edition.selfPublished
                            ? "Self-published"
                            : edition.organizationName || "Unknown"}
                    </Col>

                    {edition.contributors?.length > 0 && (
                        <Col xs={12}>
                            <strong>Contributors:</strong>
                            <ul className="mb-0">
                                {edition.contributors.map((c, i) => (
                                    <li key={i}>
                                        {c.peopleName} — {c.roleName}
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    )}
                </Row>
            </Col>
        </Row>
    </>
}

export function Editions(props){
    const {editions} = props;

    if(!editions || editions.length === 0){
       return <div>No editions found</div>;
    }

    return<>
        <Section>
            {editions?.map(ed => <Col xs={12} lg={12} key={ed.id}>
                <Edition edition={ed}/>
            </Col>)}
        </Section>
    </>
}