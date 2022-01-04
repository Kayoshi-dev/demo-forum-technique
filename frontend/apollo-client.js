import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL,
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache'
        }
    }
});

export default client;
