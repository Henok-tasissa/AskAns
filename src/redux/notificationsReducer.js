import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async (notificationInfo) => {
    const { userId } = notificationInfo;

    let notifications = await db
      .collection("Notifications")
      .where("notify", "==", userId)
      .get();

    let notificationsList = [];
    notifications.forEach((notification) => {
      notification = notification.data();
      notification.timestamp = new Date(
        notification.timestamp.toDate()
      ).toLocaleDateString();
      notificationsList.push(notification);
    });

    for (let notification of notificationsList) {
      let user = await db.collection("Users").doc(notification.notifier).get();
      user = user.data();
      notification.notifierInfo = {
        name: user.firstName + " " + user.lastName,
        profileImage: user.photoURL,
      };
    }
    return notificationsList;
  }
);
const initialState = {};
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: {
    [getNotifications.fulfilled]: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});
export { getNotifications };
export default notificationsSlice.reducer;
