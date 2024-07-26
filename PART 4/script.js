document.addEventListener('DOMContentLoaded', () => {
    // Pokedex Functionality
    const gallery = document.getElementById('pokemon-gallery');
    const loadMoreButton = document.getElementById('load-more');
    let nextUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20';
    const caughtPokemon = JSON.parse(localStorage.getItem('caughtPokemon')) || [];

    // Function to parse Pokémon ID from URL
    function parseUrl(url) {
        return url.split('/').filter(Boolean).pop();
    }

    // Function to load Pokémon data
    async function loadPokemon(url) {
        const response = await fetch(url);
        const data = await response.json();
        nextUrl = data.next;
        data.results.forEach(pokemon => addPokemonToGallery(pokemon));
    }

    // Function to add Pokémon to gallery
    async function addPokemonToGallery(pokemon) {
        const response = await fetch(pokemon.url);
        const details = await response.json();
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'pokemon-card';
        pokemonCard.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.id}.png" alt="${pokemon.name}">
            <h5>${pokemon.name}</h5>
            <button class="btn btn-secondary btn-sm catch-release">${caughtPokemon.includes(details.id) ? 'Release' : 'Catch'}</button>
        `;

        pokemonCard.querySelector('img').addEventListener('click', () => showPokemonDetails(details));
        pokemonCard.querySelector('.catch-release').addEventListener('click', () => toggleCatchRelease(details.id));
        gallery.appendChild(pokemonCard);
    }

    // Function to show Pokémon details
    function showPokemonDetails(details) {
        const detailsDiv = document.getElementById('pokemon-details');
        detailsDiv.innerHTML = `
            <h2>${details.name}</h2>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.id}.png" alt="${details.name}">
            <p>Height: ${details.height}</p>
            <p>Weight: ${details.weight}</p>
            <button class="btn btn-secondary" onclick="closeDetails()">Close</button>
        `;
        detailsDiv.style.display = 'block';
    }

    // Function to close Pokémon details
    window.closeDetails = function() {
        document.getElementById('pokemon-details').style.display = 'none';
    }

    // Function to toggle between catching and releasing a Pokémon
    function toggleCatchRelease(id) {
        if (caughtPokemon.includes(id)) {
            const index = caughtPokemon.indexOf(id);
            if (index > -1) {
                caughtPokemon.splice(index, 1);
            }
        } else {
            caughtPokemon.push(id);
        }
        localStorage.setItem('caughtPokemon', JSON.stringify(caughtPokemon));
        updateCatchReleaseButton(id);
    }

    // Function to update the catch/release button text
    function updateCatchReleaseButton(id) {
        const buttons = document.querySelectorAll('.catch-release');
        buttons.forEach(button => {
            const pokemonId = parseUrl(button.parentElement.querySelector('img').src);
            if (parseInt(pokemonId, 10) === id) {
                button.textContent = caughtPokemon.includes(id) ? 'Release' : 'Catch';
            }
        });
    }

    loadMoreButton.addEventListener('click', () => {
        if (nextUrl) {
            loadPokemon(nextUrl);
        }
    });

    // Initial load for Pokedex
    loadPokemon(nextUrl);

    // Quiz Application Functionality
    const form = document.getElementById('difficulty-form');
    const quizSection = document.getElementById('quiz-questions');
    const resultsSection = document.getElementById('quiz-results');
    const resultsParagraph = document.getElementById('results');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const difficulty = document.getElementById('difficulty').value;
        const questions = await fetchQuestions(difficulty);
        displayQuestions(questions);
    });

    async function fetchQuestions(difficulty) {
        const response = await fetch(`https://opentdb.com/api.php?amount=10&difficulty=${difficulty}`);
        const data = await response.json();
        return data.results;
    }

    function displayQuestions(questions) {
        quizSection.classList.remove('d-none');
        resultsSection.classList.add('d-none');
        quizSection.innerHTML = questions.map((question, index) => `
            <div>
                <h3>${question.question}</h3>
                ${question.incorrect_answers.concat(question.correct_answer).sort().map(answer => `
                    <div>
                        <input type="radio" name="question${index}" value="${answer}">
                        <label>${answer}</label>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Thank you for your message. We will get back to you soon!');
        contactForm.reset();
    });
});
