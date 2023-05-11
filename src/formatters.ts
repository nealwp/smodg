/** 
* Convert a string to snake_case
* */
const snakeCase = (str: string) => {
    return str.replace(/[A-Z]/g, (match, index) => {
        if (index === 0) {
            return match.toLowerCase();
        } else if (/[A-Z]/.test(str[index - 1])) {
            return match.toLowerCase();
        } else {
            return `_${match.toLowerCase()}`;
        }
    });
}

/**
* Convert a string to kebab-case
*/
const kebabCase = (str: string) => {
    return str.replace(/[A-Z]/g, (match, index) => {
        if (index === 0) {
            return match.toLowerCase();
        } else if (/[A-Z]/.test(str[index - 1])) {
            return match.toLowerCase();
        } else {
            return `-${match.toLowerCase()}`;
        }
    });
}

export { snakeCase, kebabCase }
