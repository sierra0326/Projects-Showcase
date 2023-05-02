const cardSearchForm = document.querySelector('#card-search-form');
const searchResultsDiv = document.querySelector('#search-results');
const loader = document.createElement('div');
loader.id = 'loader';
loader.innerHTML = `<img src="https://i.ibb.co/9N4GTSr/giphy.gif" alt="Loading...">`;
document.body.appendChild(loader);

// Function to handle card image click event
const handleCardImageClick = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.closest('.card').classList.toggle('card--expanded');
};

// Function to handle card image touch end event
const handleCardImageTouchEnd = (event) => {
  event.preventDefault();
  event.currentTarget.closest('.card').classList.toggle('card--expanded');
};

cardSearchForm.addEventListener('submit', event => {
  event.preventDefault();
  const searchQuery = document.querySelector('#search-input').value;
  showLoader();
  fetch(`https://api.pokemontcg.io/v2/cards?q=name:${searchQuery}*&orderBy=-set.releaseDate`)
    .then(response => response.json())
    .then(data => {
      hideLoader();
      if (data.data.length === 0) {
        searchResultsDiv.innerHTML = `<p>No cards found with name "${searchQuery}"</p>`;
      } else {
        searchResultsDiv.innerHTML = '';
        data.data.forEach(card => {
          const cardDiv = document.createElement('div');
          cardDiv.classList.add('card');
          cardDiv.innerHTML = `
            <div class="card-overlay">
              <img src="${card.images.large}" alt="${card.name}">
            </div>
            <h3>${card.name}</h3>
            <p><strong>Set Name:</strong> ${card.set.name}</p>
            <p><strong>Rarity:</strong> ${card.rarity}</p>
            <p><strong>Card Number:</strong> ${card.number}</p>
            <p><strong>Artist:</strong> ${card.artist}</p>
          `;
          searchResultsDiv.appendChild(cardDiv);

          // Add click event listener to card image
          const cardImage = cardDiv.querySelector('.card-overlay img');
          cardImage.addEventListener('click', handleCardImageClick);

          // Add touch end event listener to card image
          cardImage.addEventListener('touchend', handleCardImageTouchEnd);
        });
      }
    })
    .catch(error => {
      hideLoader();
      console.error(error)
    });
});

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}
