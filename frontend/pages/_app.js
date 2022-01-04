import Head from 'next/head';
import {MantineProvider} from '@mantine/core';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';

export default function App(props) {
    const {Component, pageProps} = props;

    return (
        <>
            <Head>
                <title>Page title</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
                <meta name="description" content="Un simple blog permettant de montrer l'efficacité de la JamStack !" />
            </Head>

            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: 'light',
                    fontFamily: 'Poppins, sans-serif',
                    headings: { fontFamily: 'Poppins, sans-serif' },
                }}
            >
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </MantineProvider>
        </>
    );
}
