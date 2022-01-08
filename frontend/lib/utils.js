/**
 * Return the GraphQL API URL
 * @returns {string|*}
 */
export function getApiUrl() {
    return process.env.NODE_ENV === "production" ? "https://demo-ft-strapi.herokuapp.com/graphql" : process.env.NEXT_PUBLIC_API_URL;
}

export function getEnvUrl() {
    return process.env.NODE_ENV === "production" ? "https://demo-ft-strapi.herokuapp.com" : "http://localhost:1337"
}
