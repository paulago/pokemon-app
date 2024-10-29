# Pokémon Search and Filter Application

This project is a web application that allows users to search and filter Pokémon using different criteria such as type, color, and gender. The application consumes data from the PokéAPI and features an intuitive and responsive interface to improve the user experience.

## Features

- Real-Time Search: Search for Pokémon by name or ID with instant results.
- Filtered by:
    - Types: Filter Pokémon by one or more types (Fire, Water, Grass, etc.).
    - Colors: Filter by basic colors (Red, Blue, Yellow, etc.).
    - Gender: Filter by gender (Male, Female, No gender).
- Pagination: Load more Pokémon as the user requests it.
- Responsive Design: Optimized for mobile devices, tablets, and desktops.
- Reset: Button to reset all filters and searches to their initial state.

## Technologies Used

- HTML5 and CSS3: Basic application structure and styles.
- JavaScript: Application logic and DOM manipulation.
- LESS: CSS preprocessor.
- PokéAPI: Public API used to obtain Pokémon data.
- BEM Methodology: For naming CSS classes in a consistent and scalable way.

## Installation

1. Clone the repository:
```
git clone https://github.com/paulago/prueba-fullstack-seat-code
cd prueba-fullstack-seat-code
```

2. Install the dependencies:
I use Vite to manage the project and compile LESS. Install the dependencies by running:
```
npm install
```

3. Run the application in development mode:
```
npm run dev
```

This will start a development server and automatically compile the LESS files. You should see output similar to:
```
VITE vX.X.X ready in XXX ms

➜ Local: http://localhost:3000/
➜ Network: use --host to expose
```

Open your browser and visit http://localhost:3000/ to view the application.

4. Build for production (optional):
```
npm run build
```