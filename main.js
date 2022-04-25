const Apify = require('apify');

const { handleStart, handleProperty, handlePropertyListings } = require('./src/routes');

const { utils: { log } } = Apify;

Apify.main(async () => {
    const requestList = await Apify.openRequestList('start-urls', [{ url: 'https://www.redfin.com/' }]);

    const requestQueue = await Apify.openRequestQueue();

    const { proxyConfig, location, maxItems, category } = await Apify.getInput();

    const proxyConfiguration = await Apify.createProxyConfiguration(proxyConfig);

    const crawler = new Apify.PuppeteerCrawler({
        requestList,
        maxRequestRetries: 10,
        requestQueue,
        proxyConfiguration,
        useSessionPool: true,
        sessionPoolOptions: {
            maxPoolSize: 100,
        },
        launchContext: {
            launchOptions: {
                headless: false,
            },
        },
        preNavigationHooks: [async ({ page }, gotoOptions) => {
            gotoOptions.waitUntil = 'networkidle2';
            gotoOptions.timeout = 60000;

            await page.setBypassCSP(true);
        }],
        handlePageFunction: async (context) => {
            const { url, userData: { label } } = context.request;

            log.info('Page opened.', { label, url });

            switch (label) {
                case 'PROPERTY':
                    return handleProperty(context, { maxItems });
                case 'PROPERTY_LISTINGS':
                    return handlePropertyListings(context, requestQueue);
                default:
                    return handleStart(context, requestQueue, { location, category });
            }
        },
    });

    await crawler.run();
});
