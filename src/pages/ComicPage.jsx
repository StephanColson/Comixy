import {Section} from "../components/Section.jsx";
import {Comics} from "../components/Comics.jsx";
import {Card, Col, Row, Form, Dropdown} from "react-bootstrap";
import {useState} from "react";

const SORT_TITLE_ASC = "TITLE_ASC";
const SORT_TITLE_DESC = "TITLE_DESC";
const SORT_PRICE_ASC = "PRICE_ASC";
const SORT_PRICE_DESC = "PRICE_DESC";
const SORT_YEAR_ASC = "YEAR_ASC";
const SORT_YEAR_DESC = "YEAR_DESC";

export function ComicPage(props) {
    const {comics} = props;
    const [querySearch, setQuerySearch] = useState("");
    const [numberSearch, setNumberSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [genreList, setGenreList] = useState("");
    const [releasedYear, setReleasedYear] = useState("");

    const [sortFilter, setSortFilter] = useState(undefined);


    const filteredComic = filterComics(comics);
    const sortedAndFiltered = sorting(filteredComic);

    function sorting(comics){
        if (sortFilter === SORT_TITLE_ASC){
            return [...comics].sort((a, b) => a.title.localeCompare(b.title))
        }
        if (sortFilter === SORT_TITLE_DESC){
            return [...comics].sort((a, b) => b.title.localeCompare(a.title))
        }
        if (sortFilter === SORT_PRICE_ASC) {
            return [...comics].sort((a, b) => a.price - b.price);
        }
        if (sortFilter === SORT_PRICE_DESC) {
            return [...comics].sort((a, b) => b.price - a.price);
        }
        if (sortFilter === SORT_YEAR_ASC) {
            return [...comics].sort((a, b) => a.released - b.released);
        }
        if (sortFilter === SORT_YEAR_DESC) {
            return [...comics].sort((a, b) => b.released - a.released);
        }
        return comics
    }

    const sortLables = {
        [SORT_TITLE_ASC]: "Title A-Z",
        [SORT_TITLE_DESC]: "Title Z-A",
        [SORT_PRICE_ASC]: "Lowest - Highest",
        [SORT_PRICE_DESC]: "Highest - Lowest",
        [SORT_YEAR_ASC]: "Oldest - Recent",
        [SORT_YEAR_DESC]: "Recent - Oldest",
        undefined: "Default"
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
            <div>
                <Dropdown>
                    <Dropdown.Toggle>Sort by: {sortLables[sortFilter]}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSortFilter(SORT_TITLE_ASC)}>A-Z</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSortFilter(SORT_TITLE_DESC)}>Z-A</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSortFilter(SORT_PRICE_ASC)}>Lowest - Highest</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSortFilter(SORT_PRICE_DESC)}>Highest - Lowest</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSortFilter(SORT_YEAR_ASC)}>Oldest - Recent</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSortFilter(SORT_YEAR_DESC)}>Recent - Oldest</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSortFilter(undefined)}>Default</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
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