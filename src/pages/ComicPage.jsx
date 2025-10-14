import {Section} from "../components/Section.jsx";
import {Comics} from "../components/Comics.jsx";
import {SectionCard} from "../components/SectionCard.jsx";
import {Card, Col, Container, Form} from "react-bootstrap";
import {useState} from "react";

function YearPublished (props) {
    const {comics, yearReleased} = props;
    const comicYear = comics.filter(c => c.released === yearReleased)

    return(
        <Col md={4} lg={3} xl={3}>
            <Card className="text-center mb-2">
                <Card.Title>
                    {yearReleased}
                </Card.Title>
                <Card.Body>
                    {comicYear.map(c => c.title).join(", ")}
                </Card.Body>
            </Card>
        </Col>
    )
}

function YearsPublished (props){
    const {comics} = props;
    const publishedYear = comics.map(c => c.released);
    const uniqueYear = [...new Set(publishedYear)];
    const sortUniqueYear = uniqueYear.toSorted((a, b) => a - b);

    return (
        <Section>
            {sortUniqueYear.map(c => <YearPublished key={c} yearReleased={c} comics={comics}/>)}
        </Section>
    )
}

export function ComicPage(props) {
    const {comics, title} = props;
    const [filterTitle, setFilterTile] = useState("");
    const filteredComics = [...comics]
        .sort((a, b) => a.title.localeCompare(b.title))
        .filter(c => c.title.toLowerCase().includes(filterTitle.toLowerCase()));

    return (
        <>
        <div className="d-flex justify-content-between">
                <Form className="bg-dark-subtle p-2">
                    <Form.Label>Filters:</Form.Label>
                    <Form.Control className="m-2" value={filterTitle}
                                  onChange={e => setFilterTile(e.target.value)}/>
                </Form>

                <Section title="Comic List">
                    <Comics comics={filteredComics}/>
                </Section>
        </div>

            <Section title="Comics grouped by published year">
                <YearsPublished comics={comics}/>
            </Section>
        </>
    )
}