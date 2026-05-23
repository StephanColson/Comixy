import { Combobox } from "@headlessui/react";
import { Row, Col } from "react-bootstrap";

export function ComicSection(props) {
  const {
    isNewComic,
    // setIsNewComic,
    comicForm,
    setComicForm,
    selectedComic,
    setSelectedComicID,
    filteredComics,
    filteredSerie,
    filteredUniverses,
    searchQuery,
    setSearchQuery,
    //currentYear,
    series,
    universes,
    errors,
  } = props;

  return (
    <>
      <div className="d-flex justify-content-center">
        <Row className="m-3">
          {isNewComic && (
            <>

                          {isNewComic &&
                !comicForm.serieID &&
                comicForm.serieTitle.trim() && (
                  <Row className="mt-3">
                    <Col lg={12}>
                       <label className="form-label">Universe:</label>
                      <Combobox
                        value={
                          universes.find(
                            (u) => u.id === comicForm.universeID,
                          ) ??
                          (comicForm.universeTitle
                            ? { title: comicForm.universeTitle }
                            : null)
                        }
                        onChange={(opt) => {
                          if (!opt) {
                            setComicForm((prev) => ({
                              ...prev,
                              universeID: "",
                              universeTitle: "",
                            }));
                          } else if (opt.id) {
                            setComicForm((prev) => ({
                              ...prev,
                              universeID: opt.id,
                              universeTitle: opt.title,
                            }));
                          } else {
                            setComicForm((prev) => ({
                              ...prev,
                              universeID: "",
                              universeTitle: opt.title,
                            }));
                          }
                        }}
                      >
                        <Combobox.Input
                          className="form-control"
                          placeholder="select or type a universe..."
                          displayValue={(opt) => opt?.title ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSearchQuery((prev) => ({
                              ...prev,
                              universe: value,
                            }));

                            const existing = universes.find(
                              (u) =>
                                u.title.toLowerCase() === value.toLowerCase(),
                            );

                            if (existing) {
                              setComicForm((prev) => ({
                                ...prev,
                                universeID: existing.id,
                                universeTitle: existing.title,
                              }));
                            } else {
                              setComicForm((prev) => ({
                                ...prev,
                                universeID: "",
                                universeTitle: value,
                              }));
                            }
                          }}
                        />

                        <Combobox.Options className="list-group position-absolute z-3">
                          {filteredUniverses.slice(0, 5).map((universe) => (
                            <Combobox.Option
                              key={universe.id}
                              value={universe}
                              className="list-group-item list-group-item-action"
                            >
                              {universe.title}
                            </Combobox.Option>
                          ))}

                          {searchQuery.universe !== "" &&
                            !filteredUniverses.some(
                              (u) =>
                                u.title.toLowerCase() ===
                                searchQuery.universe.toLowerCase(),
                            ) && (
                              <Combobox.Option
                                value={{ title: searchQuery.universe }}
                                className="list-group-item list-group-item-action text-primary"
                              >
                                Create "{searchQuery.universe}"
                              </Combobox.Option>
                            )}
                        </Combobox.Options>
                      </Combobox>
                    </Col>
                  </Row>
                )}
                
              <Row className="mb-5">
                <Col lg={12}>
                  <label className="form-label">Serie:</label>
                  <Combobox
                    value={
                      series.find((s) => s.id === comicForm.serieID) ??
                      (comicForm.serieTitle
                        ? { title: comicForm.serieTitle }
                        : null)
                    }
                    onChange={(opt) => {
                      if (!opt) {
                        setComicForm((prev) => ({
                          ...prev,
                          serieID: "",
                          serieTitle: "",
                        }));
                      } else if (opt.id) {
                        setComicForm((prev) => ({
                          ...prev,
                          serieID: opt.id,
                          serieTitle: opt.title,
                        }));
                      } else {
                        setComicForm((prev) => ({
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
                      displayValue={(opt) => opt?.title ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearchQuery((prev) => ({ ...prev, serie: value }));

                        const existing = series.find(
                          (s) => s.title.toLowerCase() === value.toLowerCase(),
                        );

                        if (existing) {
                          setComicForm((prev) => ({
                            ...prev,
                            serieID: existing.id,
                            serieTitle: existing.title,
                          }));
                        } else {
                          setComicForm((prev) => ({
                            ...prev,
                            serieID: "",
                            serieTitle: value,
                          }));
                        }
                      }}
                    />

                    <Combobox.Options className="list-group position-absolute z-3">
                      {filteredSerie.slice(0, 5).map((serie) => (
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
                          (s) =>
                            s.title.toLowerCase() ===
                            searchQuery.serie.toLowerCase(),
                        ) && (
                          <Combobox.Option
                            value={{ title: searchQuery.serie }}
                            className="list-group-item list-group-item-action text-primary"
                          >
                            Create “{searchQuery.serie}”
                          </Combobox.Option>
                        )}
                    </Combobox.Options>
                  </Combobox>

                  {errors?.serie && (
                    <div className="text-danger small">{errors.serie}</div>
                  )}
                </Col>
              </Row>

              <Row>
                <Col lg={9}>
                  <label className="form-label">Comic Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter comic title…"
                    value={comicForm.title}
                    onChange={(e) =>
                      setComicForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                  {errors?.title && (
                    <div className="text-danger small">{errors.title}</div>
                  )}
                </Col>

                <Col lg={3}>
                  <label className="form-label">Comic Number:</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Number…"
                    value={comicForm.bookNumber}
                    onChange={(e) =>
                      setComicForm((prev) => ({
                        ...prev,
                        bookNumber: e.target.value,
                      }))
                    }
                  />
                  {errors?.bookNumber && (
                    <div className="text-danger small">{errors.bookNumber}</div>
                  )}
                </Col>
              </Row>
            </>
          )}

          {!isNewComic && (
            <Row className="mb-5">
              <Col lg={12}>
                <label className="form-label">Comic:</label>
                <div className="w-100">
                  <Combobox
                    value={selectedComic}
                    onChange={(comic) => {
                      setSelectedComicID(comic.id);
                    }}
                  >
                    <Combobox.Input
                      className="form-control"
                      placeholder="Select an existing comic from the database"
                      onChange={(e) =>
                        setSearchQuery((prev) => ({
                          ...prev,
                          comic: e.target.value,
                        }))
                      }
                      displayValue={(comic) =>
                        comic ? `${comic.title} #${comic.bookNumber}` : ""
                      }
                    />

                    <Combobox.Options className="list-group position-absolute z-3">
                      {filteredComics.slice(0, 5).map((comic) => (
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
                  {errors?.comic && (
                    <div className="text-danger small">{errors.comic}</div>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Row>
      </div>
    </>
  );
}
