import {Section} from "../components/Section.jsx";
import {Comics} from "../components/Comics.jsx";
import {Col, Row, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import Pagination from "rc-pagination";
import {addComic, updateComic} from "../api/comicInfo.js";

const SORT_TITLE_ASC = "TITLE_ASC";
const SORT_TITLE_DESC = "TITLE_DESC";
const SORT_PRICE_ASC = "PRICE_ASC";
const SORT_PRICE_DESC = "PRICE_DESC";
const SORT_YEAR_ASC = "YEAR_ASC";
const SORT_YEAR_DESC = "YEAR_DESC";

export function ComicPage(props) {
    const {comics, initialGenre, selectedSerieID, onSelectComic} = props;
    const [showModal, setShowModal] = useState(false);
    const [showMyComics, setShowMyComics] = useState(false);

    const [validated, setValidated] = useState(false);

    const handleSave = async (comicData, form) => {
        if (!form.checkValidity()) {
            setValidated(true);
            return false;
        }

        //Edit button anders New Comic
        if (comicData.id) {
            await updateComic(comicData);
        } else {
            await addComic({
                ...comicData,
                genres: comicData.genres.map(g => g.trim()).filter(g => g),
            });
        }

        setValidated(false);
        return true;
    };


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
            || c.authorID?.toLowerCase().includes(querySearch.toLowerCase())
            || c.artistID?.toLowerCase().includes(querySearch.toLowerCase()))
            .filter(c => !minPrice || Number(minPrice) <= c.price)
            .filter(c => !maxPrice || c.price <= Number(maxPrice))
            .filter(c => !numberSearch || c.bookNumber === Number(numberSearch))
            .filter(c => {
                if (!releasedYear) return true;
                return c.year.toString().includes(releasedYear.toString());
            })
            .filter(c => {
                if (!genreList) return true;
                const inputGenres = genreList.split(",").map(g => g.trim().toLowerCase()).filter(g => g);
                return inputGenres.every(ig => c.genres.some(g => g.toLowerCase().includes(ig)));
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
            return [...comics].sort((a, b) => a.year - b.year);
        }
        if (sortFilter === SORT_YEAR_DESC) {
            return [...comics].sort((a, b) => b.year - a.year);
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

    const baseComics = selectedSerieID
        ? comics.filter(c => c.serieID === selectedSerieID)
        : comics;

    const listComics = showMyComics && selectedUser
        ? baseComics.filter(c => selectedUser.ownedComics?.includes(c.id))
        : baseComics;

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
                <h2>Comics of {comics.serieID}</h2>
            </div>
            <Form className="my-4 mx-5">
                <Row className="justify-content-center">
                    <Col lg={8} xl={8} className="mb-3">
                        <Form.Control value={querySearch}
                                      onChange={e => setQuerySearch(e.target.value)}
                                      placeholder="Search..."/>
                    </Col>
                </Row>
            </Form>

            <Section>
                <Comics comics={paginatedComics}
                        selectedSerieID={selectedSerieID}
                        onSelectComic={onSelectComic}
                        validated={validated}
                        setValidated={setValidated}
                        handleSave={handleSave}/>
            </Section>
            <Pagination className="my-3" align="center" current={currentPage} pageSize={displayComic}
                        total={sortedAndFiltered.length} onChange={setCurrentPage}/>
        </>
    )
}