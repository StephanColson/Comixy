import {firestoreDB} from "./firebase.js";
import {collection, query} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";

const ROLE_COLLECTION = "Roles";

const roleConverter = {
    toFirestore: dataInApp => ({
        type: dataInApp.type,
    }),
    fromFirestore: (snapshot, option) => {
        const data = snapshot.data(option);
        return {...data, id: snapshot.id, ref: snapshot.ref}
    }
};

export function useRoleCollectionData() {
    const collectionRef = collection(firestoreDB, ROLE_COLLECTION).withConverter(roleConverter);
    const queryRef = query(collectionRef);
    const [roles, loading, error] = useCollectionData(queryRef);
    return {roles, loading, error};
}