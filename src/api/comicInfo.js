import {deleteDoc, updateDoc, addDoc, collection, query, orderBy, limit, serverTimestamp} from "firebase/firestore";
import {firestoreDB} from "./firebase.js";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {supabase} from "./supabase.js";

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

const COMIC_COLLECTION_NAME = 'Comics';

const comicConverter = {
    toFirestore: dataInApp => ({
        title: dataInApp.title,
        bookNumber: dataInApp.bookNumber,
        price: dataInApp.price,
        genres: dataInApp.genres,
        serieID: dataInApp.serieID,
        createdAt: dataInApp.createdAt,
    }),
    fromFirestore: (snapshot, option) => {
        const data = snapshot.data(option);
        return {...data, id: snapshot.id, ref: snapshot.ref}
    }
};

export function useComicCollectionData(){
    const collectionRef = collection(firestoreDB, COMIC_COLLECTION_NAME).withConverter(comicConverter);
    const queryRef = query(collectionRef);
    const [comics, loading, error] = useCollectionData(queryRef);
    return {comics, loading, error}
}

export async function addComic(newComic){
    const collectionRef = collection(firestoreDB, COMIC_COLLECTION_NAME).withConverter(comicConverter);
    await addDoc(collectionRef, {...newComic, createdAt: serverTimestamp()});
}

export async function updateComic(comic){
    await updateDoc(comic.ref, comic);
}

export async function deleteComic(removeComic){
    await deleteDoc(removeComic.ref);
}

export function useLatestComics(limitCount = 5) {
    const collectionRef = collection(firestoreDB, COMIC_COLLECTION_NAME).withConverter(comicConverter);
    const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const [latest, loading, error] = useCollectionData(q);
    return { latest, loading, error };
}

export async function addComics(comicsToAdd){
    const collectionRef = collection(firestoreDB, COMIC_COLLECTION_NAME).withConverter(comicConverter);
    await Promise.all(comicsToAdd.map(comic => addDoc(collectionRef, comic)));
}