import FlipMove from "react-flip-move";
import {Section} from "./Section.jsx";
import {SectionCard} from "./SectionCard.jsx";
import {Col, Row} from "react-bootstrap";

function Comic (props) {
    const {comic} = props;
    return (
        <SectionCard
            coverImg={comic.cover}
            title={comic.title}
            price={comic.price}
            genres={comic.genres.join(", ")}>
        </SectionCard>
    )
}

export function Comics (props) {
    const {comics} = props;

    return (
        <Section>
            <FlipMove typeName={Row}>
                {comics?.map(c => (
                    <Col md={6} lg={3} xl={3} key={c.id}>
                        <Comic comic={c}/>
                    </Col>
                ))}
            </FlipMove>
        </Section>
    )
}