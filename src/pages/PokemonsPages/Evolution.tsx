import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getPokemonsData } from "../../app/reducers/getPokemonsData";
import PokemonCardGrid from "../../components/PokemonCardGrid";

function Evolution() {
  const dispatch = useAppDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const { currentPokemon, randomPokemons } = useAppSelector(
    ({ pokemon }) => pokemon
  );

  useEffect(() => {
    const fetchData = async () => {
      const pokemons = currentPokemon?.evolution.map(({ pokemon }) => pokemon);
      await dispatch(getPokemonsData(pokemons!));
      setIsLoaded(true);
    };
    fetchData();
  }, [dispatch, currentPokemon]);

  return (
    <div className="page">
      {isLoaded && <PokemonCardGrid pokemons={randomPokemons!} />}
    </div>
  );
}

export default Evolution;
