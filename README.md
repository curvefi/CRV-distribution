# CRV Distribution Subgraph

### Subgraph to get Curve transfer events and virtual prices needed for calculating historical CRV Distribution data

[CRV distribution subgraph](https://thegraph.com/explorer/subgraph/pengiundev/crv-distribution)

#### All transfers query:

```sql
	query getTransfers($first: Int!, $skip: Int!) {
		  transferEvents(orderBy: block, orderDirection: asc, first: $first, skip: $skip) {
		    id
		    block
		    timestamp
		    transfers(orderBy: logIndex, orderDirection: asc) {
		      id
		      logIndex
		      from
		      to
		      value
		      address
		    }
		  }
	}
```

#### All virtual prices query

```sql
	query getVirtualPrices($first: Int!, $skip: Int!) {
		virtualPrices(orderBy: block, orderDirection: asc, first: $first, skip: $skip) {
		    id
		    address
		    block
		    timestamp
		    virtualPrice
	  	}
	}
```