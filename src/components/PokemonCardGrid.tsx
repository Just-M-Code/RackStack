import React from "react";
import { IoGitCompare } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import { pokemonTypeInterface, userPokemonsType } from "../utils/Types";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { addToCompare, setCurrentPokemon } from "../app/slices/PokemonSlice";
import { setPokemonTab, setToast } from "../app/slices/AppSlice";
import { addPokemonToList } from "../app/reducers/addPokemonToList";
import { removePokemon } from "../app/reducers/removePokemonFromUserList";
import { pokemonTabs } from "../utils/Constants";

// Define the PokemonCardGrid component
function PokemonCardGrid({ pokemons }: { pokemons: userPokemonsType[] }) {
  // Get the necessary dispatch and navigation functions
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Render the Pokemon cards
  return (
    <div className="pokemon-card-grid-container">
      <div className="pokemon-card-grid">
        {/* Loop through the 'pokemons' prop and render each Pokemon card */}
        {pokemons &&
          pokemons.length > 0 &&
          pokemons?.map((data: userPokemonsType) => {
            return (
              <div key={data.id} className="pokemon-card">
                <div className="pokemon-card-list">
                  {/* Show 'plus' icon for adding to list or 'trash' icon for removing */}
                  {location.pathname.includes("/pokemon") ||
                  location.pathname.includes("/search") ? (
                    <FaPlus
                      className="plus"
                      onClick={() => dispatch(addPokemonToList(data))}
                    />
                  ) : (
                    <FaTrash
                      className="trash"
                      onClick={async () => {
                        await dispatch(removePokemon({ id: data.firebaseId! }));
                        dispatch(setToast("Pokemon removed successfully."));
                      }}
                    />
                  )}
                </div>
                <div className="pokemon-card-compare">
                  {/* Show 'compare' icon for adding to compare queue */}
                  <IoGitCompare
                    onClick={() => {
                      dispatch(addToCompare(data));
                      dispatch(
                        setToast(
                          `${data.name} has been added to compare queue.`
                        )
                      );
                    }}
                  />
                </div>
                {/* Display the Pokemon's name */}
                <h3 className="pokemon-card-title">{data.name}</h3>
                {/* Display the Pokemon's image */}
                <img
                  src={data.image}
                  alt={data.name}
                  className="pokemon-card-image"
                  loading="lazy"
                  onClick={() => {
                    // Set the Pokemon tab and navigate to the Pokemon's page
                    dispatch(setPokemonTab(pokemonTabs.description));
                    dispatch(setCurrentPokemon(undefined));
                    navigate(`/pokemon/${data.id}`);
                  }}
                />
                {/* Display the Pokemon's types */}
                <div className="pokemon-card-types">
                  {data.types.map(
                    (type: pokemonTypeInterface, index: number) => {
                      const keys = Object.keys(type);
                      return (
                        <div className="pokemon-card-types-type" key={index}>
                          {/* Display the type image and text */}
                          <img
                            src={type[keys[0]].image}
                            alt="pokemon type"
                            className="pokemon-card-types-type-image"
                            loading="lazy"
                          />
                          <h6 className="pokemon-card-types-type-text">
                            {keys[0]}
                          </h6>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default PokemonCardGrid;
