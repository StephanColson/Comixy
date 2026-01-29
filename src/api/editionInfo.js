import {firestoreDB} from "./firebase.js";
import {supabase} from "./supabase.js";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {addDoc, collection, query} from "firebase/firestore";

const EDITION_COLLECTION_NAME = 'Editions';


export async function uploadFile(file) {
    if(!file) throw new Error("No files selected");

    const filePath = `covers/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('comic-covers').upload(filePath, file)
    if (error) {
        console.log("Upload error:", error);
        throw error;
    }

    const { data: publicData } = supabase
        .storage
        .from("comic-covers")
        .getPublicUrl(filePath);
    return publicData.publicUrl;
}

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

export async function addEdition(newEdition) {
    const collectionRef = collection(firestoreDB, "Editions");
    const docRef = await addDoc(collectionRef, newEdition);
    return docRef.id;
}

export function useEditionCollectionData() {
    const collectionRef = collection(firestoreDB, EDITION_COLLECTION_NAME).withConverter(editionConverter);
    const queryRef = query(collectionRef);
    const [editions, loading, error] = useCollectionData(queryRef);
    return {editions, loading, error}
}