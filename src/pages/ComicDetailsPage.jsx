import {useEditionCollectionData} from "../api/editionInfo.js";
import {Editions} from "../components/Editions.jsx";

export function ComicDetailsPage(props){
    const {comic, organizations} = props;
    const {editions} = useEditionCollectionData();

    if (!comic) {
        return <div>No Comic Selected</div>;
    }

    const comicEditions = editions
        ?.filter(ed => ed.comicID === comic.id)
        .map(ed => {
            const publisher = organizations?.find(
                org => org.id === ed.organizationID
            );

            return {
                ...ed,
                organizationName: ed.selfPublished
                    ? "Self-published"
                    : publisher?.name || "Unknown"
            };
        });

    return (
        <>
            <h2 className="text-center">Detailed Info: {comic.title}</h2>
            <Editions editions={comicEditions} />
        </>
    );
}
