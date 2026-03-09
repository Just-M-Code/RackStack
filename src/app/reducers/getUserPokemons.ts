import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getDocs, query, where } from "firebase/firestore";
import { pokemonListRef } from "../../utils/FireBaseConfig";
import { userPokemonsType } from "../../utils/Types";
import axios from "axios";
import { pokemonTypes } from "../../utils";

export const getUserPokemons = createAsyncThunk(
  "pokemon/userList",
  async (args, { getState }) => {
    try {
      const {
        app: { userInfo },
      } = getState() as RootState;
      if (!userInfo?.email) {
        return [];
      }
      const firestoreQuery = query(
        pokemonListRef,
        where("email", "==", userInfo.email)
      );
      const fetchedPokemons = await getDocs(firestoreQuery);
      if (fetchedPokemons.docs.length) {
        const userPokemons: userPokemonsType[] = [];
        for (const pokemon of fetchedPokemons.docs) {
          const pokemons = pokemon.data().pokemon;

          // Fetch Pokemon details from the PokeAPI using Axios
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemons.id}`
          );
          const data = response.data;

          // Retrieve the image URL from the official-artwork endpoint
          const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemons.id}.png`;

          // Map types

          const types = data.types.map((type: { type: { name: string } }) => ({
            //@ts-ignore
            [type.type.name]: pokemonTypes[type.type.name],
          }));

          // Create the user Pokemon object
          userPokemons.push({
            ...pokemons,
            firebaseId: pokemon.id,
            image,
            types,
          });
        }
        return userPokemons;
      }
      return [];
    } catch (err) {
      console.log(err);
    }
  }
);
