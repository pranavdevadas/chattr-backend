import admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const sendPushNotification = async (
  token: string,
  payload: {
    title: string;
    body: string;
    data?: Record<string, string>;
  }
) => {
  try {
    await admin.messaging().send({
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
    });

    console.log("📨 Push notification sent successfully");
  } catch (error) {
    console.error("❌ Error sending push notification:", error);
  }
};

export default admin;
