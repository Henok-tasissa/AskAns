import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
const getCategories = createAsyncThunk(
  "categories/getCategories",
  async (language) => {
    let categories = [];
    await db
      .collection("Categories")
      .where("lang", "==", language)
      .get()
      .then((data) => {
        data.forEach((category) => {
          categories.push(category.data());
        });
      });

    return categories;
  }
);

const initialState = {
  categories: [],
  selected: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: {
    [getCategories.fulfilled]: (state, action) => {
      state.categories = action.payload;
      return state;
    },
  },
});

export { getCategories };
export default categoriesSlice.reducer;
