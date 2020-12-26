import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db, storage } from "../../firebaseConfig";
import uuid from "react-native-uuid";

const setUser = createAsyncThunk("user/setUser", async (userId) => {
  let userData = {};
  await db
    .collection("Users")
    .doc(userId)
    .get()
    .then((user) => {
      userData = user.data();
    });

  return userData;
});
const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileInfo) => {
    const { userId, firstName, lastName, gender, language } = profileInfo;
    await db.collection("Users").doc(userId).update({
      firstName,
      lastName,
      language,
      gender,
    });
    let user = await db.collection("Users").doc(userId).get();
    user = user.data();
    return user;
  }
);
const updateBio = createAsyncThunk("user/updateBio", async (bioInfo) => {
  const { userId, bio } = bioInfo;
  await db.collection("Users").doc(userId).update({
    bio,
  });
  let user = await db.collection("Users").doc(userId).get();
  user = user.data();
  return user;
});
const uploadProfilePicture = createAsyncThunk(
  "user/uploadProfilePicture",
  async (info) => {
    const { imageBlob, userId } = info;
    let newImageName = uuid.v1();
    console.log("newImageName");
    let profileImageRef = await storage
      .ref(`images/${newImageName}`)
      .put(imageBlob);

    const imageLink = await storage
      .ref("images")
      .child(newImageName)
      .getDownloadURL();
    await db.collection("Users").doc(userId).update({ photoURL: imageLink });
    return imageLink;
  }
);
// export const uploadProfilePicture = async (userId, imageBlob) => {
//   let newImageName = " uuid.v1()";
//   console.log(newImageName);
//   let profileImageRef = await storage
//     .ref(`images/${newImageName}`)
//     .put(imageBlob);

//   await storage
//     .ref("images")
//     .child(newImageName)
//     .getDownloadURL()
//     .then((url) => {
//       db.collection("Users").doc(userId).update({ photoURL: url });
//     });
// };
const initialState = {
  user: {},
  questions: [],
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfileBio: (state, action) => {
      return {
        ...state,
        bio: action.payload,
      };
    },
  },
  extraReducers: {
    [setUser.fulfilled]: (state, action) => {
      state = action.payload;
      return state;
    },
    [updateProfile.fulfilled]: (state, action) => {
      state = action.payload;
      console.log(state);
      return state;
    },
    [uploadProfilePicture.fulfilled]: (state, action) => {
      state.photoURL = action.payload;
      return state;
    },
    [updateBio.fulfilled]: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setProfileBio } = userSlice.actions;
export { setUser, updateProfile, updateBio, uploadProfilePicture };
export default userSlice.reducer;
