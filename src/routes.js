const Apify = require('apify');

const { utils: { log } } = Apify;

exports.handleStart = async ({ request, page }) => {
    try {
        await page.type('input#search-box-input.search-input-box', 'Philadelphia');
        await page.click('button.SearchButton');
    } catch (error) {
        log.info('Error has occured:', error);
    }
};

exports.handleList = async ({ request, page }) => {
    // Handle pagination
};

exports.handleDetail = async ({ request, page }) => {
    // Handle details
};
