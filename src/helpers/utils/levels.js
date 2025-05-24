export const DEFAULT_STAR_BLACK = "★";
export const DEFAULT_STAR_EMPTY = "☆";

export const LEVEL_MAP = {
    "beginner": 1,
    "early": 2,
    "competent": 3,
    "fluent": 3,
    "advanced": 4,
    "expert": 5,
    "native": 5,
};

export const LEVELS = Array.from(Object.keys(LEVEL_MAP));

export function isEmptyLevel(level) {
    return !level || !level.length;
}

export function canonizeLevel(level) {
    return level.toLowerCase();
}

export function isLevelRecognized(level) {
    return LEVELS.includes(level);
}


