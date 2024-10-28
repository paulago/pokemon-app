import './css/styles.less';
import { fetchPokemons } from './api.js';
import { displayPokemons, clearPokemons } from './ui.js';

const pokemonList = document.querySelector('.pokemon-list__grid');
const loadMoreButton = document.getElementById('load-more');
const searchInput = document.querySelector('.header__search-input');


let offset = 20;

// Load the first 20 Pokémon
async function loadInitialPokemons() {
  const pokemons = await fetchPokemons();
  displayPokemons(pokemons, pokemonList);
}

// Load more Pokémon when you click "Load More"
loadMoreButton.addEventListener('click', async () => {
  const pokemons = await fetchPokemons(20, offset);
  displayPokemons(pokemons, pokemonList);
  offset += 20;
});

// Search function on input
searchInput.addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  filterPokemons(query);
});

// Filter Pokémon
function filterPokemons(query) {
  const pokemonItems = document.querySelectorAll('.pokemon-list__item');
  pokemonItems.forEach((item) => {
    const pokemonName = item.querySelector('.pokemon-list__name').textContent.toLowerCase();
    if (pokemonName.includes(query)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// Initialize Pokémon loading
loadInitialPokemons();
