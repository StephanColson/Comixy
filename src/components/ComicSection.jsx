import {Combobox} from "@headlessui/react";
import {Row, Col} from "react-bootstrap";

export function ComicSection(props) {
    const {isNewComic, setIsNewComic, comicForm, setComicForm, selectedComic, setSelectedComicID,
        filteredComics, filteredSerie, searchQuery, setSearchQuery, currentYear, series} = props;

    return (
        <>
            <Row className="m-4">
                <Col lg={2} className="mt-4">
                    <div>
                        <input
                            type="checkbox"
                            className="form-check-input me-3"
                            checked={isNewComic}
                            onChange={e => {
                                const checked = e.target.checked;
                                setIsNewComic(checked);

                                if (checked) {
                                    setSelectedComicID(null);
                                }
                            }}
                        />
                        <label className="form-check-label">New Comic</label>
                    </div>
                </Col>

                {isNewComic && (
                    <>
                        <Col lg={5}>
                            <label className="form-label">Comic Title:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter comic title…"
                                value={comicForm.title}
                                onChange={e =>
                                    setComicForm(prev => ({...prev, title: e.target.value}))
                                }
                            />
                        </Col>

                        <Col lg={3}>
                            <label className="form-label">Comic Number:</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Number…"
                                value={comicForm.bookNumber}
                                onChange={e =>
                                    setComicForm(prev => ({...prev, bookNumber: e.target.value}))
                                }
                            />
                        </Col>

                        <Col lg={6}>
                            <label className="form-label">Serie (optional):</label>

                            <Combobox
                                value={
                                    series.find(s => s.id === comicForm.serieID)
                                    ?? (comicForm.serieTitle ? {title: comicForm.serieTitle} : null)
                                }
                                onChange={opt => {
                                    if (!opt) {
                                        setComicForm(prev => ({
                                            ...prev,
                                            serieID: "",
                                            serieTitle: "",
                                        }));
                                    } else if (opt.id) {
                                        setComicForm(prev => ({
                                            ...prev,
                                            serieID: opt.id,
                                            serieTitle: "",
                                        }));
                                    } else {
                                        setComicForm(prev => ({
                                            ...prev,
                                            serieID: "",
                                            serieTitle: opt.title,
                                        }));
                                    }
                                }}
                            >
                                <Combobox.Input
                                    className="form-control"
                                    placeholder="select or type a serie..."
                                    displayValue={opt => opt?.title ?? ""}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setSearchQuery(prev => ({...prev, serie: value}));

                                        setComicForm(prev => ({
                                            ...prev,
                                            serieID: "",
                                            serieTitle: value,
                                        }));
                                    }}
                                />

                                <Combobox.Options className="list-group position-absolute z-3">
                                    {filteredSerie.slice(0, 5).map(serie => (
                                        <Combobox.Option
                                            key={serie.id}
                                            value={serie}
                                            className="list-group-item list-group-item-action"
                                        >
                                            {serie.title}
                                        </Combobox.Option>
                                    ))}

                                    {searchQuery.serie !== "" &&
                                        !filteredSerie.some(
                                            s => s.title.toLowerCase() === searchQuery.serie.toLowerCase()
                                        ) && (
                                            <Combobox.Option
                                                value={{title: searchQuery.serie}}
                                                className="list-group-item list-group-item-action text-primary"
                                            >
                                                Create “{searchQuery.serie}”
                                            </Combobox.Option>
                                        )}
                                </Combobox.Options>
                            </Combobox>
                        </Col>
                    </>
                )}

                {!isNewComic && (
                    <Col lg={5}>
                        <label className="form-label">Comic:</label>

                        <Combobox
                            value={selectedComic}
                            onChange={comic => {
                                setSelectedComicID(comic.id);
                            }}
                        >
                            <Combobox.Input
                                className="form-control"
                                placeholder="Select a comic…"
                                onChange={e =>
                                    setSearchQuery(prev => ({...prev, comic: e.target.value}))
                                }
                                displayValue={comic =>
                                    comic ? `${comic.title} #${comic.bookNumber}` : ""
                                }
                            />

                            <Combobox.Options className="list-group position-absolute z-3">
                                {filteredComics.slice(0, 5).map(comic => (
                                    <Combobox.Option
                                        key={comic.id}
                                        value={comic}
                                        className="list-group-item list-group-item-action"
                                    >
                                        {comic.title} #{comic.bookNumber}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </Combobox>
                    </Col>
                )}
            </Row>
        </>
    );
}