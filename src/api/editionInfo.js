import {firestoreDB} from "./firebase.js";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {addDoc, collection, deleteDoc, doc, query, updateDoc} from "firebase/firestore";
import {uploadImage} from "./storage.js";
import {deleteComicContributor} from "./comicContributer.js";

const EDITION_COLLECTION_NAME = 'Editions';


export async function uploadFile(file) {
    if(!file) throw new Error("No files selected");
    const {url} = await uploadImage(file);
    return url;
}

export async function uploadFiles(files){
    const validFiles = files.filter(Boolean);
    if(!validFiles.length) return [];
    return Promise.all(validFiles.map(file => uploadFile(file)));
}

const editionConverter = {
    toFirestore: dataInApp => ({
        format: dataInApp.format,
        imgURLs: dataInApp.imgURLs ?? [],
        printYear: dataInApp.printYear,
        comicID: dataInApp.comicID,
        printType: dataInApp.printType,
        numberInCollection: dataInApp.numberInCollection,
        organizationID: dataInApp.organizationID,
        price: dataInApp.price ?? null,
        compendiumID: dataInApp.compendiumID ?? null,
    }),
    fromFirestore: (snapshot, option) => {
        const data = snapshot.data(option);
        const imgURLs = data.imgURLs?.length
            ? data.imgURLs
            : (data.imgURL ? [data.imgURL] : []);
        return {...data, imgURLs, compendiumID: data.compendiumID ?? null, id: snapshot.id, ref: snapshot.ref}
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

export async function deleteEdition(edition, comicContributors){
    const editionContributors = comicContributors.filter(cc => cc.editionID === edition.id);
    await Promise.all(editionContributors.map(cc => deleteComicContributor(cc.id)));
    await deleteDoc(doc(firestoreDB, "Editions", edition.id));
}