import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";

const getUserById = createAsyncThunk("users/getUserById", async (userInfo) => {
  const { userId } = userInfo;
  let user = await db.collection("Users").doc(userId).get();
  user = user.data();
  return user;
});
const initialState = {
  user: {},
};
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: {
    [getUserById.fulfilled]: (state, action) => {
      state.user = action.payload;
      return state;
    },
  },
});

export { getUserById };
export default usersSlice.reducer;
