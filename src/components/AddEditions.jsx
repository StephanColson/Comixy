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

function filterList (props){
    const {list, search, selector} = props;
    if(!search) return list;
    const lower = search.toLowerCase();
    return list.filter(item => selector(item).toLowerCase().includes(lower));
}

export function AddEditions(props) {
    const {selectedComicID, setSelectedComicID} = props;

    const {comics = [], loading} = useComicCollectionData();
    const {editions = [], loading: editionsLoading} = useEditionCollectionData();
    const {organizations = [], loading: organizationsLoading} = useOrganizationCollectionData();
    const {peoples = [], loading: peoplesLoading} = usePeopleCollectionData();
    const {roles = [], loading: rolesLoading} = useRoleCollectionData();
    const {series = [], loading: serieLoading} = useSerieCollectionData();

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
        selectedComicID ? comics?.find(c => c.id === selectedComicID) ?? null : null;

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
                        bookNumber: Number(comicForm.bookNumber),
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

            const imgURL =
                editionForm.imageFile
                    ? await uploadFile(editionForm.imageFile)
                    : null;


            const editionID = await addEdition({
                comicID,
                format: editionForm.format ?? editionForm.formatName,
                imgURL: imgURL,
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
            setEditionForm(prev => ({...prev, imageFile: null}));
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

            <button type="button" className="btn btn-success mt-4" onClick={handleSubmit}>
                Submit
            </button>
        </>
    );
}