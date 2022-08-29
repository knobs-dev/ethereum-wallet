require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = parseInt(process.env['REACT_APP_FAUCET_PORT']);

app.use(express.json());
app.use(
    cors({
        origin: 'bis-hub.knobs.it',
        optionsSuccessStatus: 200,
    }),
);

const { ethers } = require('ethers');
const mnemonic = process.env['WALLET_MNEMONIC'];
const providerType = process.env['REACT_APP_PROVIDER_TYPE'];
const infuraApiKey = process.env['REACT_APP_INFURA_API_KEY'];
const network = process.env['REACT_APP_NETWORK'];

// function getProvider(providerType, data = {}) {
//     switch (providerType) {
//         case 'infura':
//             return new ethers.providers.InfuraProvider(network, infuraApiKey);
//         case 'http':
//             return null;
//         default:
//             return ethers.getDefaultProvider(data.network);
//     }
// }

const wallet = ethers.Wallet.fromMnemonic(mnemonic);
// const account = wallet.connect(provider);

console.log('PROVIDER:', providerType);
providerType === 'infura' && console.log('INFURA_API_KEY:', infuraApiKey);
console.log('NETWORK:', network);

app.post('/givemeeth', async (req, res) => {
    const amount = ethers.utils.parseEther('0.1');

    const { to } = req.body;

    if (to) {
        const tx = {
            to: req.body.to,
            value: amount,
        };

        console.log(tx);

        // const result = { hash: 'hash' };

        const result = await account.sendTransaction(tx);

        res.status(200).json({ status: 'OK', hash: result.hash });
    } else {
        res.status(400).json({
            status: 'FAIL',
            error: 'To is a required field',
        });
    }
});

app.listen(port, () => {
    console.log(`Faucet is listening on port ${port}`);
});
