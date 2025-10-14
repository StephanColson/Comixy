import {Section} from "../components/Section.jsx";
import {Comics} from "../components/Comics.jsx";
import {Card, Col, Row, Form} from "react-bootstrap";
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
    const [querySearch, setQuerySearch] = useState("");
    const [numberSearch, setNumberSearch] = useState("");

    const filteredComics = [...comics]
        .sort((a, b) => a.title.localeCompare(b.title))
        .filter(c =>
            (numberSearch === "" || c.bookNumber === Number(numberSearch)) &&
            (c.title.toLowerCase().includes(querySearch.toLowerCase()) ||
            c.author.toLowerCase().includes(querySearch.toLowerCase()) ||
            c.artist.toLowerCase().includes(querySearch.toLowerCase()) ||
            c.publisher.toLowerCase().includes(querySearch.toLowerCase()) ||
            c.genres.some(g => g.toLowerCase().includes(querySearch.toLowerCase()))) ||
            c.price == querySearch);

    return (
        <>
            <Form className="my-4 mx-5">
                <Row>
                    <Col lg={12} xl={12} className="mb-3">
                        <Form.Control value={querySearch}
                                      onChange={e => setQuerySearch(e.target.value)}
                                      placeholder="Search..."/>
                    </Col>

                    <Col lg={12} className="d-flex gap-4">
                        <Form.Control placeholder="Minimum price"/>

                        <Form.Control placeholder="Maximum price"/>

                        <Form.Control type="number"
                                      value={numberSearch}
                                      onChange={e => setNumberSearch(e.target.value)}
                                      placeholder="Book number"/>
                    </Col>
                </Row>
            </Form>

            <Section title="Catalog">
                <Comics comics={filteredComics}/>
            </Section>

            <Section title="Comics grouped by published year">
                <YearsPublished comics={comics}/>
            </Section>
        </>
    )
}