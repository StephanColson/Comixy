import {addComic, useComicCollectionData} from "../api/comicInfo.js";
import {addEdition, useEditionCollectionData} from "../api/editionInfo.js";
import {addOrganization, useOrganizationCollectionData} from "../api/organizationInfo.js";
import {addPerson, usePeopleCollectionData} from "../api/personInfo.js";
import {addRole, useRoleCollectionData} from "../api/roleInfo.js";
import {useState} from "react";
import {Row, Col} from "react-bootstrap";
import {Combobox} from "@headlessui/react";
import {Section} from "./Section.jsx";
import {addSerie, useSerieCollectionData} from "../api/serieInfo.js";
import {addComicContributor} from "../api/comicContributer.js";

function filterList (props){
    const {list, search, selector} = props;
    if(!search) return list;
    const lower = search.toLowerCase();
    return list.filter(item => selector(item).toLowerCase().includes(lower));
}

export function AddEditions(props) {
    const {selectedComicID, setSelectedComicID} = props;

    const {comics, loading} = useComicCollectionData();
    const {editions = [], loading: editionsLoading} = useEditionCollectionData();
    const {organizations = [], loading: organizationsLoading} = useOrganizationCollectionData();
    const {peoples = [], loading: peoplesLoading} = usePeopleCollectionData();
    const {roles = [], loading: rolesLoading} = useRoleCollectionData();
    const {series, loading: serieLoading} = useSerieCollectionData();

    const [isNewComic, setIsNewComic] = useState(false);
    const currentYear = new Date().getFullYear();

    const [comicForm, setComicForm] = useState({
        title: "",
        bookNumber: "",
        serieID: "",
        serieTitle: "",
    });

    const [editionForm, setEditionForm] = useState({
        comicID: selectedComicID,
        printYear: "",
        printType: null,
        printTypeName: "",
        format: null,
        formatName: "",
        organizationID: null,
        organizationName: "",
        selfPublished: false,
    });

    const formats = editions.map(e => e.format);
    const uniqueFormats = [...new Set(formats)];
    const dataFormat = uniqueFormats.map(f => ({
        id: f,
        label: f,
    }))

    const printType = editions.map(e => e.printType);
    const uniquePrintType = [...new Set(printType)];
    const dataPrintType = uniquePrintType.map(pt => ({
        id: pt,
        label: pt,
    }))

    const [searchQuery, setSearchQuery] = useState({
        comic: "",
        serie: "",
        format: "",
        printType: "",
        publisher: "",
        person: "",
        role: "",
    });

    const filteredComics = filterList({
        list: comics,
        search: searchQuery.comic,
        selector: c => `${c.title} ${c.bookNumber}`,
    })

    const filteredSerie = filterList({
        list: series,
        search: searchQuery.serie,
        selector: s => s.title,
    })

    const filteredPrintType = filterList({
        list: dataPrintType,
        search: editionForm.printTypeName,
        selector: pt => pt.label,
    })

    const filteredFormat = filterList({
        list: dataFormat,
        search: editionForm.formatName,
        selector: f => f.label,
    })

    const filteredPublishers = filterList({
        list: organizations,
        search: searchQuery.publisher,
        selector: p => p.name,
    })

    const filteredPersons = filterList({
        list: peoples,
        search: searchQuery.person,
        selector: p => p.name,
    })

    const filteredRoles = filterList({
        list: roles,
        search: searchQuery.role,
        selector: r => r.type,
    })

    const selectedComic =
        comics?.find(c => c.id === selectedComicID) ?? null;

    const [contributors, setContributors] = useState([]);

    const [contributorDraft, setContributorDraft] = useState({
        peopleID: null,
        peopleName: "",
        roleID: null,
        roleName: "",
    });

    async function handleSubmit() {
        try {
            console.log("Submitting...");

            const serieID =
                comicForm.serieID ||
                (comicForm.serieTitle
                    ? await addSerie({
                        title: comicForm.serieTitle,
                        description: "",
                        franchiseID: null,
                    })
                    : null);

            const comicID =
                isNewComic
                    ? await addComic({
                        title: comicForm.title,
                        bookNumber: comicForm.bookNumber,
                        genres: comicForm.genres,
                        serieID: serieID,
                        price: null,
                    })
                    : selectedComicID;

            const publisherID =
                editionForm.selfPublished
                    ? null
                    : editionForm.organizationID ||
                    (editionForm.organizationName
                        ? await addOrganization({name: editionForm.organizationName})
                        : null);

            const contributorList = await Promise.all(
                contributors.map(async c => {
                    const peopleID =
                        c.peopleID ||
                        (c.peopleName ? await addPerson({name: c.peopleName}) : null);

                    const roleID =
                        c.roleID ||
                        (c.roleName ? await addRole({type: c.roleName}) : null);

                    return {peopleID, roleID};
                })
            );

            const editionID = await addEdition({
                comicID,
                format: editionForm.format ?? editionForm.formatName,
                imgURL: null,
                printYear: editionForm.printYear || null,
                printType: editionForm.printType ?? editionForm.printTypeName,
                numberInCollection: editionForm.numberInCollection || null,
                organizationID: publisherID,
                selfPublished: editionForm.selfPublished,
            });

            await Promise.all(
                contributorList.map(c =>
                    addComicContributor({
                        comicID,
                        editionID,
                        peopleID: c.peopleID,
                        roleID: c.roleID,
                    })
                )
            );

            console.log("Submit complete!");
        } catch (err) {
            console.error("Submit error:", err);
        }
    }

    return (
        <>
            <Row className="m-4">
                <Col lg={2} className="mt-4">
                    <div>
                        <input type="checkbox" className="form-check-input me-3"
                               checked={isNewComic}
                               onChange={e => {
                                   const checked = e.target.checked;

                                   setIsNewComic(checked);

                                   if (checked) {
                                       setSelectedComicID(null);
                                       setEditionForm(prev => ({...prev, comicID: null,}));
                                   }
                               }}/>
                        <label className="form-check-label">
                            New Comic
                        </label>
                    </div>
                </Col>

                {isNewComic && (
                    <>
                        <Col lg={5}>
                            <label className="form-label">Comic Title:</label>
                            <input type="text" className="form-control"
                                   placeholder="Enter comic title…"
                                   value={comicForm.title}
                                   onChange={(e) =>
                                       setComicForm(prev => ({...prev, title: e.target.value}))
                                   }
                            />
                        </Col>

                        <Col lg={3}>
                            <label className="form-label">Comic Number:</label>
                            <input type="number" className="form-control"
                                   placeholder="Number…"
                                   value={comicForm.bookNumber}
                                   onChange={(e) =>
                                       setComicForm(prev => ({...prev, bookNumber: e.target.value}))
                                   }
                            />
                        </Col>

                        <Col lg={6}>
                            <label className="form-label">Serie (optional):</label>
                            <Combobox value={series.find(s => s.id === comicForm.serieID)
                                ?? (comicForm.serieTitle ? {title: comicForm.serieTitle} : null)
                            }
                                      onChange={(opt) => {
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
                                <Combobox.Input className="form-control"
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
                                                }}/>
                                <Combobox.Options className="list-group position-absolute z-3">
                                    {filteredSerie?.map(serie => (
                                        <Combobox.Option key={serie.id} value={serie}
                                                         className="list-group-item list-group-item-action">
                                            {serie.title}
                                        </Combobox.Option>
                                    ))}

                                    {searchQuery.serie !== "" &&
                                        !filteredSerie?.some(
                                            s => s.title.toLowerCase() === searchQuery.serie.toLowerCase()
                                        ) && (
                                            <Combobox.Option value={{title: searchQuery.serie}}
                                                             className="list-group-item list-group-item-action text-primary">
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
                                onChange={(e) => setSearchQuery(prev => ({...prev, comic: e.target.value}))}
                                displayValue={(comic) =>
                                    comic ? `${comic.title} #${comic.bookNumber}` : ""
                                }
                            />

                            <Combobox.Options className="list-group position-absolute z-3">
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
                )}

                <Col lg={3}>
                    <label className="form-label">Published:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={editionForm.printYear}
                        min={1837}
                        max={currentYear}
                        onChange={e => {
                            const inputYear = e.target.value;

                            if (inputYear === "") {
                                setEditionForm(prev => ({...prev, printYear: ""}));
                                return;
                            }

                            if (!/^\d{0,4}$/.test(inputYear)) return;

                            setEditionForm(prev => ({
                                ...prev,
                                printYear: inputYear,
                            }));
                        }}
                        placeholder="year published"
                    />
                </Col>
            </Row>

            <Row className="m-4">
                <Col lg={6}>
                    <label className="form-label">Format:</label>

                    <Combobox
                        value={
                            dataFormat.find(f => f.id === editionForm.format) ??
                            (editionForm.formatName ? {id: null, label: editionForm.formatName} : null)
                        }
                        onChange={(opt) => {
                            setEditionForm(prev => ({
                                ...prev,
                                format: opt ? opt.id : null,
                                formatName: opt?.id ? "" : prev.formatName,
                            }));
                        }}
                    >
                        <Combobox.Input
                            className="form-control"
                            displayValue={(opt) => opt?.label ?? editionForm.formatName}
                            placeholder="Select or type format…"
                            onChange={e =>
                                setEditionForm(prev => ({
                                    ...prev,
                                    format: null,
                                    formatName: e.target.value,
                                }))
                            }
                        />

                        <Combobox.Options className="list-group position-absolute z-3">
                            {filteredFormat.map(opt => (
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
                            dataPrintType.find(p => p.id === editionForm.printType) ??
                            (editionForm.printTypeName ? {id: null, label: editionForm.printTypeName} : null)
                        }
                        onChange={(opt) => {
                            setEditionForm(prev => ({
                                ...prev,
                                printType: opt ? opt.id : null,
                                printTypeName: opt?.id ? "" : prev.printTypeName,
                            }));
                        }}
                    >
                        <Combobox.Input
                            className="form-control"
                            displayValue={(opt) => opt?.label ?? editionForm.printTypeName}
                            placeholder="Type or Select print type…"
                            onChange={e =>
                                setEditionForm(prev => ({
                                    ...prev,
                                    printType: null,
                                    printTypeName: e.target.value,
                                }))
                            }
                        />

                        <Combobox.Options className="list-group position-absolute z-3">
                            {filteredPrintType.map(opt => (
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
                            <Combobox value={
                                organizations.find(p => p.id === editionForm.organizationID)
                                ?? (editionForm.organizationName ? {name: editionForm.organizationName} : null)}
                                      onChange={(opt) => {
                                          if (!opt) {
                                              setEditionForm(prev => ({
                                                  ...prev,
                                                  organizationID: null,
                                                  organizationName: "",
                                              }));
                                          } else if (opt.id) {
                                              setEditionForm(prev => ({
                                                  ...prev,
                                                  organizationID: null,
                                                  organizationName: opt.name,
                                              }))
                                          } else {
                                              setEditionForm(prev => ({
                                                  ...prev,
                                                  organizationID: null,
                                                  organizationName: opt.name,
                                              }));
                                          }
                                      }}>
                                <Combobox.Input className="form-control"
                                                displayValue={(opt) => opt?.name ?? ""}
                                                placeholder="Select or type a publisher..."
                                                onChange={e => {
                                                    const value = e.target.value;
                                                    setSearchQuery(prev => ({...prev, publisher: value}));

                                                    setEditionForm(prev => ({
                                                        ...prev,
                                                        organizationID: null,
                                                        organizationName: value,
                                                    }));
                                                }}/>
                                <Combobox.Options className="list-group position-absolute z-3">
                                    {filteredPublishers.map(opt => (
                                        <Combobox.Option
                                            key={opt.id}
                                            value={opt}
                                            className="list-group-item list-group-item-action"
                                        >
                                            {opt.name}
                                        </Combobox.Option>
                                    ))}

                                    {searchQuery.publisher !== "" &&
                                        !filteredPublishers.some(
                                            p => p.name.toLowerCase() === searchQuery.publisher.toLowerCase()
                                        ) && (
                                            <Combobox.Option value={{name: searchQuery.publisher}}
                                                             className="list-group-item list-group-item-action text-primary">
                                                Create “{searchQuery.publisher}”
                                            </Combobox.Option>
                                        )}
                                </Combobox.Options>
                            </Combobox>
                        </Col>
                    )}
                </Col>

                <Col lg={5} className="mt-3">
                    <label className="form-label">Person:</label>
                    <Combobox
                        value={
                            peoples.find(p => p.id === contributorDraft.peopleID)
                            ?? (contributorDraft.peopleName ? {name: contributorDraft.peopleName} : null)
                        }
                        onChange={(opt) => {
                            if (!opt) {
                                setContributorDraft(prev => ({
                                    ...prev,
                                    peopleID: null,
                                    peopleName: "",
                                }));
                            } else if (opt.id) {
                                setContributorDraft(prev => ({
                                    ...prev,
                                    peopleID: opt.id,
                                    peopleName: "",
                                }));
                            } else {
                                setContributorDraft(prev => ({
                                    ...prev,
                                    peopleID: null,
                                    peopleName: opt.name,
                                }));
                            }
                        }}
                    >
                        <Combobox.Input
                            className="form-control"
                            placeholder="Select person…"
                            displayValue={(opt) => opt?.name ?? ""}
                            onChange={e => {
                                const value = e.target.value;
                                setSearchQuery(prev => ({...prev, person: value}))

                                setContributorDraft(prev => ({
                                    ...prev,
                                    peopleID: null,
                                    peopleName: value,
                                }));
                            }}
                        />
                        <Combobox.Options className="list-group position-absolute z-3">
                            {filteredPersons.map(opt => (
                                <Combobox.Option
                                    key={opt.id}
                                    value={opt}
                                    className="list-group-item list-group-item-action"
                                >
                                    {opt.name}
                                </Combobox.Option>
                            ))}

                            {searchQuery.person !== "" &&
                                !filteredPersons.some(
                                    p => p.name.toLowerCase() === searchQuery.person.toLowerCase()
                                ) && (
                                    <Combobox.Option value={{name: searchQuery.person}}
                                                     className="list-group-item list-group-item-action text-primary">
                                        Create “{searchQuery.person}”
                                    </Combobox.Option>
                                )}
                        </Combobox.Options>
                    </Combobox>

                </Col>

                <Col lg={5} className="mt-3">
                    <label className="form-label">Role:</label>
                    <Combobox
                        value={
                            roles.find(r => r.id === contributorDraft.roleID)
                            ?? (contributorDraft.roleName ? {type: contributorDraft.roleName} : null)
                        }
                        onChange={(opt) => {
                            if (!opt) {
                                setContributorDraft(prev => ({
                                    ...prev,
                                    roleID: null,
                                    roleName: "",
                                }));
                            } else if (opt.id) {
                                setContributorDraft(prev => ({
                                    ...prev,
                                    roleID: opt.id,
                                    roleName: "",
                                }));
                            } else {
                                setContributorDraft(prev => ({
                                    ...prev,
                                    roleID: null,
                                    roleName: opt.type,
                                }));
                            }
                        }}
                    >
                        <Combobox.Input
                            className="form-control"
                            placeholder="Select role…"
                            displayValue={(opt) => opt?.type ?? ""}
                            onChange={e => {
                                const value = e.target.value;
                                setSearchQuery(prev => ({...prev, role: value}))

                                setContributorDraft(prev => ({
                                    ...prev,
                                    roleID: null,
                                    roleName: value,
                                }));
                            }}
                        />
                        <Combobox.Options className="list-group position-absolute z-3">
                            {filteredRoles.map(opt => (
                                <Combobox.Option
                                    key={opt.id}
                                    value={opt}
                                    className="list-group-item list-group-item-action"
                                >
                                    {opt.type}
                                </Combobox.Option>
                            ))}

                            {searchQuery.role !== "" &&
                                !filteredRoles.some(
                                    r => r.type.toLowerCase() === searchQuery.role.toLowerCase()
                                ) && (
                                    <Combobox.Option value={{type: searchQuery.role}}
                                                     className="list-group-item list-group-item-action text-primary">
                                        Create “{searchQuery.role}”
                                    </Combobox.Option>
                                )}
                        </Combobox.Options>
                    </Combobox>
                </Col>

                <Col lg={2} className="mt-5">
                    <button
                        className="btn btn-primary"
                        disabled={
                            (!contributorDraft.peopleID && !contributorDraft.peopleName) ||
                            (!contributorDraft.roleID && !contributorDraft.roleName)}
                        onClick={() => {
                            setContributors(prev => [
                                ...prev,
                                {...contributorDraft},
                            ]);

                            setContributorDraft({
                                peopleID: null,
                                roleID: null,
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
                                {peoples.find(p => p.id === c.peopleID)?.name}
                            </Col>

                            <Col lg={5}>
                                {roles.find(r => r.id === c.roleID)?.type}
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

            <button type="button" className="btn btn-success mt-4" onClick={handleSubmit}> Submit</button>
        </>
    );
}