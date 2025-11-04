import {useComicCollectionData} from "../api/comicInfo.js";
import {Comics} from "../components/Comics.jsx";

export function ComicFromDB(){
    const {comics} = useComicCollectionData()
    console.log(comics)
    return(
        <>
            <Comics comics={comics}/>
        </>
    )
}