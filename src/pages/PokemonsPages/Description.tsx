import React from "react";
import { useAppSelector } from "../../app/hooks";
import PokemonContainer from "../../components/PokemonContainer";
import Info from "../../components/Info";

function Description() {
  const pokemonData = useAppSelector(
    ({ pokemon: { currentPokemon } }) => currentPokemon
  );
  return (
    <div>
      <Info data={pokemonData} />
      <PokemonContainer image={pokemonData?.image!} />
    </div>
  );
}

export default Description;
