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
    const [querySearch, setQuerySearch] = useState("");

    const filteredComics = [...comics]
        .sort((a, b) => a.title.localeCompare(b.title))
        .filter(c =>
            c.title.toLowerCase().includes(querySearch.toLowerCase()) ||
            c.author.toLowerCase().includes(querySearch.toLowerCase()) ||
            c.artist.toLowerCase().includes(querySearch.toLowerCase()) ||
            c.publisher.toLowerCase().includes(querySearch.toLowerCase()) ||
            c.price === querySearch);

    return (
        <>
            <Form className="my-4 mx-5">
                <Form.Control value={querySearch}
                              onChange={e => setQuerySearch(e.target.value)}
                              placeholder="Search..."/>
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