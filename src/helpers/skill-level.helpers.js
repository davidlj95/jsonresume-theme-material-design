const DEFAULT_STAR_BLACK = "★";
const DEFAULT_STAR_EMPTY = "☆";

const LEVEL_MAP = {
    "beginner": 1,
    "early": 2,
    "competent": 3,
    "advanced": 4,
    "expert": 5,
};

const LEVELS = Array.from(Object.keys(LEVEL_MAP));

function isEmptyLevel(level) {
    return !level || !level.length;
}

function canonizeLevel(level) {
    return level.toLowerCase();
}

function isLevelRecognized(level) {
    return LEVELS.includes(level);
}

function getLevelStars(level) {
    return LEVEL_MAP[level];
}

/**
 * Translates the level string into a sequence of 1-5 filled stars
 * or returns empty if level name is not recognized.
 *
 * To convert, the level names MUST follow this conventions:
 * https://github.com/jsonresume/resume-schema/issues/16#issuecomment-219698224
 *
 * @param level
 */
function skillLevelToStarsHelper(level) {
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

function unknownSkillLevelHelper(level) {
    if (isEmptyLevel(level)) {
        console.warn('Empty level passed');
        return "";
    }
    const levelName = canonizeLevel(level);
    if (!isLevelRecognized(level)) {
       return levelName[0].toUpperCase() + levelName.slice(1);
    }
}

module.exports = {
    skillLevelToStarsHelper,
    unknownSkillLevelHelper,
};


