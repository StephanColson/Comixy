import { addDoc, collection, query} from "firebase/firestore";
import {firestoreDB} from "./firebase.js";
import {useCollectionData} from "react-firebase-hooks/firestore";

const COMIC_COLLECTION_NAME = 'comics';

const comicConverter = {
    toFirestore: dataInApp => ({
        title: dataInApp.title,
        serie: dataInApp.serie,
        bookNumber: dataInApp.bookNumber,
        numberName: dataInApp.numberName,
        price: dataInApp.price,
        released: dataInApp.released,
        cover: dataInApp.cover,
        synopsis: dataInApp.synopsis,
        genres: dataInApp.genres,
        author: dataInApp.author,
        artist: dataInApp.artist,
        publisher: dataInApp.publisher,
    }),
};

export function useComicCollectionData(){
    const collectionRef = collection(firestoreDB, COMIC_COLLECTION_NAME);
    const queryRef = query(collectionRef);
    const [comics, loading, error] = useCollectionData(queryRef);
    return {comics, loading, error}
}

export async function addComic(comicsToAdd){
    const collectionRef = collection(firestoreDB, COMIC_COLLECTION_NAME).withConverter(comicConverter);
    await Promise.all(comicsToAdd.map(comic => addDoc(collectionRef, comic)));
}