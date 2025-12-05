import {query} from "firebase/firestore";
import {firestoreDB} from "./firebase.js";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {collection} from "firebase/firestore";

const SERIE_COLLECTION_NAME = "Series";

const serieConverter = {
    toFirestore: dataInApp => ({
        title: dataInApp.title,
        description: dataInApp.description,
        franchiseID: dataInApp.franchiseID,
    }),
    fromFirestore: (snapshot, option) => {
        const data = snapshot.data(option);
        return {...data, id: snapshot.id, ref: snapshot.ref}
    }
};

export function useSerieCollectionData(){
    const collectionRef = collection(firestoreDB, SERIE_COLLECTION_NAME).withConverter(serieConverter);
    const queryRef = query(collectionRef);
    const [series, loading, error] = useCollectionData(queryRef);
    return {series, loading, error}
}