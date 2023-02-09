const BASE_URL = 'https://restcountries.com/v3.1/'
const SEARCH_PARAMS = 'fields=name,capital,population,flags,languages';

export function fetchCountries(name){
    return fetch(`${BASE_URL}name/${name}?${SEARCH_PARAMS}`).then(response => {
        if (!response.ok) {
            throw new Error('Oops, there is no country with that name');
    }
        return response.json();
    });
}