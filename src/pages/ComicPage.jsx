import {Section} from "../components/Section.jsx";
import {Comics} from "../components/Comics.jsx";
import {Col, Row, Form, Dropdown, Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import Pagination from "rc-pagination";
import {AddComicModal} from "../components/AddComicModal.jsx";

const SORT_TITLE_ASC = "TITLE_ASC";
const SORT_TITLE_DESC = "TITLE_DESC";
const SORT_PRICE_ASC = "PRICE_ASC";
const SORT_PRICE_DESC = "PRICE_DESC";
const SORT_YEAR_ASC = "YEAR_ASC";
const SORT_YEAR_DESC = "YEAR_DESC";

export function ComicPage(props) {
    const {comics, selectedUser, initialGenre} = props;
    const [showModal, setShowModal] = useState(false);
    const [showMyComics, setShowMyComics] = useState(false);

    /*Search Filters*/
    const [querySearch, setQuerySearch] = useState("");
    const [numberSearch, setNumberSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [genreList, setGenreList] = useState("");
    const [releasedYear, setReleasedYear] = useState("");

    /*Pagination*/
    const [currentPage, setCurrentPage] = useState(1);
    const [displayComic, setDisplayComics] = useState(12);

    const [sortFilter, setSortFilter] = useState(undefined);

    const allGenres = Array.from(
        new Set(
            comics ? comics.reduce((acc, comic) => acc.concat(comic.genres), []) : []
        )
    );

    useEffect(() => {
        setCurrentPage(1)
    }, [querySearch, numberSearch, releasedYear, minPrice, maxPrice, genreList, sortFilter]);

    if (!comics) {
        return <div>Loading Comics....</div>;
    }

    useEffect(() => {
        if (initialGenre) {
            setGenreList(initialGenre);
        }
    }, [initialGenre]);

    function filterComics(comics) {
        return comics.filter(c => c.title.toLowerCase().includes(querySearch.toLowerCase())
            || c.author.toLowerCase().includes(querySearch.toLowerCase())
            || c.artist.toLowerCase().includes(querySearch.toLowerCase()))
            .filter(c => !minPrice || Number(minPrice) <= c.price)
            .filter(c => !maxPrice || c.price <= Number(maxPrice))
            .filter(c => !numberSearch || c.bookNumber === Number(numberSearch))
            .filter(c => !releasedYear || c.released === Number(releasedYear))
            .filter(c => {
                if (!genreList) return true;
                const inputGenres = genreList.split(",").map(g => g.trim().toLowerCase()).filter(g => g);
                return c.genres.some(genre => inputGenres.includes(genre.toLowerCase()));
            })
    }

    function sorting(comics) {
        if (sortFilter === SORT_TITLE_ASC) {
            return [...comics].sort((a, b) => a.title.localeCompare(b.title))
        }
        if (sortFilter === SORT_TITLE_DESC) {
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

    /*
    async function handleAddComic(comicsToAdd){
        await addComics(comicsToAdd);
    }
     */

    const listComics = showMyComics && selectedUser
        ? comics.filter(c => selectedUser.ownedComics?.includes(c.id))
        : comics;

    /*Combine Filter and Sorting to work together*/
    const filteredComic = filterComics(listComics);
    const sortedAndFiltered = sorting(filteredComic);

    /*Pagination*/
    const startIndex = (currentPage - 1) * displayComic;
    const endIndex = startIndex + displayComic;
    const paginatedComics = sortedAndFiltered.slice(startIndex, endIndex);


    return (
        <>
            <div className="text-center">
                {selectedUser ? <h2>You can check your own comics or all comics here, {selectedUser.name}</h2> :
                    <h2>You can check out all comics here</h2>}
            </div>
            <Form className="my-4 mx-5">
                <Row>
                    <Col lg={12} xl={12} className="mb-3">
                        <Form.Control value={querySearch}
                                      onChange={e => setQuerySearch(e.target.value)}
                                      placeholder="Search..."/>
                    </Col>

                    <Col lg={12} className="d-flex gap-4 mb-3">
                        <Form.Control type="number"
                                      value={minPrice}
                                      onChange={e => setMinPrice(e.target.value)}
                                      placeholder="Min price"/>

                        <Form.Control type="number"
                                      value={maxPrice}
                                      onChange={e => setMaxPrice(e.target.value)}
                                      placeholder="Max price"/>


                        <Form.Control type="number"
                                      value={numberSearch}
                                      onChange={e => setNumberSearch(e.target.value)}
                                      placeholder="Book number"/>
                    </Col>

                    <Col lg={12} className="d-flex gap-4">
                        <Form.Control type="text"
                                      list="genre-options"
                                      value={genreList}
                                      onChange={e => setGenreList(e.target.value)}
                                      placeholder="Genres"/>
                        <datalist id="genre-options">
                            {allGenres.map(g => (
                                <option key={g} value={g}/>
                            ))}
                        </datalist>
                        <Form.Control type="number"
                                      value={releasedYear}
                                      onChange={e => setReleasedYear(e.target.value)}
                                      placeholder="Year"/>
                    </Col>
                </Row>
            </Form>

            <Section title="Catalog">
                <div className="text-center mb-3">
                    <div className="mb-2">
                        <Button className="mx-2 btn-warning" onClick={() => setShowModal(true)}>New Comic</Button>
                        <Button className="mx-2 btn-warning" onClick={() => setShowMyComics(smc => !smc)}>
                            {showMyComics ? "All Comics" : "My Comics"}
                        </Button>
                    </div>
                    <Dropdown>
                        <Dropdown.Toggle variant="warning">Sort by: {sortLables[sortFilter]}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setSortFilter(SORT_TITLE_ASC)}>A-Z</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortFilter(SORT_TITLE_DESC)}>Z-A</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortFilter(SORT_PRICE_ASC)}>Lowest -
                                Highest</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortFilter(SORT_PRICE_DESC)}>Highest -
                                Lowest</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortFilter(SORT_YEAR_ASC)}>Oldest - Recent</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortFilter(SORT_YEAR_DESC)}>Recent - Oldest</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortFilter(undefined)}>Default</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <AddComicModal show={showModal} onHide={() => setShowModal(false)}/>
                <Pagination className="mb-3 mt-2" align="center" current={currentPage} pageSize={displayComic}
                            total={sortedAndFiltered.length} onChange={setCurrentPage}/>
                <Comics comics={paginatedComics} selectedUser={selectedUser}/>
            </Section>
            <Pagination className="my-3" align="center" current={currentPage} pageSize={displayComic}
                        total={sortedAndFiltered.length} onChange={setCurrentPage}/>
        </>
    )
}