/**
 * @return {string}
 */
module.exports = function AppTitleHelper(resume) {
    if(resume && resume.basics && resume.basics.name && resume.basics.name.length) {
       const name = resume.basics.name;
       const firstName = name.split(' ')[0];
       return `${firstName}'s resume`;
    }
    return "Resume";
};
