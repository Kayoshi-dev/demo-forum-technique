import { ApolloClient, InMemoryCache } from "@apollo/client";
import {getApiUrl} from "./lib/utils";

const client = new ApolloClient({
    uri: getApiUrl(),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache'
        }
    }
});

export default client;
