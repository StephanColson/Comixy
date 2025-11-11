import {collection, query} from "firebase/firestore";
import {firestoreDB} from "./firebase.js";
import {useCollectionData} from "react-firebase-hooks/firestore";

const USER_COLLECTION = 'users';

const userConverter = {
    toFirestore: dataInApp => ({
        name: dataInApp.name,
        ownedComics: dataInApp.ownedComics,
        birthdate: dataInApp.birthdate,
    }),
    fromFirestore: (snapshot, option) => {
        const data = snapshot.data(option);
        return {...data, id: snapshot.id, ref: snapshot.ref}
    }
};

export function useUserCollectionData(){
    const collectionRef = collection(firestoreDB, USER_COLLECTION).withConverter(userConverter);
    const queryRef = query(collectionRef);
    const [users, loading, error] = useCollectionData(queryRef);
    return {users, loading, error}
}