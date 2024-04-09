document.addEventListener('DOMContentLoaded', () => {
    const url = 'https://api-colombia.com/api/v1/President';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const presidents = data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            generateCards(presidents);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function generateCards(array) {
        const cardContainer = document.getElementById('cards');
        cardContainer.innerHTML = '';

        array.forEach(president => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.name = president.name;
            card.dataset.lastName = president.lastName;
            card.dataset.image = president.image;
            card.dataset.description = president.description;
            card.dataset.period = `${president.startPeriodDate} - ${president.endPeriodDate}`;
            card.dataset.party = president.politicalParty;
            if (typeof president.image === 'string' && president.image.trim() !== '') {
                const image = document.createElement('img');
                image.onerror = () => {
                    image.src = './images/imagen_no_disponible.jpg';
                };
                image.src = president.image;
                card.dataset.image = president.image; 
                card.appendChild(image);
            } else {
                card.dataset.image = './images/imagen_no_disponible.jpg';
                const image = document.createElement('img');
                image.src = './images/imagen_no_disponible.jpg';
                card.appendChild(image);
            }
            const image = document.createElement('img');
            image.src = card.dataset.image;
            card.appendChild(image);

            const overlay = document.createElement('div');
            overlay.classList.add('card-overlay');
            overlay.textContent = 'Haz click para más información';
            card.appendChild(overlay);

            fetch(`https://api-colombia.com/api/v1/City/${president.cityId}`)
                .then(response => response.json())
                .then(cityData => {
                    card.dataset.city = cityData.name;

                    card.addEventListener('click', () => {
                        displayModal(president, cityData);
                    });

                    cardContainer.appendChild(card);
                })
                .catch(error => {
                    console.error('Error fetching city data:', error);
                });
        });
    }

    function displayModal(president, cityData) {
        const modal = document.getElementById('myModal');
        const modalName = document.getElementById('modal-president-name');
        const modalImage = document.getElementById('modal-president-image');
        const modalDescription = document.getElementById('modal-president-description');
        const modalCity = document.getElementById('modal-city');
        const modalPeriod = document.getElementById('modal-president-period');
        const modalParty = document.getElementById('modal-president-party');

        modalName.textContent = `${president.name.toUpperCase()} ${president.lastName.toUpperCase()}`;
        modalImage.src = president.image || './images/Imagen_no_disponible.svg'
        
        modalDescription.textContent = president.description;
        modalCity.textContent = `Ciudad: ${cityData.name}`;
        modalPeriod.textContent = `Periodo: ${president.startPeriodDate} - ${president.endPeriodDate}`;
        modalParty.textContent = `Partido Político: ${president.politicalParty}`;
        if (typeof president.image === 'string' && president.image.trim() !== '') {
            modalImage.src = president.image;
            modalImage.onerror = () => {
                modalImage.src = './images/imagen_no_disponible.jpg';
            };
        } else {
            modalImage.src = './images/imagen_no_disponible.jpg';
        }
    
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        const modal = document.getElementById('myModal');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open'); 
    }
    
    const closeModalButton = document.querySelector('.close');
    closeModalButton.addEventListener('click', () => {
        closeModal();
    });
    
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('myModal');
        if (event.target === modal) {
            closeModal();
        }
    });
    });
