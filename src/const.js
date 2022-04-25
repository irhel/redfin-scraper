const selectors = {
    INPUT_BOX: 'input#search-box-input.search-input-box',
    SEARCH_BUTTON: 'button.SearchButton',
    PROPERTY: '.bottomV2 a',

    PROPERTY_PRICE: 'div[data-rf-test-id="abp-price"] .statsValue',
    PROPERTY_BEDS: 'div[data-rf-test-id="abp-beds"] .statsValue',
    PROPERTY_BATHS: 'div[data-rf-test-id="abp-baths"] .statsValue',
    PROPERTY_SQUARE_FOOTAGE: 'div[data-rf-test-id="abp-sqFt"] .statsValue',
    PROPERTY_ADDITIONAL_INFO_HEADERS: '.house-info .keyDetail .header',
    PROPERTY_ADDITIONAL_INFO_CONTENT: '.house-info .keyDetail .content',
    PROPERTY_LISTING: 'a.goToPage',
    RENT_TAB: '.Tab a[data-rf-test-name="rentTab"]',
    PROPERTY_IMAGE: '.InlinePhotoPreview img',
};

module.exports = { selectors };
