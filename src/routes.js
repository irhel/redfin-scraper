const { AutoscaledPool } = require('apify');
const Apify = require('apify');

const { selectors } = require('./const');

const { utils: { puppeteer, log } } = Apify;

let totalPropertiesScraped = 0;

const createAbsoluteUrl = (relativeUrl) => {
    return `https://www.redfin.com${relativeUrl}`;
};
const addUrlsToRequestQueue = async (urls, label, requestQueue) => {
    for (const url of urls) {
        await requestQueue.addRequest({
            url,
            userData: { label },
        });
    }
};
exports.handleStart = async ({ page }, requestQueue, location) => {
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

exports.handlePropertyListings = async ({ page }, requestQueue) => {
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

exports.handleProperty = async ({ page }, maxItems) => {
    if (totalPropertiesScraped === maxItems && maxItems !== 0) {
        log.info(`Scraped ${maxItems} number of properties. Exiting gracefully.`);
        await AutoscaledPool.abort();
    }
    await puppeteer.injectJQuery(page);
    const propertyData = (await page.evaluate((price, beds, baths, squareFooatage, addionalInfoHeaders, additionalInfoContent) => {
        const extraInfoHeaders = $(addionalInfoHeaders).map((index, element) => $(element).text()).get();
        const extraInfoContent = $(additionalInfoContent).map((index, element) => $(element).text()).get();
        const preparedPropertyData = {
            propertyPrice: $(price).text(),
            propertyBeds: $(beds).text(),
            propertyBaths: $(baths).text(),
            propertySquareFootage: $(squareFooatage).text(),
        };
        for (let i = 0; i < extraInfoHeaders.length; i++) {
            preparedPropertyData[[extraInfoHeaders[i]]] = extraInfoContent[i];
        }
        return preparedPropertyData;
    }, selectors.PROPERTY_PRICE, selectors.PROPERTY_BEDS, selectors.PROPERTY_BATHS,
    selectors.PROPERTY_SQUARE_FOOTAGE, selectors.PROPERTY_ADDITIONAL_INFO_HEADERS, selectors.PROPERTY_ADDITIONAL_INFO_CONTENT));
    // Ignore empty lots

    await Apify.pushData(propertyData);
    log.info('Property data that was extracted:', propertyData);
    totalPropertiesScraped++;
};
