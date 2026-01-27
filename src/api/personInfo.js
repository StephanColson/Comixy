import {firestoreDB} from "./firebase.js";
import {addDoc, collection, query} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";

const PEOPLE_COLLECTION = "Peoples"

const peopleConverter = {
    toFirestore: dataInApp => ({
        name: dataInApp.name,
    }),
    fromFirestore: (snapshot, option) => {
        const data = snapshot.data(option);
        return {...data, id: snapshot.id, ref: snapshot.ref}
    }
};

export async function addPerson(newPerson) {
    const collectionRef = collection(firestoreDB, "Peoples");
    const docRef = await addDoc(collectionRef, newPerson);
    return docRef.id;
}

export function usePeopleCollectionData() {
    const collectionRef = collection(firestoreDB, PEOPLE_COLLECTION).withConverter(peopleConverter);
    const queryRef = query(collectionRef);
    const [peoples, loading, error] = useCollectionData(queryRef);
    return {peoples, loading, error};
}