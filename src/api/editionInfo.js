import {firestoreDB} from "./firebase.js";
import {supabase} from "./supabase.js";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {addDoc, collection, query, updateDoc} from "firebase/firestore";

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
        selfPublisherID: dataInApp.selfPublisherID || null,
        selfPublisherName: dataInApp.selfPublisherName || "",
        price: dataInApp.price ?? null,
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

export async function addEdition(newEdition) {
    const collectionRef = collection(firestoreDB, EDITION_COLLECTION_NAME).withConverter(editionConverter);
    const docRef = await addDoc(collectionRef, newEdition);
    return docRef.id;
}

export async function updateEdition(edition) {
    await updateDoc(edition.ref, edition);
}