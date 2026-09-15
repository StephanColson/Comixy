import { firestoreDB } from "./firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const CONFIG_DOC_PATH = ["AppConfig", "branding"];

export function useAppConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(firestoreDB, ...CONFIG_DOC_PATH);
    getDoc(ref).then((snap) => {
      setConfig(snap.exists() ? snap.data() : {});
      setLoading(false);
    });
  }, []);

  return { config, loading };
}
