import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase.service";


export default class EcosProjectModel {
  public static updateEcosProjectStatus(ecosProjectId: string):Promise<void> {
    return updateDoc(doc(db, "ecos_project", ecosProjectId), {
      status: "finished"
    })
  }
}