// Function to display Pokémon in the DOM
export function displayPokemons(pokemons, container) {
    pokemons.forEach((pokemon) => {
      const pokemonItem = document.createElement('div');
      pokemonItem.classList.add('pokemon-list__item');
  
      pokemonItem.innerHTML = `
        <img class="pokemon-list__image" src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${String(pokemon.id).padStart(3, '0')}.png" alt="${pokemon.name}">
        <h4 class="pokemon-list__name">${pokemon.name}</h4>
      `;
  
      container.appendChild(pokemonItem);
    });
}
  
// Function to clean the Pokémon from the container
export function clearPokemons(container) {
    container.innerHTML = '';
}
  