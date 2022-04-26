## What does the RedFin Scraper do?

[Redfin Scraper](https://apify.com/irhel/redfin-scraper) scrapes real-estate data from [Redfin](https://www.redfin.com/).

Some of the property information that it scrapes:

* Price of the property
* Number of bedrooms and bathrooms
* Image of the property
* Square footage
* Buyer's agent comission
* Property type

## Why scrape Redfin?

[Redfin](https://www.redfin.com/) has 50M average monthly users and is one of the key players in the real-estate market with an approximate revenue of 1B for 2020.

Some of the use-cases for scraping real-estate data are:

- Allowing real-estate agents to understand the market better

- Minimization of risk when pricing properties 


- Market forecast

- Targeted real-estate ads for a specific geographical location

If you would like more inspiration on how scraping [Redfin](https://www.redfin.com/) could help your business or organization, check out our [industry pages](https://apify.com/industries).



## How to scrape Redfin?

To scrape Redfin wtih the [Redfin scraper](https://apify.com/irhel/redfin-scraper) follow the steps:

1. Click on Try for free
2. Enter a city, address, school or ZipCode as the `location` for the real-estate that you want to scrape, optionally insert the following fields:
 	- `maxItems` as a number to limit the number of results
 	- `category` from the dropdown to choose between scraping properties `forSale` or `forRent`
 	- `proxyConfig` as an object to choose the proxy configuration for the run.
3. Click on Run
4. When the [Redfin scraper](https://apify.com/irhel/redfin-scraper) has finished preview or download your data from the Dataset tab.



### How much will it cost to scrape Redfin?

Apify provides `5$/month` free platform credits the Apify Free plan. That's roughly `1250` scraped properties for free per month. However, if you need to regularly scrape more results Apify has other [subcription plans](https://apify.com/pricing) as well. We recommend the Personal Plan for a cost of `49$/month` with which you can scrape roughly `12,500` properties per month.

If your scraping needs are even greater you can get the Apify Team Plan to scrape roughly `125K` properties per month. 

### Tips for scraping Redfin

Try to provide the `location` precisely. For example, instead of just `Trenton` write `Trenton NJ` to correctly distinguish it from `Trenton TX`. 

### Results

Example of a result from running the scraper:

```json
{
  "propertyPrice": "$665,000",
  "propertyBeds": "3",
  "propertyBaths": "2.5",
  "propertySquareFootage": "2,169",
  "propertyImageUrl": "https://ssl.cdn-redfin.com/photo/235/bigphoto/194/PAPH2108194_0.jpg",
  "Status": "Contingent",
  "Time on Redfin": "7 days",
  "Property Type": "Townhouse",
  "HOA Dues": "$37/month",
  "Year Built": "2017",
  "Style": "Straight Thru",
  "Community": "OLDE KENSINGTON",
  "Lot Size": "1,821 Sq. Ft.",
  "MLS#": "PAPH2104404",
  "Est. Mo. Payment": "$3,321",
  "Price/Sq.Ft.": "$307",
  "Buyer's Agent Commission": "2.5%"
}
```



## Is it legal to scrape [RedFin](https://blog.apify.com/is-web-scraping-legal/)?
Note that personal data is protected by GDPR in the European Union and by other regulations around the world. You should not scrape personal data unless you have a legitimate reason to do so. If you're unsure whether your reason is legitimate, consult your lawyers. We also recommend that you read our blog post: [is web scraping legal?](https://blog.apify.com/is-web-scraping-legal/)
