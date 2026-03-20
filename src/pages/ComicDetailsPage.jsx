import {Editions} from "../components/Editions.jsx";
import {useState} from "react";
import {EditEditionModal} from "../components/EditEditionModal.jsx";
import {Button} from "react-bootstrap";
import {deleteEdition} from "../api/editionInfo.js";

export function ComicDetailsPage(props){
    const {comic, organizations, peoples, roles, comicContributors, editions,
        selectedComic, series, onAddEditions, compendium,
        selectedSerie, onSelectCompendium, onSelectPublisher, onSelectPerson} = props;

    if (!comic) return <div>No Comic Selected</div>;

    const [editingEdition, setEditingEdition] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    function handleEditEdition(edition) {
        setEditingEdition(edition);
        setShowEditModal(true);
    }

    const comicEditions = editions
        ?.filter(ed => ed.comicID === comic.id)
        .map(ed => {
            const publisher = organizations?.find(org => org.id === ed.organizationID);
            const collection = compendium?.find(c => c.id === ed.compendiumID);

            const contributors = comicContributors
                ?.filter(cc => cc.editionID === ed.id)
                .map(cc => {
                    const person = peoples?.find(p => p.id === cc.peopleID);
                    const role = roles?.find(r => r.id === cc.roleID);

                    return {
                        peopleName: person?.name || "Unknown",
                        roleName: role?.type || "Unknown",
                        peopleID: cc.peopleID,
                    };
                });

            return {
                ...ed,
                publisherDisplay: ed.selfPublished
                    ? (ed.selfPublisherName
                        ? `Self-published by ${ed.selfPublisherName}`
                        : "Self-published")
                    : publisher?.name || "Unknown",
                displayContributors: contributors || [],
                compendiumTitle: collection?.title ?? null,
            };
        });

    return (
        <>
            <h2 className="text-center">{selectedSerie?.title}: {comic.title}</h2>
            <div className="d-flex justify-content-center my-3">
                <Button onClick={() => onAddEditions(comic)} className="btn btn-warning">
                    Add Editions
                </Button>
            </div>
            <Editions editions={comicEditions}
                      onEditEdition={handleEditEdition}
                      onSelectCompendium={onSelectCompendium}
                      onSelectPublisher={onSelectPublisher}
                      onSelectPerson={onSelectPerson}
                      onDeleteEdition={async (edition) => {
                          await deleteEdition(edition, comicContributors);
                      }}
            />

            {showEditModal && (
                <EditEditionModal edition={editingEdition} editions={editions}
                                  comic={comic}
                                  series={series}
                                  compendium={compendium}
                                  organizations={organizations}
                                  peoples={peoples} roles={roles}
                                  comicContributors={comicContributors}
                                  onClose={() => setShowEditModal(false)
                }/> )}
        </>
    );
}