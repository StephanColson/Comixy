import {Section} from "../components/Section.jsx";
import {Comics} from "../components/Comics.jsx";
import {useEffect, useState} from "react";
import Pagination from "rc-pagination";

function useSlideSize() {
    const [slideSize, setSlideSize] = useState(window.innerWidth < 768 ? 4 : 6);

    useEffect(() => {
        const handler = () => setSlideSize(window.innerWidth < 768 ? 4 : 6);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    return slideSize;
}

export function ComicPage(props) {
    const {comics, editions, selectedSerieID, onSelectComic, series} = props;
    const slideSize = useSlideSize();

    const baseComics = selectedSerieID
        ? [...comics].filter(c => c.serieID === selectedSerieID).sort((a, b) => a.title.localeCompare(b.title))
        : [...comics].sort((a, b) => a.title.localeCompare(b.title));

    const selectedSerie = selectedSerieID
        ? series.find(s => s.id === selectedSerieID)
        : null;

    const [currentPage, setCurrentPage] = useState(1);
    const displayComic = 18;

    const startIndex = (currentPage - 1) * displayComic;
    const endIndex = startIndex + displayComic;
    const paginatedComics = baseComics.slice(startIndex, endIndex);

    const slides = Array.from(
        {length: Math.ceil(paginatedComics.length / slideSize)},
        (_, i) => paginatedComics.slice(i * slideSize, i * slideSize + slideSize)
    );

    return (
        <>
            <div className="text-center">
                <h2>
                    {selectedSerie
                        ? `Comics – ${selectedSerie.title}`
                        : "All Comics"}
                </h2>
            </div>

            <Section>
                <Comics
                    comics={paginatedComics}
                    selectedSerieID={selectedSerieID}
                    series={series}
                    onSelectComic={onSelectComic}
                    editions={editions}
                    slides={slides}
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
