# Multichain Crosschain

## Development

### Add Non Approve List 

- Create new file named `nonApproveList.json` in `src/components/NonApprove` folder
- Manually populate with 
```
{}
```
### Configuring the environment 

- Copy env file to create a local env

`cp .env.production .env.local `

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"` 

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

