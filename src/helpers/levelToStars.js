const {isEmptyLevel, canonizeLevel, isLevelRecognized, DEFAULT_STAR_EMPTY, DEFAULT_STAR_BLACK, LEVEL_MAP} = require("./utils/levels");

function getLevelStars(level) {
    return LEVEL_MAP[level];
}

/**
 * Translates the level string into a sequence of 1-5 filled stars
 * or returns empty if level name is not recognized.
 *
 * To convert, the level names MUST follow this conventions:
 * https://github.com/jsonresume/resume-schema/issues/16#issuecomment-219698224
 * Or a language fluency level (fluent, native)
 *
 * @param level
 */
module.exports = function levelToStarsHelper(level) {
    if (isEmptyLevel(level)) {
        console.warn('Empty level passed');
        return "";
    }
    const levelName = canonizeLevel(level);
    if (isLevelRecognized(levelName)) {
        const stars = getLevelStars(levelName);
        return DEFAULT_STAR_BLACK.repeat(stars) + DEFAULT_STAR_EMPTY.repeat(5 - stars);
    } else {
        console.warn(`Level ${levelName} not recognized`);
        return "";
    }
}
