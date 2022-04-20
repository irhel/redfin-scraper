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


### Output

The output of the Actor is a JSON object that will get stored in the default dataset. Each object contains information about the scraped property, for example:

```
{
  "propertyPrice": "$689,900",
  "propertyBeds": "4",
  "propertyBaths": "2.5",
  "propertySquareFootage": "2,000",
  "status": "Active",
  "timeOnRedFin": "33 hours",
  "propertyType": "Townhouse",
  "hoaDues": "1920",
  "yearBuild": "1915",
  "style": "FAIRMOUNT",
  "community": "Newtown",
  "mls": "PAPH2105402",
  "listedPrice": "$689,900",
  "estMoPayment": "$3,807",
  "redfinEstimate": "$688,944",
  "pricePerSquareFoot": "$345",
  "buyersAgentCommission": "2.5%"
}
```

### Compute units consumption

On average the actor will consume 1CU for 1,000 properties.
