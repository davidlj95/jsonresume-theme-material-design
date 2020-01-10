const Handlebars = require('handlebars');
const fontawesome = require(`@fortawesome/fontawesome-svg-core`);

function fixIconName(name) {
    let fixedName = name;

    // Capitalize first char
    fixedName = fixedName.charAt(0).toUpperCase() + fixedName.slice(1);

    // Add fa prefix
    if (!fixedName.startsWith('fa')) fixedName = 'fa' + fixedName;

    return fixedName;
}

/**
 * @return {Handlebars.SafeString}
 */
module.exports = function FontawesomeHelper(iconType, iconName) {
    if (iconName.length === 0) {
        console.warn("Icon name is empty")
    }
    const fixedIconName = fixIconName(iconName);
    let icons;
    if (iconType === "fab") {
        icons = require(`@fortawesome/free-brands-svg-icons`);
    } else if (iconType === "fa") {
        icons = require(`@fortawesome/free-solid-svg-icons`);
    } else {
        console.warn(`Unknown icon type ${iconType}`);
        return "";
    }
    if (!Object.keys(icons).includes(fixedIconName)) {
        console.warn(`Icon not found: ${fixedIconName}`);
        return "";
    }
    const icon = icons[fixedIconName];
    return new Handlebars.SafeString(fontawesome.icon(icon).html);
};
