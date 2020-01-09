const request = require('sync-request');

// https://www.iconfinder.com/icons/628287/anonym_avatar_default_head_person_unknown_user_icon
// Compressed with https://compressor.io
const DEFAULT_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAg" +
    "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" +
    "BMCB/AIWiIEZwqX3ewAAAABJRU5ErkJggg==";

function getType(name) {
   if(name.endsWith('.png')) return 'image/png';
   if(name.endsWith('.svg')) return 'image/svg+xml';
   if(name.endsWith('.jpg')) return 'image/jpg';
   if(name.endsWith('.jpeg')) return 'image/jpeg';
}

/**
 * Fetches the image and returns its data URI equivalent
 *
 * If the image is already a data URI, returns the image
 *
 * @param image
 * @return {string}
 */
module.exports = function PreloadImageHelper(image) {
    if (image.startsWith('data:image')) return image;
    const response = request('GET', image, {
        cache: 'file'
    });
    if (response.statusCode !== 200) {
        console.warn(`Image could not be fetched: ${response.statusCode}`);
        return DEFAULT_IMAGE;
    }
    const contentType = response.headers['content-type'] || getType(image);
    if (!contentType) {
        console.warn('Image response has no content type');
        return DEFAULT_IMAGE;
    }
    const base64 = response.getBody().toString('base64');
    return `data:${contentType};base64,${base64}`;
};
