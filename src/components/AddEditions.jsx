import {useComicCollectionData} from "../api/comicInfo.js";
import {useState} from "react";
import {Row, Col} from "react-bootstrap";
import {Combobox} from "@headlessui/react";
import {useEditionCollectionData} from "../api/editionInfo.js";
import {Section} from "./Section.jsx";

const FORMAT_OPTIONS = [
    {id: "soft", label: "Soft-cover"},
    {id: "hard", label: "Hard-cover"},
];

const PRINT_TYPE_OPTIONS = [
    {id: "first", label: "First print"},
    {id: "reprint", label: "Reprint"},
];

const PUBLISHER_OPTIONS = [
    {id: 1, name: "Dark Horse Comics"},
    {id: 2, name: "Image Comics"},
    {id: 3, name: "Fantagraphics"},
];

const PERSON_OPTIONS = [
    { id: 1, name: "Alan Moore" },
    { id: 2, name: "Frank Miller" },
    { id: 3, name: "Jack Kirby" },
];

const ROLE_OPTIONS = [
    { id: "writer", label: "Writer" },
    { id: "artist", label: "Artist" },
    { id: "inker", label: "Inker" },
    { id: "colorist", label: "Colorist" },
    { id: "letterer", label: "Letterer" },
];

export function AddEditions(props) {
    const {selectedComicID, setSelectedComicID} = props;

    const {comics, loading} = useComicCollectionData();
    const {editions, loading: editionsLoading} = useEditionCollectionData();

    const [comicQuery, setComicQuery] = useState("");

    const filteredComics =
        comicQuery === ""
            ? comics
            : comics?.filter(comic =>
                `${comic.title} ${comic.bookNumber}`
                    .toLowerCase()
                    .includes(comicQuery.toLowerCase())
            );

    const selectedComic =
        comics?.find(c => c.id === selectedComicID) ?? null;

    const [editionForm, setEditionForm] = useState({
        comicID: selectedComicID,
        printYear: "",
        printType: null,
        format: null,
        organizationID: null,
        selfPublished: false,
    });

    const [contributors, setContributors] = useState([]);

    const [contributorDraft, setContributorDraft] = useState({
        personID: null,
        role: null,
    });

    return (
        <>
            <Row className="m-4">
                <Col lg={9}>
                    <label className="form-label">Comic:</label>

                    <Combobox
                        value={selectedComic}
                        onChange={(comic) => {
                            setSelectedComicID(comic.id);
                            setEditionForm(prev => ({
                                ...prev,
                                comicID: comic.id,
                            }));
                        }}
                    >
                        <Combobox.Input
                            className="form-control"
                            placeholder="Select a comic…"
                            onChange={(e) => setComicQuery(e.target.value)}
                            displayValue={(comic) =>
                                comic ? `${comic.title} #${comic.bookNumber}` : ""
                            }
                        />

                        <Combobox.Options className="list-group position-absolute w-100 z-3">
                            {loading && (
                                <div className="list-group-item">Loading…</div>
                            )}

                            {filteredComics?.length === 0 && comicQuery !== "" && (
                                <div className="list-group-item text-muted">
                                    No results
                                </div>
                            )}

                            {filteredComics?.map(comic => (
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

                <Col lg={3}>
                    <label className="form-label">Published:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={editionForm.printYear}
                        onChange={e =>
                            setEditionForm(prev => ({
                                ...prev,
                                printYear: Number(e.target.value),
                            }))
                        }
                        placeholder="Year"
                    />
                </Col>
            </Row>

            <Row className="m-4">
                <Col lg={6}>
                    <label className="form-label">Format:</label>

                    <Combobox
                        value={
                            FORMAT_OPTIONS.find(f => f.id === editionForm.format) ?? null
                        }
                        onChange={(opt) => {
                            setEditionForm(prev => ({
                                ...prev,
                                format: opt ? opt.id : null,
                            }));
                        }}
                    >
                        <Combobox.Input
                            className="form-control"
                            displayValue={(opt) => opt?.label ?? ""}
                            placeholder="Select format…"
                        />

                        <Combobox.Options className="list-group position-absolute w-100 z-3">
                            {FORMAT_OPTIONS.map(opt => (
                                <Combobox.Option
                                    key={opt.id}
                                    value={opt}
                                    className="list-group-item list-group-item-action"
                                >
                                    {opt.label}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    </Combobox>
                </Col>

                <Col lg={6}>
                    <label className="form-label">Print:</label>

                    <Combobox
                        value={
                            PRINT_TYPE_OPTIONS.find(p => p.id === editionForm.printType) ?? null
                        }
                        onChange={(opt) => {
                            setEditionForm(prev => ({
                                ...prev,
                                printType: opt ? opt.id : null,
                            }));
                        }}
                    >
                        <Combobox.Input
                            className="form-control"
                            displayValue={(opt) => opt?.label ?? ""}
                            placeholder="Select print type…"
                        />

                        <Combobox.Options className="list-group position-absolute w-100 z-3">
                            {PRINT_TYPE_OPTIONS.map(opt => (
                                <Combobox.Option
                                    key={opt.id}
                                    value={opt}
                                    className="list-group-item list-group-item-action"
                                >
                                    {opt.label}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    </Combobox>
                </Col>

                <Col lg={2} className="mt-4">
                    <div>
                        <input type="checkbox" className="form-check-input me-3" checked={editionForm.selfPublished}
                               onChange={e => {
                                   const checked = e.target.checked;

                                   setEditionForm(prev => ({
                                       ...prev,
                                       selfPublished: checked,
                                       organizationID: checked ? null : prev.organizationID,
                                   }));
                               }}/>
                        <label className="form-check-label">
                            Self-published
                        </label>
                    </div>
                </Col>

                <Col lg={10} className="mt-4">
                    {!editionForm.selfPublished && (
                        <Col>
                            <label className="form-label">Publisher:</label>
                            <Combobox value={PUBLISHER_OPTIONS.find(p => p.id === editionForm.organizationID) ?? null}
                                      onChange={(opt) => {
                                          setEditionForm(prev => ({
                                              ...prev,
                                              organizationID: opt ? opt.id : null,
                                          }));
                                      }}>
                                <Combobox.Input className="form-control"
                                                displayValue={(opt) => opt?.name ?? ""}
                                                placeholder="Select publisher…"/>
                                <Combobox.Options>
                                    {PUBLISHER_OPTIONS.map(opt => (
                                        <Combobox.Option
                                            key={opt.id}
                                            value={opt}
                                            className="list-group-item list-group-item-action"
                                        >
                                            {opt.name}
                                        </Combobox.Option>
                                    ))}
                                </Combobox.Options>
                            </Combobox>
                        </Col>
                    )}
                </Col>

                <Col lg={5} className="mt-3">
                    <label className="form-label">Person:</label>
                    <Combobox
                        value={PERSON_OPTIONS.find(p => p.id === contributorDraft.personID) ?? null}
                        onChange={(opt) =>
                            setContributorDraft(prev => ({
                                ...prev,
                                personID: opt ? opt.id : null,
                            }))
                        }
                    >
                        <Combobox.Input
                            className="form-control"
                            placeholder="Select person…"
                            displayValue={(opt) => opt?.name ?? ""}
                        />
                        <Combobox.Options className="list-group position-absolute w-100 z-3">
                            {PERSON_OPTIONS.map(opt => (
                                <Combobox.Option
                                    key={opt.id}
                                    value={opt}
                                    className="list-group-item list-group-item-action"
                                >
                                    {opt.name}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    </Combobox>

                </Col>

                <Col lg={5} className="mt-3">
                    <label className="form-label">Role:</label>
                    <Combobox
                        value={ROLE_OPTIONS.find(r => r.id === contributorDraft.role) ?? null}
                        onChange={(opt) =>
                            setContributorDraft(prev => ({
                                ...prev,
                                role: opt ? opt.id : null,
                            }))
                        }
                    >
                        <Combobox.Input
                            className="form-control"
                            placeholder="Select role…"
                            displayValue={(opt) => opt?.label ?? ""}
                        />
                        <Combobox.Options className="list-group position-absolute w-100 z-3">
                            {ROLE_OPTIONS.map(opt => (
                                <Combobox.Option
                                    key={opt.id}
                                    value={opt}
                                    className="list-group-item list-group-item-action"
                                >
                                    {opt.label}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    </Combobox>
                </Col>

                <Col lg={2} className="mt-5">
                    <button
                        className="btn btn-primary"
                        disabled={!contributorDraft.personID || !contributorDraft.role}
                        onClick={() => {
                            setContributors(prev => [
                                ...prev,
                                contributorDraft,
                            ]);

                            setContributorDraft({
                                personID: null,
                                role: null,
                            });
                        }}
                    >
                        Add
                    </button>
                </Col>
            </Row>

            <Section>
                <Col lg={12}>
                    <Row>
                        <Col lg={5}>Person</Col>
                        <Col lg={5}>Role</Col>
                        <Col lg={2}></Col>
                    </Row>
                </Col>

                {contributors.map((c, idx) => (
                    <Col lg={12} key={idx}>
                        <Row className="align-items-center py-1 border-bottom">
                            <Col lg={5}>
                                {PERSON_OPTIONS.find(p => p.id === c.personID)?.name}
                            </Col>

                            <Col lg={5}>
                                {ROLE_OPTIONS.find(r => r.id === c.role)?.label}
                            </Col>

                            <Col lg={2} className="text-end">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                        setContributors(prev =>
                                            prev.filter((_, i) => i !== idx)
                                        )
                                    }
                                >
                                    Remove
                                </button>
                            </Col>
                        </Row>
                    </Col>
                ))}

                {contributors.length === 0 && (
                    <Col className="text-muted text-center py-2">
                        No contributors added yet
                    </Col>
                )}
            </Section>
        </>
    );
}
