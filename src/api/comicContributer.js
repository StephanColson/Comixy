import {firestoreDB} from "./firebase.js";
import {collection, query} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";

const COMIC_CONTRIBUTOR_COLLECTION = "comicContributors";

const comicContributorConverter = {
    toFirestore: dataInApp => ({
       comicID: dataInApp.comicID,
       editionID: dataInApp.editionID,
       peopleID: dataInApp.peopleID,
       roleID: dataInApp.roleID,
    }),
    fromFirestore: (snapshot, option) => {
        const data = snapshot.data(option);
        return {...data, id: snapshot.id, ref: snapshot.ref}
    }
};

export function useComicContributorCollectionData() {
    const collectionRef = collection(firestoreDB, COMIC_CONTRIBUTOR_COLLECTION).withConverter(comicContributorConverter);
    const queryRef = query(collectionRef);
    const [comicContributors, loading, error] = useCollectionData(queryRef);
    return {comicContributors, loading, error};
}