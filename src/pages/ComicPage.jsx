import {Section} from "../components/Section.jsx";
import {Comics} from "../components/Comics.jsx";
import {Card, Col, Row, Form} from "react-bootstrap";
import {useState} from "react";

const SORT_NAME_ASC = "NAME_ASC";
const SORT_NAME_DESC = "NAME_DESC";
const SORT_PRICE_ASC = "PRICE_ASC";
const SORT_PRICE_DESC = "PRICE_DESC";

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
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [genreList, setGenreList] = useState("");

    const [sortFilter, setSortFilter] = useState(undefined);


    const filteredComic = filterComics(comics);
    const sortedAndFiltered = sorting(filteredComic);

    function sorting(comics){
        if (sortFilter === SORT_NAME_ASC){
            return [...comics].sort((a, b) => a.name.localeCompare(b.name))
        }
        if (sortFilter === SORT_NAME_DESC){
            return [...comics].sort((a, b) => b.name.localeCompare(a.name))
        }
        if (sortFilter === SORT_PRICE_ASC) {
            return [...comics].sort((a, b) => a.price - b.price);;
        }
        if (sortFilter === SORT_PRICE_DESC) {
            return [...comics].sort((a, b) => b.price - a.price);
        }
        return comics
    }

    function filterComics (comics){
        return comics.filter(c => c.title.toLowerCase().includes(querySearch.toLowerCase())
            || c.author.toLowerCase().includes(querySearch.toLowerCase())
            || c.artist.toLowerCase().includes(querySearch.toLowerCase()))
            .filter(c => !minPrice || minPrice <= c.price)
            .filter(c => !maxPrice || c.price <= maxPrice)
            .filter(c => c.genres.some(g => g.toLowerCase().includes(genreList.toLowerCase())))
    }

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
                        <Form.Control type="number"
                                      value={minPrice}
                                      onChange={e => setMinPrice(e.target.value)}
                                      placeholder="Min price"/>

                        <Form.Control type="number"
                                      value={maxPrice}
                                      onChange={e => setMaxPrice(e.target.value)}
                                      placeholder="Max price"/>

                        <Form.Control type="text"
                                      value={genreList}
                                      onChange={e => setGenreList(e.target.value)}
                                      placeholder="Genres"/>

                        <Form.Control type="number"
                                      value={numberSearch}
                                      onChange={e => setNumberSearch(e.target.value)}
                                      placeholder="Book number"/>
                    </Col>
                </Row>
            </Form>

            <Section title="Catalog">
                <Comics comics={sortedAndFiltered}/>
            </Section>
        </>
    )
}