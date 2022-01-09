/**
 * Return the GraphQL API URL
 * @returns {string|*}
 */
export function getApiUrl() {
    return process.env.NODE_ENV === "production" ? "https://demo-ft-strapi.herokuapp.com/graphql" : process.env.NEXT_PUBLIC_API_URL;
}

/**
 * Return the current domain in development or an empty string if in production
 * @returns {string}
 */
export function getEnvUrl() {
    return process.env.NODE_ENV === "production" ? "" : "http://localhost:1337"
}

/**
 * Code golf here I come
 * Get a string of content in parameter, remove titles from it and return the first string of the content
 * @param content
 * @returns {*}
 */
export const getDescription = content => content.split(/\r?\n/).filter(arr => arr).filter(el => !el.startsWith('#')).slice(0, 1).toString();
