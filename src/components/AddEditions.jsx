import {addComic, useComicCollectionData} from "../api/comicInfo.js";
import {addEdition, uploadFile, useEditionCollectionData} from "../api/editionInfo.js";
import {addOrganization, useOrganizationCollectionData} from "../api/organizationInfo.js";
import {addPerson, usePeopleCollectionData} from "../api/personInfo.js";
import {addRole, useRoleCollectionData} from "../api/roleInfo.js";
import {useState} from "react";
import {addSerie, useSerieCollectionData} from "../api/serieInfo.js";
import {addComicContributor} from "../api/comicContributer.js";
import {ComicSection} from "./ComicSection.jsx";
import {EditionSection} from "./EditionSection.jsx";
import {ContributorSection} from "./ContributorSection.jsx";
import {Button, Modal} from "react-bootstrap";

function filterList({ list, search, selector }) {
    if (!search) return list;
    const lower = search.toLowerCase();
    return list.filter(item => {
        const value = selector(item);
        if (typeof value !== "string") return false;
        return value.toLowerCase().includes(lower);
    });
}


export function AddEditions(props) {
    const {selectedComicID, setSelectedComicID, initialIsNewComic} = props;

    const {comics = [], loading} = useComicCollectionData();
    const {editions = [], loading: editionsLoading} = useEditionCollectionData();
    const {organizations = [], loading: organizationsLoading} = useOrganizationCollectionData();
    const {peoples = [], loading: peoplesLoading} = usePeopleCollectionData();
    const {roles = [], loading: rolesLoading} = useRoleCollectionData();
    const {series = [], loading: serieLoading} = useSerieCollectionData();

    const [showConfirmation, setShowConfirmation] = useState(false);

    const [isNewComic, setIsNewComic] = useState(initialIsNewComic);
    const currentYear = new Date().getFullYear();

    const [errors, setErrors] = useState({});

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
        imageFile: null,
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
    });

    const filteredSerie = filterList({
        list: series,
        search: searchQuery.serie,
        selector: s => s.title,
    });

    const filteredPrintType = filterList({
        list: dataPrintType,
        search: editionForm.printTypeName,
        selector: pt => pt.label,
    });

    const filteredFormat = filterList({
        list: dataFormat,
        search: editionForm.formatName,
        selector: f => f.label,
    });

    const filteredPublishers = filterList({
        list: organizations,
        search: searchQuery.publisher,
        selector: p => p.name,
    });

    const filteredPersons = filterList({
        list: peoples,
        search: searchQuery.person,
        selector: p => p.name,
    });

    const filteredRoles = filterList({
        list: roles,
        search: searchQuery.role,
        selector: r => r.type,
    });

    const selectedComic =
        selectedComicID ? comics?.find(c => c.id === selectedComicID) ?? null : null;

    const [contributors, setContributors] = useState([]);

    const [contributorDraft, setContributorDraft] = useState({
        peopleID: null,
        peopleName: "",
        roleID: null,
        roleName: "",
    });

    function validateRequired() {
        const newErrors = {};
        if (isNewComic && !comicForm.serieTitle.trim()) {
            newErrors.serie = "Serie is required";
        }

        if (!isNewComic && !selectedComicID) {
            newErrors.comic = "Select a comic first";
        }

        if (isNewComic && !comicForm.title.trim()) {
            newErrors.title = "Comic title is required";
        }

        if (isNewComic && !comicForm.bookNumber) {
            newErrors.bookNumber = "Book number is required";
        }

        return newErrors;
    }

    async function handleSubmit() {

        const validation = validateRequired();

        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }
        setErrors({});

        try {
            const normalize = str => (str || "").trim().toLowerCase();

            const typedSerie = normalize(comicForm.serieTitle);
            const existingSerie = series.find(
                s => normalize(s.title) === typedSerie
            );

            const serieID = existingSerie
                ? existingSerie.id
                : (typedSerie
                    ? await addSerie({
                        title: comicForm.serieTitle.trim(),
                        description: "",
                        franchiseID: null,
                    })
                    : null);

            const comicID = isNewComic
                ? await addComic({
                    title: comicForm.title.trim(),
                    bookNumber: Number(comicForm.bookNumber),
                    genres: comicForm.genres,
                    serieID: serieID,
                    price: null,
                })
                : selectedComicID;

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

            const typedFormat = normalize(editionForm.formatName);
            const existingFormat = editions
                .map(e => e.format)
                .filter(Boolean)
                .find(f => normalize(f) === typedFormat);

            const finalFormat = existingFormat || editionForm.format || editionForm.formatName || null;

            const typedPrintType = normalize(editionForm.printTypeName);
            const existingPrintType = editions
                .map(e => e.printType)
                .filter(Boolean)
                .find(pt => normalize(pt) === typedPrintType);

            const finalPrintType = existingPrintType || editionForm.printType || editionForm.printTypeName || null;

            const contributorList = await Promise.all(
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

                    return { peopleID, roleID };
                })
            );

            const imgURL = editionForm.imageFile
                ? await uploadFile(editionForm.imageFile)
                : null;

            const editionID = await addEdition({
                comicID,
                format: finalFormat,
                imgURL: imgURL,
                printYear: editionForm.printYear || null,
                printType: finalPrintType,
                numberInCollection: editionForm.numberInCollection || null,
                organizationID: publisherID,
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
            setEditionForm(prev => ({ ...prev, imageFile: null }));
            setShowConfirmation(true);

        } catch (err) {
            console.error("Submit error:", err);
        }
    }

    return (
        <>
            <ComicSection
                isNewComic={isNewComic}
                setIsNewComic={setIsNewComic}
                comicForm={comicForm}
                setComicForm={setComicForm}
                selectedComic={selectedComic}
                setSelectedComicID={setSelectedComicID}
                filteredComics={filteredComics}
                filteredSerie={filteredSerie}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentYear={currentYear}
                series={series}
                errors={errors}
            />

            <EditionSection
                editionForm={editionForm}
                setEditionForm={setEditionForm}
                filteredFormat={filteredFormat}
                filteredPrintType={filteredPrintType}
                filteredPublishers={filteredPublishers}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentYear={currentYear}
                organizations={organizations}
                peoples={peoples}
            />

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

            <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered dialogClassName="modal-bg">
                <Modal.Header closeButton>
                    <Modal.Title>Submit Confirmation</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    New comic / edition has been added
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-info" onClick={() => setShowConfirmation(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>


            <div className="d-flex justify-content-center m-3">
                <button type="button" className="btn btn-warning rounded" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </>
    );
}