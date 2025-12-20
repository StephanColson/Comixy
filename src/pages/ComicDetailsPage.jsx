import {Editions} from "../components/Editions.jsx";
import {useEditionCollectionData} from "../api/editionInfo.js";

export function ComicDetailsPage(props){
    const {comic} = props;
    const {editions, loading, error} = useEditionCollectionData();

    if(!comic){
        return <div>No Comic Selected</div>;
    }

    const comicEditions = editions?.filter(ed => ed.comicID === comic.id) ?? [];

    return<>
        <h2 className="text-center">Detailed Info: {comic.title}</h2>

        <div>
            <Editions editions={comicEditions} comic={comic}/>
        </div>
    </>
}