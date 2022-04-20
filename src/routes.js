const Apify = require('apify');

const { selectors } = require('./const');

const { utils: { puppeteer, log } } = Apify;

const createAbsoluteUrl = (relativeUrl) => {
    return `https://www.redfin.com/${relativeUrl}`;
};
const addUrlsToRequestQueue = async (urls, label, requestQueue) => {
    for (const url of urls) {
        await requestQueue.addRequest({
            url,
            userData: { label },
        });
    }
};
exports.handleStart = async ({ request, page }, requestQueue, location) => {
    log.info('On the starting page');
    try {
        await page.type(selectors.INPUT_BOX, location);
        await page.click(selectors.SEARCH_BUTTON);
        await page.waitForSelector('.goToPage');
        await puppeteer.injectJQuery(page);

        const paginationUrls = (await page.evaluate((selector) => {
            return $(selector).map((index, element) => $(element).attr('href')).get();
        }, selectors.PROPERTY_LISTING)).map((relativePaginationUrl) => createAbsoluteUrl(relativePaginationUrl));
        log.info(`Number of pagination URLs that will be added ${paginationUrls.length}`);

        await addUrlsToRequestQueue(paginationUrls, 'PROPERTY_LISTINGS', requestQueue);
    } catch (error) {
        log.info(`Error: ${error}`);
    }
};

exports.handlePropertyListings = async ({ request, page }, requestQueue) => {
    try {
        await page.waitForSelector('.HomeViews');
        await puppeteer.injectJQuery(page);
        const propertyUrls = (await page.evaluate((selector) => {
            return $(selector).map((index, element) => $(element).attr('href')).get();
        }, selectors.PROPERTY)).map((relativePropertyUrl) => createAbsoluteUrl(relativePropertyUrl));
        log.info(`Number of property URLs that will be added ${propertyUrls.length}`);
        await addUrlsToRequestQueue(propertyUrls, 'PROPERTY', requestQueue);
    } catch (error) {
        log.info(`Error: ${error}`);
    }
};

exports.handleProperty = async ({ request, page }) => {
    log.info('Will deal with property');
    await puppeteer.injectJQuery(page);
    const propertyData = await page.evaluate((price, beds, baths, squareFooatage) => {
        return {
            propertyPrice: $(price).text(),
            propertyBeds: $(beds).text(),
            propertyBaths: $(baths).text(),
            propertySquareFootage: $(squareFooatage).text(),
        };
    }, selectors.PROPERTY_PRICE, selectors.PROPERTY_BEDS, selectors.PROPERTY_BATHS, selectors.PROPERTY_SQUARE_FOOTAGE);
    log.info('Property data that was extracted:', propertyData);
    await Apify.pushData(propertyData);
};
