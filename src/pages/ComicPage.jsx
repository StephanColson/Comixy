import {Section} from "../components/Section.jsx";
import {Comics} from "../components/Comics.jsx";
import {useEffect, useState} from "react";
import Pagination from "rc-pagination";
import {updateSerie} from "../api/serieInfo.js";

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

    const [editingDescription, setEditingDescription] = useState(false);
    const [descriptionInput, setDescriptionInput] = useState("");

    function handleEditClick() {
        setDescriptionInput(selectedSerie?.description ?? "");
        setEditingDescription(true);
    }

    async function handleSaveDescription() {
        await updateSerie({...selectedSerie, description: descriptionInput});
        setEditingDescription(false);
    }

    return (
        <>
            <div className="text-center">
                <h2>
                    {selectedSerie
                        ? `Comics – ${selectedSerie.title}`
                        : "All Comics"}
                </h2>
                {selectedSerie && (
                    <div className="mb-3">
                        {editingDescription ? (
                            <>
                <textarea
                    className="form-control w-75 mx-auto"
                    rows={3}
                    value={descriptionInput}
                    onChange={e => setDescriptionInput(e.target.value)}
                    placeholder="Enter serie description..."
                />
                                <div className="d-flex justify-content-center gap-2 mt-2">
                                    <button className="btn btn-sm btn-success" onClick={handleSaveDescription}>Save</button>
                                    <button className="btn btn-sm btn-secondary" onClick={() => setEditingDescription(false)}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                {selectedSerie.description && (
                                    <p>{selectedSerie.description}</p>
                                )}
                                <button className="btn btn-sm btn-outline-warning" onClick={handleEditClick}>Edit</button>
                            </>
                        )}
                    </div>
                )}
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
