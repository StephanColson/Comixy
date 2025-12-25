import {collection, query} from "firebase/firestore";
import {firestoreDB} from "./firebase.js";
import {useCollectionData} from "react-firebase-hooks/firestore";

const ORGANIZATION_COLLECTION = "Organizations";

const organizationCoverter = {
    toFirestore: dataInApp => ({
        name: dataInApp.name,
    }),
    fromFirestore: (snapshot, option) => {
        const data = snapshot.data(option);
        return {...data, id: snapshot.id, ref: snapshot.ref}
    }
};

export function useOrganizationCollectionData() {
    const collectionRef = collection(firestoreDB, ORGANIZATION_COLLECTION).withConverter(organizationCoverter);
    const queryRef = query(collectionRef);
    const [organizations, loading, error] = useCollectionData(queryRef);
    return {organizations, loading, error};
}