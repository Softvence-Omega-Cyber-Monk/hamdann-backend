"use strict";
// import { messaging } from "../configs/firebaseAdmin";
// import { User_Model } from "../modules/user/user.schema";
// export const sendNotification = async (
//   userId: string,
//   title: string,
//   body: string
// ): Promise<void> => {
//   try {
//     const user = await User_Model.findById(userId);
//     if (!user || !user.fcmToken) {
//       console.log(`❌ No FCM token for user ${userId}`);
//       return;
//     }
//     const message = {
//       notification: { title, body },
//       token: user.fcmToken,
//     };
//     const response = await messaging.send(message);
//     console.log("✅ Notification sent:", response);
//   } catch (err) {
//     console.error("⚠️ Error sending notification:", err);
//   }
// };
