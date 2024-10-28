const API_URL = 'https://pokeapi.co/api/v2/';

export async function fetchPokemons(limit = 20, offset = 0) {
  try {
    const response = await fetch(`${API_URL}pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    const pokemonPromises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      return res.json();
    });

    return await Promise.all(pokemonPromises);
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    throw error;
  }
}
