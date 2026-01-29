import {Modal, Button, Form} from "react-bootstrap";
import {useState} from "react";
import {updateEdition, uploadFile} from "../api/editionInfo.js";
import {ContributorSection} from "./ContributorSection.jsx";
import {addComicContributor, deleteComicContributor} from "../api/comicContributer.js";
import {addPerson} from "../api/personInfo.js";
import {addRole} from "../api/roleInfo.js";

export function EditEditionModal(props) {
    const {edition, onClose, organizations, peoples, roles, comicContributors} = props;
    const [formData, setFormData] = useState({
        ...edition,
        organizationName: edition.organizationName || "",
        selfPublisherName: edition.selfPublisherName || "",
    });

    const [contributors, setContributors] = useState(edition.displayContributors || []);
    const [contributorDraft, setContributorDraft] = useState({
        peopleID: null,
        peopleName: "",
        roleID: null,
        roleName: "",
    });

    const [searchQuery, setSearchQuery] = useState({
        person: "",
        role: "",
    });

    const filteredPersons = peoples.filter(p =>
        p.name.toLowerCase().includes(searchQuery.person.toLowerCase())
    );

    const filteredRoles = roles.filter(r =>
        r.type.toLowerCase().includes(searchQuery.role.toLowerCase())
    );


    const [uploading, setUploading] = useState(false);

    function handleChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    async function handleSave() {
        await updateEdition(formData);

        const old = comicContributors.filter(cc => cc.editionID === formData.id);
        await Promise.all(old.map(cc => deleteComicContributor(cc)));

        await Promise.all(
            contributors.map(async c => {
                const peopleID =
                    c.peopleID ||
                    (c.peopleName ? await addPerson({name: c.peopleName}) : null);

                const roleID =
                    c.roleID ||
                    (c.roleName ? await addRole({type: c.roleName}) : null);

                return addComicContributor({
                    comicID: formData.comicID,
                    editionID: formData.id,
                    peopleID,
                    roleID,
                });
            })
        );
        onClose();
    }

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Edition</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Cover Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                setUploading(true);
                                try {
                                    const url = await uploadFile(file);
                                    setFormData({ ...formData, imgURL: url });
                                } finally {
                                    setUploading(false);
                                }
                            }}
                        />
                    </Form.Group>

                    {formData.imgURL && (
                        <img
                            src={formData.imgURL}
                            alt="Preview"
                            className="img-fluid rounded mb-3"
                        />
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Format</Form.Label>
                        <Form.Control
                            name="format"
                            value={formData.format || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Print Type</Form.Label>
                        <Form.Control
                            name="printType"
                            value={formData.printType || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Number in Collection</Form.Label>
                        <Form.Control
                            name="numberInCollection"
                            value={formData.numberInCollection || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Price (€)</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={formData.price || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Check
                        className="mb-3"
                        type="checkbox"
                        label="Self-published"
                        checked={formData.selfPublished || false}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                selfPublished: e.target.checked,
                                organizationID: e.target.checked ? null : formData.organizationID,
                                organizationName: e.target.checked ? "" : formData.organizationName,
                            })
                        }
                    />

                    {!formData.selfPublished && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Publisher</Form.Label>
                                <Form.Control
                                    list="publisher-options"
                                    name="organizationName"
                                    value={formData.organizationName || ""}
                                    onChange={handleChange}
                                    placeholder="Select or type a publisher"
                                />
                                <datalist id="publisher-options">
                                    {organizations?.map(org => (
                                        <option key={org.id} value={org.name} />
                                    ))}
                                </datalist>
                            </Form.Group>

                            <ContributorSection
                                contributorDraft={contributorDraft}
                                setContributorDraft={setContributorDraft}
                                contributors={contributors}
                                setContributors={setContributors}
                                filteredPersons={filteredPersons}
                                filteredRoles={filteredRoles}
                                peoples={peoples}
                                roles={roles}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />
                        </>
                    )}


                    {formData.selfPublished && (
                        <Form.Group className="mb-3">
                            <Form.Label>Published by (Person)</Form.Label>
                            <Form.Control
                                name="selfPublisherName"
                                value={formData.selfPublisherName || ""}
                                onChange={handleChange}
                                placeholder="Enter the person's name"
                            />
                        </Form.Group>
                    )}

                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={uploading}>
                    {uploading ? "Uploading..." : "Save Changes"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}