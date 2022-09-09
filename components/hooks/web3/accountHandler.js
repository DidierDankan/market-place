//common use of a fabricated hook

import { useEffect } from 'react';
//React Hooks for Data Fetching
import useSwr from 'swr';

const adminAddresses = {
	//hashed version of portfolio account "fb765b61dfac8bc33fa98ac16686b993e6d84798d6f6c28a6923e276e7e3f345"
	'0xD1d7d20147AD9cb7F60Fc85a3e3a3c8B28728699': true,
};

export const handler = (web3) => () => {
	const { data, mutate, ...swrRes } = useSwr(
		() => {
			//if we dont have a identifier the callback function will not run, we have the identifier if we have web3
			return web3 ? 'web3/accounts' : null;
		},
		async () => {
			const accounts = await web3.eth.getAccounts();
			return accounts[0];
		}
	); // will return swrRes.data, swrRes.error

	useEffect(() => {
		window.ethereum &&
			window.ethereum.on('accountsChanged', (account) => {
				mutate(account[0] ?? null);
			});
	}, [mutate]);

	return {
		account: {
			data: data,
			mutate,
			...swrRes,
		},
		//web3 util to dehash keccak256 web3.utils.keccak256(hashed)
		isAdmin: (data && adminAddresses[data]) ?? false,
	};
};

//this also works
// export const handler = (web3) => () => {
// 	const [account, setAccount] = useState(null);

// 	useEffect(() => {
// 		const getAccount = async () => {
// 			const accounts = await web3.eth.getAccounts();
// 			setAccount(accounts[0]);
// 		};

// 		web3 && getAccount();
// 	}, [web3]);

// 	useEffect(() => {
// 		window.ethereum &&
// 			window.ethereum.on('accountsChanged', (account) => {
// 				setAccount(account[0] ?? null);
// 			});
// 	}, [account]);

// 	return { account };
// };
