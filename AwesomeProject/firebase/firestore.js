import { db } from "./config";

export const writeDataToFirestore = async (dbName, data) => {
  try {
    const docRef = await addDoc(collection(db, dbName), data);

    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};
