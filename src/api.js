export const api = {
    baseUrl: 'https://pokeapi.co/api/v2',
  
    // Fetch the national Pokédex data
    fetchPokedexNational: async function () {
      const response = await fetch(`${this.baseUrl}/pokedex/national`);
      if (!response.ok) {
        throw new Error('Failed to fetch the national Pokédex.');
      }
      return response.json();
    },
  
    // Fetch data for a specific type
    fetchTypeData: async function (typeId) {
      const response = await fetch(`${this.baseUrl}/type/${typeId}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch type data for type ID ${typeId}.`);
      }
      return response.json();
    },
  
    // Fetch data for a specific color
    fetchColorData: async function (colorId) {
      const response = await fetch(`${this.baseUrl}/pokemon-color/${colorId}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch color data for color ID ${colorId}.`);
      }
      return response.json();
    },
  
    // Fetch data for a specific gender
    fetchGenderData: async function (genderId) {
      const response = await fetch(`${this.baseUrl}/gender/${genderId}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch gender data for gender ID ${genderId}.`);
      }
      return response.json();
    },
  };
  