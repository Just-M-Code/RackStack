// @ts-nocheck
import React, { useEffect, useState } from "react";
import Wrapper from "../sections/Wrapper";
import { debounce } from "../utils";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getInitialPokemonData } from "../app/reducers/getInitialPokemonData";
import { getPokemonsData } from "../app/reducers/getPokemonsData";
import Loader from "../components/Loader";
import { setLoading } from "../app/slices/AppSlice";

import PokemonCardGrid from "../components/PokemonCardGrid";

function Search() {
  const handleChange = debounce((value: string) => getPokemon(value), 300);
  const isLoading = useAppSelector(({ app: { isLoading } }) => isLoading);
  const dispatch = useAppDispatch();
  const { allPokemon, randomPokemons } = useAppSelector(
    ({ pokemon }) => pokemon
  );

  const [loadedPokemonsCount, setLoadedPokemonsCount] = useState(20); // Initially load 20 pokemons at a time
  const [clonedPokemons, setClonedPokemons] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getInitialPokemonData());
  }, [dispatch]);

  useEffect(() => {
    if (allPokemon) {
      const clonedPokemons = [...allPokemon];
      setClonedPokemons(clonedPokemons);
      const randomPokemonsId = clonedPokemons.slice(0, loadedPokemonsCount);
      dispatch(getPokemonsData(randomPokemonsId));
    }
  }, [allPokemon, loadedPokemonsCount, dispatch]);

  useEffect(() => {
    if (randomPokemons) {
      dispatch(setLoading(false));
    }
  }, [randomPokemons, dispatch]);

  const getPokemon = async (value: string) => {
    if (value.length) {
      const pokemons = allPokemon.filter((pokemon) =>
        pokemon.name.includes(value.toLowerCase())
      );
      dispatch(getPokemonsData(pokemons));
    } else {
      const randomPokemonsId = clonedPokemons.slice(0, loadedPokemonsCount);
      dispatch(getPokemonsData(randomPokemonsId));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadedPokemonsCount((prevCount) => prevCount + 20);
    }, 1000); // Adjust the interval time as needed

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="search">
          <input
            type="text"
            onChange={(e) => handleChange(e.target.value)}
            className="pokemon-searchbar"
            placeholder="Search Pokemon"
          />
          <PokemonCardGrid pokemons={randomPokemons} />
        </div>
      )}
    </>
  );
}

export default Wrapper(Search);
