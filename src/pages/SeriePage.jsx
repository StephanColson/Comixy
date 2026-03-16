import {Series} from "../components/Series.jsx";
import {useState} from "react";
import Pagination from "rc-pagination";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function SeriePage(props){
    const {series, onSelectSerie} = props;
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const displaySerie = 10;

    const sortedSeries = [...series].sort((a, b) => a.title.localeCompare(b.title));

    const filteredSeries = selectedLetter
        ? sortedSeries.filter(s => s.title.toUpperCase().startsWith(selectedLetter))
        : sortedSeries;

    const startIndex = (currentPage - 1) * displaySerie;
    const endIndex = startIndex + displaySerie;
    const paginatedSeries = filteredSeries.slice(startIndex, endIndex);

    function handleLetterClick(letter) {
        setSelectedLetter(prev => prev === letter ? null : letter);
        setCurrentPage(1);
    }

    return (
        <>
            <h2 className="text-center">All Series</h2>

            <div className="d-flex flex-wrap justify-content-center gap-1 my-3">
                {ALPHABET.map(letter => (
                    <button
                        key={letter}
                        onClick={() => handleLetterClick(letter)}
                        className={`btn btn-sm ${selectedLetter === letter ? "btn-warning" : "btn-outline-warning"}`}
                    >
                        {letter}
                    </button>
                ))}
            </div>

            <div>
                <Series series={paginatedSeries} onSelectSerie={onSelectSerie}/>
            </div>

            <Pagination
                className="my-3"
                align="center"
                current={currentPage}
                pageSize={displaySerie}
                total={filteredSeries.length}
                onChange={setCurrentPage}
            />
        </>
    );
}