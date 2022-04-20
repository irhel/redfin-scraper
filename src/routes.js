const Apify = require('apify');

const { selectors } = require('./const');

const { utils: { puppeteer, log } } = Apify;

let totalPropertiesScraped = 0;

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
    log.info('Will deal with property');
    if (totalPropertiesScraped === maxItems) {
        log.info(`Scraped ${maxItems} number of properties. Exiting gracefully.`);
        process.exit();
    } else totalPropertiesScraped++;
    await puppeteer.injectJQuery(page);
    const propertyData = await page.evaluate((price, beds, baths, squareFooatage, addionalInfo) => {
        const extraInfo = $(addionalInfo).map((index, element) => $(element).text()).get();
        return {
            propertyPrice: $(price).text(),
            propertyBeds: $(beds).text(),
            propertyBaths: $(baths).text(),
            propertySquareFootage: $(squareFooatage).text(),
            status: extraInfo[0],
            timeOnRedFin: extraInfo[1],
            propertyType: extraInfo[2],
            hoaDues: extraInfo[3],
            yearBuild: extraInfo[4],
            style: extraInfo[5],
            community: extraInfo[6],
            mls: extraInfo[7],
            listedPrice: extraInfo[8],
            estMoPayment: extraInfo[9],
            redfinEstimate: extraInfo[10],
            pricePerSquareFoot: extraInfo[11],
            buyersAgentCommission: extraInfo[12],
        };
    }, selectors.PROPERTY_PRICE, selectors.PROPERTY_BEDS, selectors.PROPERTY_BATHS,
    selectors.PROPERTY_SQUARE_FOOTAGE, selectors.PROPERTY_ADDITIONAL_INFO);
    log.info('Property data that was extracted:', propertyData);
    await Apify.pushData(propertyData);
};
