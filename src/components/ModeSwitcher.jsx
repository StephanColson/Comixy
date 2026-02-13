export function ModeSwitcher(props) {
    const {isNewComic, setIsNewComic} = props;
    return (
        <div className="d-flex justify-content-center gap-3">
            <button
                className={isNewComic ? "btn btn-warning" : "btn btn-outline-warning"}
                onClick={() => setIsNewComic(true)}
            >
                Add Comic
            </button>

            <button
                className={!isNewComic ? "btn btn-warning" : "btn btn-outline-warning"}
                onClick={() => setIsNewComic(false)}
            >
                Add Edition
            </button>
        </div>
    );
}