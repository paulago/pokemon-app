import './css/styles.less';
import { api } from './api.js';

const dataStore = {
  pokemonSpeciesList: [],
  displayedPokemon: [],
  currentOffset: 0,
  limit: 20,
  searchTerm: '',
  filters: {
    types: [],
    colors: [],
    gender: null,
  },
  typePokemonMap: {},
  colorPokemonMap: {},
  genderPokemonMap: {},
};

// Extract the numeric ID of a Pokémon from its URL.
function getIdFromUrl(url) {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2], 10);
}

// Capitalize the first letter of a text string.
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize the application by loading initial data and configuring event listeners.
async function init() {
  try {
    // HTTP GET request to endpoint https://pokeapi.co/api/v2/pokedex/national
    const pokedexData = await api.fetchPokedexNational();
    // Stores the list of Pokémon species
    dataStore.pokemonSpeciesList = pokedexData.pokemon_entries;
    renderPokemonList();
    setupEventListeners();
  } catch (error) {
    console.error('Error initializing application:', error);
  }
}

// Display the list of Pokémon in the interface based on the available data.
function renderPokemonList(pokemonIds = null) {
  const pokemonListContainer = document.querySelector('.pokemon-list__grid');
  pokemonListContainer.innerHTML = '';

  let pokemonToDisplay;

  if (pokemonIds) {
    pokemonToDisplay = pokemonIds.map(id =>
      dataStore.pokemonSpeciesList.find(entry => entry.entry_number === id)
    );
  } else {
    const endIndex = dataStore.currentOffset + dataStore.limit;
    pokemonToDisplay = dataStore.pokemonSpeciesList.slice(0, endIndex);
  }

  // If there are no Pokémon to display, display a message and hide the "Load more" button.
  if (!pokemonToDisplay || pokemonToDisplay.length === 0) {
    const feedback = document.createElement('p');
    feedback.textContent = 'No Pokémon to display.';
    pokemonListContainer.appendChild(feedback);
    document.getElementById('load-more').style.display = 'none';
    return;
  }

  // If all available Pokémon have been displayed, the button is hidden.
  if (!pokemonIds && pokemonToDisplay.length >= dataStore.pokemonSpeciesList.length) {
    document.getElementById('load-more').style.display = 'none';
  } else {
    document.getElementById('load-more').style.display = pokemonIds ? 'none' : 'block';
  }

  // Rendering of each Pokémon
  for (const entry of pokemonToDisplay) {
    const pokemonId = entry.entry_number;
    const pokemonName = entry.pokemon_species.name;
    const paddedId = String(pokemonId).padStart(3, '0');
    const imageUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`;

    const pokemonItem = document.createElement('div');
    pokemonItem.classList.add('pokemon-list__item');

    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = pokemonName;
    image.classList.add('pokemon-list__image');

    const name = document.createElement('p');
    name.textContent = `${pokemonId}. ${capitalizeFirstLetter(pokemonName)}`;
    name.classList.add('pokemon-list__name');

    pokemonItem.appendChild(image);
    pokemonItem.appendChild(name);
    pokemonListContainer.appendChild(pokemonItem);
  }
}

function setupEventListeners() {
  document.getElementById('load-more').addEventListener('click', onLoadMore);

  const searchInput = document.querySelector('.header__search-input');
  searchInput.addEventListener('input', onSearchInput);

  const filterCheckboxes = document.querySelectorAll('.filters__checkbox');
  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', onFilterChange);
  });

  const filterRadios = document.querySelectorAll('.filters__radio');
  filterRadios.forEach(radio => {
    radio.addEventListener('change', onFilterChange);
  });

  const resetButton = document.querySelector('.header__reset-button');
  resetButton.addEventListener('click', onReset);
}

// Load and display more Pokémon in the list.
function onLoadMore() {
  dataStore.currentOffset += dataStore.limit;
  renderPokemonList();
}

// Update your search term and apply filters as you type in the search field.
function onSearchInput(event) {
  dataStore.searchTerm = event.target.value.trim().toLowerCase();
  dataStore.currentOffset = 0;
  applyFilters();
}

// Update applied filters when the user selects or deselects options.
function onFilterChange() {
  // Update selected types
  dataStore.filters.types = Array.from(
    document.querySelectorAll('.filters__section--type .filters__checkbox:checked')
  ).map(cb => parseInt(cb.value, 10));

  // Update selected colors
  dataStore.filters.colors = Array.from(
    document.querySelectorAll('.filters__section--color .filters__checkbox:checked')
  ).map(cb => parseInt(cb.value, 10));

  // Update selected gender
  const genderRadio = document.querySelector('.filters__section--gender .filters__radio:checked');
  dataStore.filters.gender = genderRadio ? parseInt(genderRadio.value, 10) : null;

  dataStore.currentOffset = 0;
  applyFilters();
}

// Reset the application to its initial state, clearing the filters and search.
function onReset() {
  dataStore.searchTerm = '';
  document.querySelector('.header__search-input').value = '';

  dataStore.filters.types = [];
  dataStore.filters.colors = [];
  dataStore.filters.gender = null;

  const filterCheckboxes = document.querySelectorAll('.filters__checkbox');
  filterCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  const filterRadios = document.querySelectorAll('.filters__radio');
  filterRadios.forEach(radio => {
    radio.checked = false;
  });

  dataStore.currentOffset = 0;
  renderPokemonList();
}

// Apply the selected filters and render the resulting Pokémon list.
async function filterAndRenderPokemon() {
  try {
    let filteredPokemonIds = dataStore.pokemonSpeciesList.map(entry => entry.entry_number);

    // Filter by types
    if (dataStore.filters.types.length > 0) {
      let typePokemonIdsSet = new Set();
      for (const typeId of dataStore.filters.types) {
        let typeData = dataStore.typePokemonMap[typeId];
        if (!typeData) {
          const typeDataFetched = await api.fetchTypeData(typeId);
          typeData = typeDataFetched.pokemon.map(p => getIdFromUrl(p.pokemon.url));
          dataStore.typePokemonMap[typeId] = typeData;
        }
        typeData.forEach(id => typePokemonIdsSet.add(id));
      }
      // Include only IDs that are in typePokemonIdsSet
      filteredPokemonIds = filteredPokemonIds.filter(id => typePokemonIdsSet.has(id));
    }

    // Filter by colors
    if (dataStore.filters.colors.length > 0) {
      let colorPokemonIdsSet = new Set();
      for (const colorId of dataStore.filters.colors) {
        let colorData = dataStore.colorPokemonMap[colorId];
        if (!colorData) {
          const colorDataFetched = await api.fetchColorData(colorId);
          colorData = colorDataFetched.pokemon_species.map(p => getIdFromUrl(p.url));
          dataStore.colorPokemonMap[colorId] = colorData;
        }
        colorData.forEach(id => colorPokemonIdsSet.add(id));
      }
      // Include only IDs that are in colorPokemonIdsSet
      filteredPokemonIds = filteredPokemonIds.filter(id => colorPokemonIdsSet.has(id));
    }

    // Filter by gender
    if (dataStore.filters.gender && dataStore.filters.gender !== 'all') {
      let genderPokemonIds = dataStore.genderPokemonMap[dataStore.filters.gender];
      if (!genderPokemonIds) {
        const genderDataFetched = await api.fetchGenderData(dataStore.filters.gender);
        genderPokemonIds = genderDataFetched.pokemon_species_details.map(p =>
          getIdFromUrl(p.pokemon_species.url)
        );
        dataStore.genderPokemonMap[dataStore.filters.gender] = genderPokemonIds;
      }
      // Only include IDs that are in genderPokemonIds
      filteredPokemonIds = filteredPokemonIds.filter(id => genderPokemonIds.includes(id));
    }

    // Filter by search term
    if (dataStore.searchTerm) {
      const searchTerm = dataStore.searchTerm.toLowerCase();
      filteredPokemonIds = filteredPokemonIds.filter(id => {
        const entry = dataStore.pokemonSpeciesList.find(e => e.entry_number === id);
        const pokemonName = entry.pokemon_species.name.toLowerCase();
        const pokemonIdStr = id.toString();
        return pokemonName.includes(searchTerm) || pokemonIdStr.includes(searchTerm);
      });
    }

    // Render the filtered list
    renderPokemonList(filteredPokemonIds);
  } catch (error) {
    console.error('Error applying filters:', error);
  }
}

function applyFilters() {
  filterAndRenderPokemon();
}

init();
