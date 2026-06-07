import { firestoreDB } from "./firebase.js";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  query,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { deleteComic } from "./comicInfo.js";

const SERIE_COLLECTION_NAME = "Series";

const serieConverter = {
  toFirestore: (dataInApp) => ({
    title: dataInApp.title,
    description: dataInApp.description,
    universeID: dataInApp.universeID ?? null,
  }),
  fromFirestore: (snapshot, option) => {
    const data = snapshot.data(option);
    return { ...data, id: snapshot.id, ref: snapshot.ref };
  },
};

export async function addSerie(newSerie) {
  const collectionRef = collection(
    firestoreDB,
    SERIE_COLLECTION_NAME,
  ).withConverter(serieConverter);
  const docRef = await addDoc(collectionRef, newSerie);
  return docRef.id;
}

export async function updateSerie(serie) {
  await updateDoc(serie.ref, {
    description: serie.description,
    universeID: serie.universeID ?? null,
  });
}

export function useSerieCollectionData() {
  const collectionRef = collection(
    firestoreDB,
    SERIE_COLLECTION_NAME,
  ).withConverter(serieConverter);
  const queryRef = query(collectionRef);
  const [series, loading, error] = useCollectionData(queryRef);
  return { series, loading, error };
}

export async function deleteSerie(serie, comics, editions, comicContributors) {
  const serieComics = comics.filter((c) => c.serieID === serie.id);
  await Promise.all(
    serieComics.map((comic) => deleteComic(comic, editions, comicContributors)),
  );
  await deleteDoc(serie.ref);
}
