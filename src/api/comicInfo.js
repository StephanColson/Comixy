import {deleteDoc, updateDoc, addDoc, collection, query, orderBy, limit, serverTimestamp} from "firebase/firestore";
import {firestoreDB} from "./firebase.js";
import {useCollectionData} from "react-firebase-hooks/firestore";

const COMIC_COLLECTION_NAME = 'Comics';

const comicConverter = {
    toFirestore: dataInApp => ({
        title: dataInApp.title,
        bookNumber: dataInApp.bookNumber,
        price: dataInApp.price,
        genres: [],
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
    const docRef = await addDoc(collectionRef, {...newComic, createdAt: serverTimestamp()});
    return docRef.id;
}

export function useLatestComics(limitCount = 5) {
    const collectionRef = collection(firestoreDB, COMIC_COLLECTION_NAME).withConverter(comicConverter);
    const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const [latest, loading, error] = useCollectionData(q);
    return { latest, loading, error };
}