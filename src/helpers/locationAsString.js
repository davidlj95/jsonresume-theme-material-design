/**
 * Transforms the location object in a JSON resume into a string
 *
 * @param location
 * @return {string}
 */
module.exports = function LocationHelper(location) {
    const address = location.address;
    const city = location.city;
    const postalCode = location.postalCode;
    const region = location.region;
    const countryCode = location.countryCode;

    let locationAsString = "";
    if (address && address.length) locationAsString = `${address}`;
    if (city && city.length) {
        if (locationAsString.length === 0) {
            locationAsString = `${city}`
        } else {
            locationAsString = `${locationAsString}, ${city}`
        }
    }
    if (postalCode && postalCode.length) {
        locationAsString = `${locationAsString} (${postalCode})`
    }
    if (region && region.length) {
        locationAsString = `${locationAsString}, ${region}`
    }
    if (countryCode && countryCode) {
        locationAsString = `${locationAsString}, ${countryCode}`
    }
    return locationAsString;
};
