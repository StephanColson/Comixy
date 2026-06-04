import { firestoreDB } from "./firebase.js";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collectionGroup,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadImage } from "./storage.js";
import { deleteComicContributor } from "./comicContributer.js";

const EDITION_COLLECTION_NAME = "Editions";
const LIBRARY_SUBCOLLECTION_NAME = "userLibrary";

const defaultLibraryEntry = {
  owned: false,
  read: false,
  wishlist: false,
  favourite: false,
  condition: null,
};

export async function getUserLibraryEntry(editionId, userId) {
  const ref = doc(
    firestoreDB,
    EDITION_COLLECTION_NAME,
    editionId,
    LIBRARY_SUBCOLLECTION_NAME,
    userId,
  );
  const snap = await getDoc(ref);
  if (!snap.exists()) return { ...defaultLibraryEntry };
  return snap.data();
}

export async function setUserLibraryEntry(editionId, userId, fields) {
  const ref = doc(
    firestoreDB,
    EDITION_COLLECTION_NAME,
    editionId,
    LIBRARY_SUBCOLLECTION_NAME,
    userId,
  );
  await setDoc(ref, fields, { merge: true });
}

export async function getUserOwnedEditions(userId) {
  const q = query(
    collectionGroup(firestoreDB, LIBRARY_SUBCOLLECTION_NAME),
    where("owned", "==", true),
  );
  const snap = await getDocs(q);
  return snap.docs
    .filter((d) => d.id === userId)
    .map((d) => ({
      editionId: d.ref.parent.parent.id,
      ...d.data(),
    }));
}

export async function getUserWishlist(userId) {
  const q = query(
    collectionGroup(firestoreDB, LIBRARY_SUBCOLLECTION_NAME),
    where("wishlist", "==", true),
  );
  const snap = await getDocs(q);
  return snap.docs
    .filter((d) => d.id === userId)
    .map((d) => ({
      editionId: d.ref.parent.parent.id,
      ...d.data(),
    }));
}

export async function uploadFile(file) {
  if (!file) throw new Error("No files selected");
  const { url } = await uploadImage(file);
  return url;
}

export async function uploadFiles(files) {
  const validFiles = files.filter(Boolean);
  if (!validFiles.length) return [];
  return Promise.all(validFiles.map((file) => uploadFile(file)));
}

const editionConverter = {
  toFirestore: (dataInApp) => ({
    format: dataInApp.format,
    imgURLs: dataInApp.imgURLs ?? [],
    printYear: dataInApp.printYear,
    comicID: dataInApp.comicID,
    printType: dataInApp.printType,
    numberInCollection: dataInApp.numberInCollection,
    organizationID: dataInApp.organizationID,
    price: dataInApp.price ?? null,
    compendiumID: dataInApp.compendiumID ?? null,
    spine: dataInApp.spine ?? null,
  }),
  fromFirestore: (snapshot, option) => {
    const data = snapshot.data(option);
    const imgURLs = data.imgURLs?.length
      ? data.imgURLs
      : data.imgURL
        ? [data.imgURL]
        : [];
    return {
      ...data,
      imgURLs,
      compendiumID: data.compendiumID ?? null,
      id: snapshot.id,
      ref: snapshot.ref,
    };
  },
};

export function useEditionCollectionData() {
  const collectionRef = collection(
    firestoreDB,
    EDITION_COLLECTION_NAME,
  ).withConverter(editionConverter);
  const queryRef = query(collectionRef);
  const [editions, loading, error] = useCollectionData(queryRef);
  return { editions, loading, error };
}

export async function addEdition(newEdition) {
  const collectionRef = collection(
    firestoreDB,
    EDITION_COLLECTION_NAME,
  ).withConverter(editionConverter);
  const docRef = await addDoc(collectionRef, newEdition);
  return docRef.id;
}

export async function updateEdition(edition) {
  await updateDoc(edition.ref, edition);
}

export async function deleteEdition(edition, comicContributors) {
  const editionContributors = comicContributors.filter(
    (cc) => cc.editionID === edition.id,
  );
  await Promise.all(
    editionContributors.map((cc) => deleteComicContributor(cc.id)),
  );
  await deleteDoc(doc(firestoreDB, "Editions", edition.id));
}
