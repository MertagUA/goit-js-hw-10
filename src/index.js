import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.getElementById('search-box'),
    countriesList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

const {input, countriesList, countryInfo} = refs;

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
    const inputValue = input.value.trim();

    if (inputValue === '') {
        cleanMarkups();
        return;
    }

    fetchCountries(inputValue).then(onFetchSucces).catch(onFetchError);
}

function onFetchSucces(countries) {
    cleanMarkups();
    if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    }

    if (countries.length >= 2 && countries.length <= 10) {
        markupIntoInterface(countriesList, countryListMarkup(countries));
        return;
    }
    markupIntoInterface(countryInfo, countryInfoMarkup(countries));
    return;
}

function cleanMarkups() {
    countriesList.innerHTML = '';
    countryInfo.innerHTML = '';
}

function countryInfoMarkup(country) {
    return country.map(({ name: {official}, capital, population, flags: { svg }, languages } = {}) => {
        const languagesOfCountry = Object.values(languages).join(',');
        return `<div class="country-wrap">
    <img src=${svg} alt="${official} flag" width="35px" height="30px">
<h1 class="country-title">${official}</h1>
    </div>
    <p><span class="country-span">Capital:</span>${capital}</p>
    <p><span class="country-span">Population:</span>${population}</p>
    <p><span class="country-span">Languages:</span>${languagesOfCountry}</p>
    `
    }).join('');
}

function countryListMarkup(countries) {
    return countries.map(({name: {official}, flags: {svg}} = {}) => {
        return `<li class="country-item">
        <img src=${svg} alt="${official} flag" width="35px" height="30px">
<p class="country-name">${official}</p>
</li>`
    }).join('');
}

function markupIntoInterface(place, markup) {
    place.innerHTML = `${markup}`;
}
function onFetchError() {
    cleanMarkups();
    Notify.failure('Oops, there is no country with that name');
}