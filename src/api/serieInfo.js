import {firestoreDB} from "./firebase.js";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {addDoc, collection, query, updateDoc} from "firebase/firestore";

const SERIE_COLLECTION_NAME = "Series";

const serieConverter = {
    toFirestore: dataInApp => ({
        title: dataInApp.title,
        description: dataInApp.description,
        universeID: dataInApp.universeID,
    }),
    fromFirestore: (snapshot, option) => {
        const data = snapshot.data(option);
        return {...data, id: snapshot.id, ref: snapshot.ref}
    }
};

export async function addSerie(newSerie){
    const collectionRef = collection(firestoreDB, SERIE_COLLECTION_NAME).withConverter(serieConverter);
    const docRef = await addDoc(collectionRef, newSerie);
    return docRef.id;
}

export async function updateSerie(serie) {
    await updateDoc(serie.ref, { description: serie.description });
}

export function useSerieCollectionData(){
    const collectionRef = collection(firestoreDB, SERIE_COLLECTION_NAME).withConverter(serieConverter);
    const queryRef = query(collectionRef);
    const [series, loading, error] = useCollectionData(queryRef);
    return {series, loading, error};
}