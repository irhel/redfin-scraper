# Redfin Scraper

Apify Actor that scrapes [Redfin](https://www.redfin.com/) for real-estate. 

- [Input](#input)
- [Output](#output)
- [Compute units consumption](#compute-units-consumption)


### Input 
| Field | Type | Description | Default value
| ----- | ---- | ----------- | -------------|
| maxItems | number | Maximum number of property pages to be scraped.| 0 - all property pages|
| location | string | Refers to geographical location - can be either city, school, agent or ZipCode. | Philadelphia |
| proxyConfig | object | Proxy configuration for the run. Best to be left with the default settings. | `{"useApifyProxy": true, "apifyProxyGroups": ["SHADER"], "countryCode": "US"}` |
| category | string | Category of real-estate to be scraped - either `forRent` or `forSale` | `{"category": "forSale"}`

### Output

The output of the Actor is a JSON object that will get stored in the default dataset. Each object contains information about the scraped property, for example:

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

### Compute units consumption

On average the actor will consume 4CU for approximately 250 properties.
