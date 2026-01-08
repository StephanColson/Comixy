import {firestoreDB} from "./firebase.js";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {collection, query} from "firebase/firestore";

const EDITION_COLLECTION_NAME = 'Editions';

const editionConverter = {
    toFirestore: dataInApp => ({
        format: dataInApp.format,
        imgURL: dataInApp.imgURL,
        printYear: dataInApp.printYear,
        comicID: dataInApp.comicID,
        printType: dataInApp.printType,
        numberInCollection: dataInApp.numberInCollection,
        organizationID: dataInApp.organizationID,
        selfPublished: dataInApp.selfPublished,
    }),
    fromFirestore: (snapshot, option) => {
        const data = snapshot.data(option);
        return {...data, id: snapshot.id, ref: snapshot.ref}
    }
};

export function useEditionCollectionData() {
    const collectionRef = collection(firestoreDB, EDITION_COLLECTION_NAME).withConverter(editionConverter);
    const queryRef = query(collectionRef);
    const [editions, loading, error] = useCollectionData(queryRef);
    return {editions, loading, error}
}