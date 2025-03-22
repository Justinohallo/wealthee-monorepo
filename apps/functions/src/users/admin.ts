import { Response } from "express";
import admin from "../firebaseAdmin";
import { onRequest } from "firebase-functions/v2/https";

export const createSuperUser = onRequest(async (_, res: Response) => {
  try {
    // Hardcoded credentials
    const email = "justinohallo@gmail.com";
    const password = "tempTemp1234";

    const userRecord = await admin.auth().createUser({ email, password });
    // Set custom claims to assign the role "admin"
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: "admin" });

    res.send({
      uid: userRecord.uid,
      email: userRecord.email,
      role: "admin",
    });
  } catch (error) {
    res.status(500).send({
      error: "Failed to create super user",
      details: error,
    });
  }
});
