const Handlebars = require('handlebars');
const fontawesome = require(`@fortawesome/fontawesome-svg-core`);

function isValidIconName(name) {
    return name.match(/fa[\w\-]+/)
}

/**
 * @return {string}
 */
module.exports = function FontawesomeHelper(iconType, iconName) {

    if(!isValidIconName(iconName)) {
       console.warn(`Invalid icon name: '${iconName}'`);
       return "";
    }

    if(iconType === "fab") {
        const icons = require(`@fortawesome/free-brands-svg-icons`);
        if(!Object.keys(icons).includes(iconName)) {
           console.warn(`Icon not found: ${iconName}`);
           return "";
        }
        const icon = icons[iconName];
        return new Handlebars.SafeString(fontawesome.icon(icon).html);
    } else {
        console.warn(`Unknown icon type ${iconType}`);
        return "";
    }
};
