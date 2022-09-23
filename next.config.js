/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    webpack: ( config ) => {
        config.experiments = { topLevelAwait: true, layers: true };
        return config;
    },
    publicRuntimeConfig: {
        api_host: process.env.API_HOST
    },
    serverRuntimeConfig: {
        api_host: process.env.API_HOST
    }
}
