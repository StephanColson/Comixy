import { firestoreDB } from "./firebase.js";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { uploadImage } from "./storage.js";
import { deleteComicContributor } from "./comicContributer.js";

const EDITION_COLLECTION_NAME = "Editions";
const LIBRARY_SUBCOLLECTION_NAME = "userLibrary";
const COPIES_SUBCOLLECTION_NAME = "copies";

const defaultLibraryEntry = {
  wishlist: false,
  read: false,
  favourite: false,
};

const defaultCopy = {
  condition: null,
  price: null,
  note: null,
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

function copiesCollectionRef(editionId, userId) {
  return collection(
    firestoreDB,
    EDITION_COLLECTION_NAME,
    editionId,
    LIBRARY_SUBCOLLECTION_NAME,
    userId,
    COPIES_SUBCOLLECTION_NAME,
  );
}

export async function getUserCopies(editionId, userId) {
  const snap = await getDocs(copiesCollectionRef(editionId, userId));
  return snap.docs.map((d) => ({ id: d.id, ...defaultCopy, ...d.data() }));
}

export async function addCopy(editionId, userId, fields = {}) {
  const docRef = await addDoc(copiesCollectionRef(editionId, userId), {
    ...defaultCopy,
    ...fields,
    userId,
    editionID: editionId,
  });
  return docRef.id;
}

export async function deleteCopy(editionId, userId, copyId) {
  const ref = doc(copiesCollectionRef(editionId, userId), copyId);
  await deleteDoc(ref);
}

export async function updateCopy(editionId, userId, copyId, fields) {
  const ref = doc(copiesCollectionRef(editionId, userId), copyId);
  await setDoc(ref, fields, { merge: true });
}

async function getAllUserCopies(userId) {
  const q = query(
    collectionGroup(firestoreDB, COPIES_SUBCOLLECTION_NAME),
    where("userId", "==", userId),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...defaultCopy, ...d.data() }));
}

function dedupeByEdition(copies) {
  const seen = new Map();
  for (const copy of copies) {
    if (!seen.has(copy.editionID)) {
      seen.set(copy.editionID, { editionId: copy.editionID });
    }
  }
  return [...seen.values()];
}

export async function getUserOwnedEditions(userId) {
  const copies = await getAllUserCopies(userId);
  return dedupeByEdition(copies);
}

export async function getUserRead(userId) {
  return getUserEntriesByField(userId, "read");
}

export async function getUserFavourites(userId) {
  return getUserEntriesByField(userId, "favourite");
}

async function getUserEntriesByField(userId, field) {
  const editionsSnap = await getDocs(
    collection(firestoreDB, EDITION_COLLECTION_NAME),
  );

  const results = await Promise.all(
    editionsSnap.docs.map(async (editionDoc) => {
      const libraryRef = doc(
        firestoreDB,
        EDITION_COLLECTION_NAME,
        editionDoc.id,
        LIBRARY_SUBCOLLECTION_NAME,
        userId,
      );
      const librarySnap = await getDoc(libraryRef);
      if (!librarySnap.exists()) return null;
      const data = librarySnap.data();
      if (!data[field]) return null;
      return { editionId: editionDoc.id, ...data };
    }),
  );

  return results.filter(Boolean);
}

export async function getUserWishlist(userId) {
  return getUserEntriesByField(userId, "wishlist");
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
    compendiumID: dataInApp.compendiumID ?? null,
    spine: dataInApp.spine ?? null,
    note: dataInApp.note ?? null,
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
  const cleanData = editionConverter.toFirestore(edition);
  await updateDoc(edition.ref, cleanData);
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
