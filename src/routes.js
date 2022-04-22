const Apify = require('apify');

const { selectors } = require('./const');

const { utils: { log, puppeteer } } = Apify;
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
/**
 * Wait for the search box to be available and then inserts the location and extracts the pagination URLs.
 *
 * @param {Apify.PuppeteerHandlePageFunctionParam} param0
 * @param {Apify.RequestQueue} requestQueue
 * @param {string} location
 */
exports.handleStart = async ({ page }, requestQueue, location) => {
    await page.waitForSelector(`${selectors.INPUT_BOX}:not([disabled])`, { timeout: 60000 });
    await page.type(selectors.INPUT_BOX, location);
    await page.waitForSelector(selectors.SEARCH_BUTTON, { timeout: 60000 });
    await Promise.all([
        page.waitForNavigation({ timeout: 60000 }),
        page.click('button.SearchButton'),
    ]);
    await puppeteer.injectJQuery(page);

    await page.waitForSelector('.goToPage');
    await page.waitForFunction(() => !!window.jQuery);
    const paginationUrls = (await page.evaluate((selector) => {
        return $(selector).map((index, element) => $(element).attr('href')).get();
    }, selectors.PROPERTY_LISTING));

    log.info(`Number of pagination URLs that will be added ${paginationUrls.length}`);
    await addUrlsToRequestQueue(paginationUrls.map(createAbsoluteUrl), 'PROPERTY_LISTINGS', requestQueue);
};

exports.handlePropertyListings = async ({ page }, requestQueue) => {
    await page.waitForSelector('.HomeViews');
    await puppeteer.injectJQuery(page);
    const propertyUrls = (await page.evaluate((selector) => {
        return $(selector).map((index, element) => $(element).attr('href')).get();
    }, selectors.PROPERTY)).map(createAbsoluteUrl);

    log.info(`Number of property URLs that will be added ${propertyUrls.length}`);

    await addUrlsToRequestQueue(propertyUrls, 'PROPERTY', requestQueue);
};

/**
 *
 * @param {Apify.PuppeteerHandlePageFunctionParam} param0
 * @param {number} maxItems
 * @returns
 */
exports.handleProperty = async ({ page, crawler }, maxItems) => {
    if (totalPropertiesScraped === maxItems && maxItems !== 0) {
        log.info(`Scraped ${maxItems} number of properties. Exiting gracefully.`);
        await crawler.autoscaledPool.abort();
        return;
    }
    await puppeteer.injectJQuery(page);
    const propertyData = await page.evaluate(({ PROPERTY_PRICE, PROPERTY_BEDS, PROPERTY_BATHS, PROPERTY_SQUARE_FOOTAGE,
        PROPERTY_ADDITIONAL_INFO_HEADERS, PROPERTY_ADDITIONAL_INFO_CONTENT }) => {
        const fnText = (_, element) => $(element).text();

        const extraInfoHeaders = $(PROPERTY_ADDITIONAL_INFO_HEADERS).map(fnText).get();
        const extraInfoContent = $(PROPERTY_ADDITIONAL_INFO_CONTENT).map(fnText).get();

        const preparedPropertyData = {
            propertyPrice: $(PROPERTY_PRICE).text(),
            propertyBeds: $(PROPERTY_BEDS).text(),
            propertyBaths: $(PROPERTY_BATHS).text(),
            propertySquareFootage: $(PROPERTY_SQUARE_FOOTAGE).text(),
        };
        for (const [i, header] of extraInfoHeaders.entries()) {
            preparedPropertyData[header] = extraInfoContent[i];
        }
        return preparedPropertyData;
    }, selectors);

    await Apify.pushData(propertyData);
    log.info('Property data that was extracted:', propertyData);
    totalPropertiesScraped++;
};
