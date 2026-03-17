import {firestoreDB} from "./firebase.js";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {addDoc, collection, query} from "firebase/firestore";

const COMPENDIUM_COLLECTION_NAME = "Compendium";

const compendiumConverter = {
    toFirestore: dataInApp => ({
        title: dataInApp.title,
        description: dataInApp.description,
    }),
    fromFirestore: (snapshot, option) => {
        const data = snapshot.data(option);
        return {...data, id: snapshot.id, ref: snapshot.ref}
    }
};

export async function addCompendium(newCompendium){
    const collectionRef = collection(firestoreDB, "Compendium");
    const docRef = await addDoc(collectionRef, newCompendium);
    return docRef.id;
}

import {updateDoc} from "firebase/firestore";

export async function updateCompendium(compendium) {
    await updateDoc(compendium.ref, { description: compendium.description });
}

export function useCompendiumCollectionData(){
    const collectionRef = collection(firestoreDB, COMPENDIUM_COLLECTION_NAME).withConverter(compendiumConverter);
    const queryRef = query(collectionRef);
    const [compendium, loading, error] = useCollectionData(queryRef);
    return {compendium, loading, error};
}