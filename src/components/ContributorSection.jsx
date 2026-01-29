import {Combobox} from "@headlessui/react";
import {Row, Col} from "react-bootstrap";

export function ContributorSection(props) {
    const {contributorDraft, setContributorDraft, contributors, setContributors, filteredPersons,
        filteredRoles, peoples, roles, searchQuery, setSearchQuery} = props;

    return (
        <>
            <Row className="m-4">
                <Col lg={5} className="mt-3">
                    <label className="form-label">Person:</label>

                    <Combobox
                        value={
                            peoples.find(p => p.id === contributorDraft.peopleID)
                            ?? (contributorDraft.peopleName ? {name: contributorDraft.peopleName} : null)
                        }
                        onChange={opt => {
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
                            displayValue={opt => opt?.name ?? ""}
                            onChange={e => {
                                const value = e.target.value;
                                setSearchQuery(prev => ({...prev, person: value}));

                                setContributorDraft(prev => ({
                                    ...prev,
                                    peopleID: null,
                                    peopleName: value,
                                }));
                            }}
                        />

                        <Combobox.Options className="list-group position-absolute z-3">
                            {filteredPersons.slice(0, 5).map(opt => (
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
                                    <Combobox.Option
                                        value={{name: searchQuery.person}}
                                        className="list-group-item list-group-item-action text-primary"
                                    >
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
                        onChange={opt => {
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
                            displayValue={opt => opt?.type ?? ""}
                            onChange={e => {
                                const value = e.target.value;
                                setSearchQuery(prev => ({...prev, role: value}));

                                setContributorDraft(prev => ({
                                    ...prev,
                                    roleID: null,
                                    roleName: value,
                                }));
                            }}
                        />

                        <Combobox.Options className="list-group position-absolute z-3">
                            {filteredRoles.slice(0, 5).map(opt => (
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
                                    <Combobox.Option
                                        value={{type: searchQuery.role}}
                                        className="list-group-item list-group-item-action text-primary"
                                    >
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
                            (!contributorDraft.roleID && !contributorDraft.roleName)
                        }
                        onClick={() => {
                            setContributors(prev => [
                                ...prev,
                                {...contributorDraft},
                            ]);

                            setContributorDraft({
                                peopleID: null,
                                peopleName: "",
                                roleID: null,
                                roleName: "",
                            });
                        }}
                    >
                        Add
                    </button>
                </Col>
            </Row>

            <Row className="m-4">
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
                                {peoples.find(p => p.id === c.peopleID)?.name || c.peopleName}
                            </Col>

                            <Col lg={5}>
                                {roles.find(r => r.id === c.roleID)?.type || c.roleName}
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
            </Row>
        </>
    );
}
