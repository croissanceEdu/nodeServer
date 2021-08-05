let validationHelperContent = require('../json/validation-helper.json');
let dbErrorHandlingHelperContent = require('../json/db-error-handling-helper.json');

let Api = {
    getValidationHelperContent(language = 'English') {
        return validationHelperContent.filter(obj => obj.language === language)[0];
    },
    getDbErrorHandlingHelperContent(language = 'English') {
        return dbErrorHandlingHelperContent.filter(obj => obj.language === language)[0];
    },
}

module.exports = Api;