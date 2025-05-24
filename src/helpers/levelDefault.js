const {isEmptyLevel, canonizeLevel, isLevelRecognized} = require("./utils/levels");

/**
 * Returns the level title-cased if cannot be translated to stars
 *
 * @param level
 * @returns {string}
 */
module.exports = function levelDefaultHelper(level) {
    if (isEmptyLevel(level)) {
        console.warn('Empty level passed');
        return "";
    }
    const levelName = canonizeLevel(level);
    if (!isLevelRecognized(levelName)) {
       return levelName[0].toUpperCase() + levelName.slice(1);
    }
    return "";
}
