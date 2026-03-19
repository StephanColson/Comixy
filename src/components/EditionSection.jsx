import {Combobox} from "@headlessui/react";
import {Row, Col} from "react-bootstrap";

export function EditionSection(props) {
    const {editionForm, setEditionForm, filteredFormat, filteredPrintType, filteredPublishers, searchQuery,
        setSearchQuery, currentYear, organizations, compendium} = props;

    return (
        <div className="d-flex justify-content-center">
            <Row className="m-2">
                <Row className="justify-content-center mb-5">
                    {[0, 1, 2].map(i => (
                        <Col lg={2} key={i} className="text-center">
                            <label className="form-label">
                                {i === 0 ? "Main Cover" : `Image ${i + 1}`}
                                {i > 0 && <span className="text-warning"> (optional)</span>}
                            </label>

                            {(editionForm.imageFiles[i] || editionForm.existingImgURLs?.[i])  && (
                                <img
                                    src={
                                        editionForm.imageFiles[i]
                                        ? URL.createObjectURL(editionForm.imageFiles[i]) : editionForm.existingImgURLs[i]
                                    }
                                    alt={`preview ${i + 1}`}
                                    className="img-fluid mb-2 rounded"
                                    style={{ maxHeight: "150px", objectFit: "contain" }}
                                />
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={e => {
                                    const file = e.target.files[0] || null;
                                    const updated = [...editionForm.imageFiles];
                                    updated[i] = file;
                                    setEditionForm(prev => ({ ...prev, imageFiles: updated }));
                                }}
                            />
                        </Col>
                    ))}
                </Row>

                <Col lg={12}>
                    <label className="form-label">
                        Collection: <span className="text-warning">(optional)</span>
                    </label>
                    <Combobox
                        value={
                            compendium.find(cpd => cpd.id === editionForm.compendiumID)
                            ?? (editionForm.compendiumName ? {title: editionForm.compendiumName} : null)
                        }
                        onChange={opt => {
                            setEditionForm(prev => ({
                                ...prev,
                                compendiumID: opt?.id ?? null,
                                compendiumName: opt?.id ? "" : opt?.title ?? "",
                            }));
                        }}
                    >
                        <Combobox.Input
                            className="form-control"
                            displayValue={opt => opt?.title ?? ""}
                            placeholder="Select or type a collection..."
                            onChange={e => {
                                setSearchQuery(prev => ({...prev, compendium: e.target.value}));
                                setEditionForm(prev => ({...prev, compendiumName: e.target.value, compendiumID: null}));
                            }}
                        />
                        <Combobox.Options className="list-group position-absolute z-3">
                            {compendium
                                ?.filter(c => c.title.toLowerCase().includes((searchQuery.compendium || "").toLowerCase()))
                                .slice(0, 5)
                                .map(c => (
                                    <Combobox.Option
                                        key={c.id}
                                        value={c}
                                        className="list-group-item list-group-item-action"
                                    >
                                        {c.title}
                                    </Combobox.Option>
                                ))}

                            {searchQuery.compendium &&
                                !compendium?.some(c => c.title?.toLowerCase() === searchQuery.compendium.toLowerCase()) && (
                                    <Combobox.Option
                                        value={{title: searchQuery.compendium}}
                                        className="list-group-item list-group-item-action text-primary"
                                    >
                                        Create "{searchQuery.compendium}"
                                    </Combobox.Option>
                                )}
                        </Combobox.Options>
                    </Combobox>
                </Col>

                <Col lg={3}>
                    <label className="form-label">Format:</label>

                    <Combobox
                        value={
                            filteredFormat.find(f => f.id === editionForm.format)
                            ?? (editionForm.formatName ? {id: null, label: editionForm.formatName} : null)
                        }
                        onChange={opt => {
                            setEditionForm(prev => ({
                                ...prev,
                                format: opt ? opt.id : null,
                                formatName: opt?.id ? "" : prev.formatName,
                            }));
                        }}
                    >
                        <Combobox.Input
                            className="form-control"
                            displayValue={opt => opt?.label ?? editionForm.formatName}
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
                            {filteredFormat.slice(0, 5).map(opt => (
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

                <Col lg={3}>
                    <label className="form-label">Print:</label>
                    <Combobox
                        value={
                            filteredPrintType.find(p => p.id === editionForm.printType)
                            ?? (editionForm.printTypeName ? {id: null, label: editionForm.printTypeName} : null)
                        }
                        onChange={opt => {
                            setEditionForm(prev => ({
                                ...prev,
                                printType: opt ? opt.id : null,
                                printTypeName: opt?.id ? "" : prev.printTypeName,
                            }));
                        }}
                    >
                        <Combobox.Input
                            className="form-control"
                            displayValue={opt => opt?.label ?? editionForm.printTypeName}
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
                            {filteredPrintType.slice(0, 5).map(opt => (
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

                <Col lg={3}>
                    <Col>
                        <label className="form-label">Publisher:</label>

                        <Combobox
                            value={
                                organizations.find(p => p.id === editionForm.organizationID)
                                ?? (editionForm.organizationName ? {name: editionForm.organizationName} : null)
                            }
                            onChange={opt => {
                                if (!opt) {
                                    setEditionForm(prev => ({
                                        ...prev,
                                        organizationID: null,
                                        organizationName: "",
                                    }));
                                } else if (opt.id) {
                                    setEditionForm(prev => ({
                                        ...prev,
                                        organizationID: opt.id,
                                        organizationName: "",
                                    }));
                                } else {
                                    setEditionForm(prev => ({
                                        ...prev,
                                        organizationID: null,
                                        organizationName: opt.name,
                                    }));
                                }
                            }}
                        >
                            <Combobox.Input
                                className="form-control"
                                displayValue={opt => opt?.name ?? ""}
                                placeholder="Select or type a publisher..."
                                onChange={e => {
                                    const value = e.target.value;
                                    setSearchQuery(prev => ({...prev, publisher: value}));

                                    setEditionForm(prev => ({
                                        ...prev,
                                        organizationID: null,
                                        organizationName: value,
                                    }));
                                }}
                            />

                            <Combobox.Options className="list-group position-absolute z-3">
                                {filteredPublishers.slice(0, 5).map(opt => (
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
                                        p => p.name?.toLowerCase() === searchQuery.publisher.toLowerCase()
                                    ) && (
                                        <Combobox.Option
                                            value={{name: searchQuery.publisher}}
                                            className="list-group-item list-group-item-action text-primary"
                                        >
                                            Create “{searchQuery.publisher}”
                                        </Combobox.Option>
                                    )}
                            </Combobox.Options>
                        </Combobox>
                    </Col>
                </Col>

                <Col lg={2}>
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
        </div>
    );
}