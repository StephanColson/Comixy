import {Section} from "../components/Section.jsx";
import {Comics} from "../components/Comics.jsx";
import {useState} from "react";
import Pagination from "rc-pagination";

export function ComicPage(props) {
    const {comics, editions, selectedSerieID, onSelectComic} = props;
    const comicsWithImages = comics;

    /* Serie filtering */
    const baseComics = selectedSerieID
        ? comicsWithImages.filter(c => c.serieID === selectedSerieID)
        : comicsWithImages;

    /* Pagination */
    const [currentPage, setCurrentPage] = useState(1);
    const displayComic = 6;

    const startIndex = (currentPage - 1) * displayComic;
    const endIndex = startIndex + displayComic;
    const paginatedComics = baseComics.slice(startIndex, endIndex);

    return (
        <>
            <div className="text-center">
                <h2>Comics</h2>
            </div>

            <Section>
                <Comics
                    comics={paginatedComics}
                    selectedSerieID={selectedSerieID}
                    onSelectComic={onSelectComic}
                />
            </Section>

            <Pagination
                className="my-3"
                align="center"
                current={currentPage}
                pageSize={displayComic}
                total={baseComics.length}
                onChange={setCurrentPage}
            />
        </>
    );
}
