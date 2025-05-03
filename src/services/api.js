const BASE_URL = 'https://restcountries.com/v3.1';

//Get All the Countries
export async function getAllCountries() {
  const response = await fetch(`${BASE_URL}/all`);
  if (!response.ok) throw new Error('Failed to fetch countries');
  return response.json();
}

//Get the Countries By name
export async function getCountryByName(name) {
  const response = await fetch(`${BASE_URL}/name/${name}`);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error('Failed to fetch country');
  }
  return response.json();
}

//Get the Countries By Region
export async function getCountriesByRegion(region) {
  const response = await fetch(`${BASE_URL}/region/${region}`);
  if (!response.ok) throw new Error('Failed to fetch countries by region');
  return response.json();
}

//Get the Countries By Code
export async function getCountryByCode(code) {
  const response = await fetch(`${BASE_URL}/alpha/${code}`);
  if (!response.ok) throw new Error('Failed to fetch country details');
  return response.json();
}