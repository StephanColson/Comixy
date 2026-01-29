import {Series} from "../components/Series.jsx";
import {useState} from "react";
import Pagination from "rc-pagination";

export function SeriePage(props){
    const {series, onSelectSerie} = props;

    const [currentPage, setCurrentPage] = useState(1);
    const displaySerie = 8;

    const startIndex = (currentPage - 1) * displaySerie;
    const endIndex = startIndex + displaySerie;
    const paginatedSeries = series.slice(startIndex, endIndex);

    return (
        <>
            <h2 className="text-center">Catalog of series!</h2>

            <div>
                <Series series={paginatedSeries} onSelectSerie={onSelectSerie}/>
            </div>

            <Pagination
                className="my-3"
                align="center"
                current={currentPage}
                pageSize={displaySerie}
                total={series.length}
                onChange={setCurrentPage}
            />
        </>
    );
}