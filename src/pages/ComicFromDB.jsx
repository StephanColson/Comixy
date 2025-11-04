import {useComicCollectionData} from "../api/comicInfo.js";

export function ComicFromDB(){
    const {comics} = useComicCollectionData()
    console.log(comics)
    return(
        <>
            <div>Comic from Database</div>
        </>
    )
}