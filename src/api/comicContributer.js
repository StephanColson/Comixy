import {firestoreDB} from "./firebase.js";
import {addDoc, collection, query} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";

const COMIC_CONTRIBUTOR_COLLECTION = "ComicContributors";

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

export async function addComicContributor(newContributor) {
    const collectionRef = collection(firestoreDB, "ComicContributors");
    const docRef = await addDoc(collectionRef, newContributor);
    return docRef.id;
}

export function useComicContributorCollectionData() {
    const collectionRef = collection(firestoreDB, COMIC_CONTRIBUTOR_COLLECTION).withConverter(comicContributorConverter);
    const queryRef = query(collectionRef);
    const [comicContributors, loading, error] = useCollectionData(queryRef);
    return {comicContributors, loading, error};
}