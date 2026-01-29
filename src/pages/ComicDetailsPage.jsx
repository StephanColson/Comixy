import {Editions} from "../components/Editions.jsx";
import {useEditionCollectionData} from "../api/editionInfo.js";

export function ComicDetailsPage(props){
    const {comic, organizations, peoples, roles, comicContributors} = props;

    const {editions} = useEditionCollectionData();

    if (!comic) return <div>No Comic Selected</div>;

    const comicEditions = editions
        ?.filter(ed => ed.comicID === comic.id)
        .map(ed => {
            const publisher = organizations?.find(org => org.id === ed.organizationID);

            const contributors = comicContributors
                ?.filter(cc => cc.editionID === ed.id)
                .map(cc => {
                    const person = peoples?.find(p => p.id === cc.peopleID);
                    const role = roles?.find(r => r.id === cc.roleID);

                    return {
                        peopleName: person?.name || "Unknown",
                        roleName: role?.type || "Unknown"
                    };
                });

            return {
                ...ed,
                organizationName: ed.selfPublished
                    ? "Self-published"
                    : publisher?.name || "Unknown",
                contributors: contributors || []
            };
        });

    return (
        <>
            <h2 className="text-center">Detailed Info: {comic.title}</h2>
            <Editions editions={comicEditions} />
        </>
    );
}
