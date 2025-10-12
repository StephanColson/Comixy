import {Section} from "../components/Section.jsx";
import {Comics} from "../components/Comics.jsx";
import {SectionCard} from "../components/SectionCard.jsx";
import {Card, Col, Container} from "react-bootstrap";
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

function FilterTitle (props) {
    const {filterTitle, setFilterTitle} = props;

    const handleChange = (e) => {
        setFilterTitle(e.target.value);
    };

    return(
        <div>
            <label>Filter Title:</label>
            <input
                type="text"
                className="form-control"
                placeholder="Search title..."
                value={filterTitle}
                onChange={handleChange}
            />
        </div>
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
                <div className="bg-dark-subtle p-2">
                    <div className="mb-2">
                        <h2>Filters</h2>
                    </div>

                    <div>
                        <FilterTitle filterTitle={filterTitle} setFilterTitle={setFilterTile}/>
                    </div>
                </div>

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