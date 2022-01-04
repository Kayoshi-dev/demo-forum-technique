import Head from 'next/head';
import {MantineProvider} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';

export default function App(props) {
    const {Component, pageProps} = props;

    return (
        <>
            <Head>
                <title>Accueil</title>
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
                <NotificationsProvider position="top-right" zIndex={2077}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </NotificationsProvider>
            </MantineProvider>
        </>
    );
}
