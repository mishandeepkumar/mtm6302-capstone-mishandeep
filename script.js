document.addEventListener('DOMContentLoaded', () => {
    const pokemonGallery = document.getElementById('pokemon-gallery');
    const loadMoreButton = document.getElementById('load-more');
    const pokemonDetails = document.getElementById('pokemon-details');
    const closeDetailsButton = document.getElementById('close-details');
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonImage = document.getElementById('pokemon-image');
    const pokemonAbilities = document.getElementById('pokemon-abilities');
    const pokemonTypes = document.getElementById('pokemon-types');
    const catchReleaseButton = document.getElementById('catch-release');
    let offset = 0;
    const limit = 20;
    const maxPokemons = 100; // Maximum number of Pokémon to load
    let caughtPokemonIds = JSON.parse(localStorage.getItem('caughtPokemonIds')) || [];

    // Function to fetch Pokémon data from the PokéAPI
    const fetchPokemon = async (offset, limit) => {
        if (offset >= maxPokemons) {
            loadMoreButton.style.display = 'none'; // Hide the "Load More" button if limit is reached
            return;
        }
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            const data = await response.json();
            displayPokemon(data.results);
            offset += limit;
        } catch (error) {
            console.error('Error fetching Pokémon:', error);
        }
    };

    // Function to display Pokémon cards in the gallery
    const displayPokemon = (pokemonList) => {
        pokemonList.forEach(pokemon => {
            const pokemonId = parseUrl(pokemon.url);
            const pokemonCard = document.createElement('div');
            pokemonCard.className = 'pokemon-card';
            pokemonCard.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemon.name}">
                <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
            `;
            pokemonCard.addEventListener('click', () => showPokemonDetails(pokemon, pokemonId));
            if (isCaught(pokemonId)) {
                pokemonCard.classList.add('caught');
            }
            pokemonGallery.appendChild(pokemonCard);
        });
        updatePokemonCards();
    };

    // Function to show Pokémon details in the modal
    const showPokemonDetails = async (pokemon, id) => {
        try {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            pokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            pokemonImage.src = data.sprites.front_default;
            pokemonAbilities.innerHTML = data.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('');
            pokemonTypes.innerHTML = data.types.map(type => `<li>${type.type.name}</li>`).join('');
            catchReleaseButton.textContent = isCaught(id) ? 'Release' : 'Catch';
            catchReleaseButton.onclick = () => toggleCatch(id);
            pokemonDetails.style.display = 'flex';
        } catch (error) {
            console.error('Error fetching Pokémon details:', error);
        }
    };

    // Function to close Pokémon details modal
    closeDetailsButton.addEventListener('click', () => {
        pokemonDetails.style.display = 'none';
    });

    // Function to handle catching or releasing Pokémon
    const toggleCatch = (id) => {
        if (isCaught(id)) {
            releasePokemon(id);
        } else {
            catchPokemon(id);
        }
        localStorage.setItem('caughtPokemonIds', JSON.stringify(caughtPokemonIds));
        pokemonDetails.style.display = 'none';
        updatePokemonCards();
    };

    // Function to check if Pokémon is caught
    const isCaught = (id) => {
        return caughtPokemonIds.includes(id);
    };

    // Function to catch Pokémon
    const catchPokemon = (id) => {
        caughtPokemonIds.push(id);
    };

    // Function to release Pokémon
    const releasePokemon = (id) => {
        caughtPokemonIds = caughtPokemonIds.filter(pokemonId => pokemonId !== id);
    };

    // Function to update Pokémon cards
    const updatePokemonCards = () => {
        const pokemonCards = document.querySelectorAll('.pokemon-card');
