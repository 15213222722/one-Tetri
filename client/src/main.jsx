import React from 'react';
import ReactDOM from 'react-dom/client';
import { SuiClientProvider, WalletProvider } from '@onelabs/dapp-kit';
import { getFullnodeUrl } from '@onelabs/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import '@onelabs/dapp-kit/dist/index.css';
import '../css/tetrio-theme.css';

const queryClient = new QueryClient();

const networks = {
    testnet: { url: getFullnodeUrl('testnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networks} defaultNetwork={import.meta.env.VITE_NETWORK || 'testnet'}>
                <WalletProvider>
                    <App />
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
