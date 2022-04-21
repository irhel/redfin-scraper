const Apify = require('apify');
const { puppeteerErrors } = require('puppeteer');
const { handleStart, handleProperty, handlePropertyListings } = require('./src/routes');

const { utils: { log } } = Apify;

Apify.main(async () => {
    const requestList = await Apify.openRequestList('start-urls', [{ url: 'https://www.redfin.com/' }]);
    const requestQueue = await Apify.openRequestQueue();

    const { location, maxItems } = await Apify.getInput();

    const proxyConfiguration = await Apify.createProxyConfiguration({
        groups: ['RESIDENTIAL'],
        countryCode: 'US',
    });
    const crawler = new Apify.PuppeteerCrawler({
        requestList,
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
        handlePageFunction: async (context) => {
            const { url, userData: { label } } = context.request;

            log.info('Page opened.', { label, url });

            switch (label) {
                case 'PROPERTY':
                    return handleProperty(context, maxItems);
                case 'PROPERTY_LISTINGS':
                    return handlePropertyListings(context, requestQueue);
                default:
                    return handleStart(context, requestQueue, location);
            }
        },
    });

    await crawler.run();
});
