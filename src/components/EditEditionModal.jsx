import {Modal, Button, Form} from "react-bootstrap";
import {useState} from "react";
import {updateEdition, uploadFile} from "../api/editionInfo.js";
import {ContributorSection} from "./ContributorSection.jsx";
import {addComicContributor, deleteComicContributor} from "../api/comicContributer.js";
import {addPerson} from "../api/personInfo.js";
import {addRole} from "../api/roleInfo.js";
import {useEditionFiltering} from "./EditionFiltering.jsx";
import {EditionSection} from "./EditionSection.jsx";

export function EditEditionModal(props) {
    const {edition, onClose, organizations, peoples, roles, comicContributors, editions} = props;

    const [editionForm, setEditionForm] = useState({
        comicID: edition.comicID,
        printYear: edition.printYear || "",
        format: edition.format || null,
        formatName: "",
        printType: edition.printType || null,
        printTypeName: "",
        organizationID: edition.organizationID || null,
        organizationName: "",
        selfPublished: edition.selfPublished || false,
        selfPublisherID: edition.selfPublisherID || null,
        selfPublisherName: "",
        imageFile: null,
    });

    const [contributors, setContributors] = useState(
        comicContributors
            .filter(cc => cc.editionID === edition.id)
            .map(cc => ({
                peopleID: cc.peopleID,
                peopleName: peoples.find(p => p.id === cc.peopleID)?.name || "",
                roleID: cc.roleID,
                roleName: roles.find(r => r.id === cc.roleID)?.type || "",
            }))
    );

    const [contributorDraft, setContributorDraft] = useState({
        peopleID: null,
        peopleName: "",
        roleID: null,
        roleName: "",
    });

    const [searchContributor, setSearchContributor] = useState({
        person: "",
        role: "",
    });

    const filteredPersons = peoples.filter(p =>
        p.name.toLowerCase().includes(searchContributor.person.toLowerCase())
    );

    const filteredRoles = roles.filter(r =>
        r.type.toLowerCase().includes(searchContributor.role.toLowerCase())
    );


    const [uploading, setUploading] = useState(false);

    async function handleSave() {
        try {
            const normalize = str => (str || "").trim().toLowerCase();

            const typedFormat = normalize(editionForm.formatName);
            const existingFormat = editions
                .map(e => e.format)
                .filter(Boolean)
                .find(f => normalize(f) === typedFormat);

            const finalFormat =
                existingFormat ||
                editionForm.format ||
                (typedFormat ? editionForm.formatName.trim() : null);

            const typedPrintType = normalize(editionForm.printTypeName);
            const existingPrintType = editions
                .map(e => e.printType)
                .filter(Boolean)
                .find(pt => normalize(pt) === typedPrintType);

            const finalPrintType =
                existingPrintType ||
                editionForm.printType ||
                (typedPrintType ? editionForm.printTypeName.trim() : null);

            const typedPublisher = normalize(editionForm.organizationName);
            const existingPublisher = organizations.find(
                o => normalize(o.name) === typedPublisher
            );

            const publisherID = editionForm.selfPublished
                ? null
                : (
                    editionForm.organizationID ||
                    (existingPublisher
                        ? existingPublisher.id
                        : (typedPublisher
                            ? await addOrganization({ name: editionForm.organizationName.trim() })
                            : null))
                );

            const typedSelfPub = normalize(editionForm.selfPublisherName);
            const existingSelfPub = peoples.find(
                p => normalize(p.name) === typedSelfPub
            );

            const selfPublisherID = editionForm.selfPublished
                ? (
                    editionForm.selfPublisherID ||
                    (existingSelfPub
                        ? existingSelfPub.id
                        : (typedSelfPub
                            ? await addPerson({ name: editionForm.selfPublisherName.trim() })
                            : null))
                )
                : null;

            const imgURL = editionForm.imageFile
                ? await uploadFile(editionForm.imageFile)
                : edition.imgURL;

            await updateEdition({
                ...edition,
                printYear: editionForm.printYear || null,
                format: finalFormat,
                printType: finalPrintType,
                organizationID: publisherID,
                organizationName: editionForm.selfPublished ? "" : editionForm.organizationName.trim(),
                selfPublished: editionForm.selfPublished,
                selfPublisherID: selfPublisherID,
                selfPublisherName: editionForm.selfPublished ? editionForm.selfPublisherName.trim() : "",
                imgURL,
            });

            const old = comicContributors.filter(cc => cc.editionID === edition.id);
            await Promise.all(old.map(cc => deleteComicContributor(cc.id)));

            await Promise.all(
                contributors.map(async c => {
                    const typedPerson = normalize(c.peopleName);
                    const existingPerson = peoples.find(
                        p => normalize(p.name) === typedPerson
                    );

                    const peopleID =
                        c.peopleID ||
                        (existingPerson
                            ? existingPerson.id
                            : (typedPerson
                                ? await addPerson({ name: c.peopleName.trim() })
                                : null));

                    const typedRole = normalize(c.roleName);
                    const existingRole = roles.find(
                        r => normalize(r.type) === typedRole
                    );

                    const roleID =
                        c.roleID ||
                        (existingRole
                            ? existingRole.id
                            : (typedRole
                                ? await addRole({ type: c.roleName.trim() })
                                : null));

                    return addComicContributor({
                        comicID: edition.comicID,
                        editionID: edition.id,
                        peopleID,
                        roleID,
                    });
                })
            );

            onClose();

        } catch (err) {
            console.error("Edit save error:", err);
        }
    }

    const {
        searchQuery,
        setSearchQuery,
        filteredFormat,
        filteredPrintType,
        filteredPublishers,
        filteredPersonsSelfPub
    } = useEditionFiltering({
        editions,
        organizations,
        peoples,
        roles
    });

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Edition</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <EditionSection
                        editionForm={editionForm}
                        setEditionForm={setEditionForm}
                        filteredFormat={filteredFormat}
                        filteredPrintType={filteredPrintType}
                        filteredPublishers={filteredPublishers}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        currentYear={new Date().getFullYear()}
                        organizations={organizations}
                        peoples={peoples}
                        filteredPersonsSelfPub={filteredPersonsSelfPub}/>
                    <ContributorSection
                        contributorDraft={contributorDraft}
                        setContributorDraft={setContributorDraft}
                        contributors={contributors}
                        setContributors={setContributors}
                        filteredPersons={filteredPersons}
                        filteredRoles={filteredRoles}
                        peoples={peoples}
                        roles={roles}
                        searchQuery={searchContributor}
                        setSearchQuery={setSearchContributor}
                    />
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