import { createAsyncThunk } from "@reduxjs/toolkit";
import { pokemonListRef } from "../../utils/FireBaseConfig";
import { deleteDoc, doc } from "firebase/firestore";

export const removePokemon = createAsyncThunk(
  "pokemon/remove",
  async ({ id }: { id: string }) => {
    try {
      await deleteDoc(doc(pokemonListRef, id));
      return { id };
    } catch (err) {
      console.log(err);
    }
  }
);
