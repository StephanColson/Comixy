import {
  addDoc,
  collection,
  query,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestoreDB } from "../api/firebase.js";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { deleteSerie } from "./serieInfo.js";

const UNIVERSE_COLLECTION_NAME = "Universes";

const universeConverter = {
  toFirestore: (dataInApp) => ({
    title: dataInApp.title,
  }),
  fromFirestore: (snapshot, option) => {
    const data = snapshot.data(option);
    return { ...data, id: snapshot.id, ref: snapshot.ref };
  },
};

export async function addUniverse(newUniverse) {
  const collectionRef = collection(
    firestoreDB,
    UNIVERSE_COLLECTION_NAME,
  ).withConverter(universeConverter);
  const docRef = await addDoc(collectionRef, newUniverse);
  return docRef.id;
}

export async function updateUniverse(universe) {
  await updateDoc(universe.ref, universe);
}

export function useUniverseCollectionData() {
  const collectionRef = collection(
    firestoreDB,
    UNIVERSE_COLLECTION_NAME,
  ).withConverter(universeConverter);
  const queryRef = query(collectionRef);
  const [universes, loading, error] = useCollectionData(queryRef);
  return { universes, loading, error };
}

export async function deleteUniverse(
  universe,
  series,
  comics,
  editions,
  comicContributors,
) {
  const universeSeries = series.filter((s) => s.universeID === universe.id);
  await Promise.all(
    universeSeries.map((serie) =>
      deleteSerie(serie, comics, editions, comicContributors),
    ),
  );
  await deleteDoc(universe.ref);
}
