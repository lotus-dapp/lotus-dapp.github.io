window.game = {
	checkAccount:0,
	browser:"https://bscscan.com",
	// provider:"https://bsc-dataseed1.binance.org",
	chainId:0,
	userAddress:false,
	gameAddress: "0x32A8B068b3f831aB2aA0cde7E6337BBD7B47CE81",
	tokenAddress:"0x7B80D44503B25db369197f9d885bB10dd5C53Ed3", 
	bdAddress:"0xe5877E8CF1e8Bf59C8c34D0b80d5576b38869fB2", 
	tokenDecimals:18,
	currentBlock:0,
	connect(callback) {
		
		this.checkAccount++;
		if(this.checkAccount >= 10) {
			callback && callback(false);
			return;
		}
		
		// alert(typeof(web3));
		if(typeof(ethereum) == "undefined" && typeof(web3) == "undefined") {
			setTimeout(()=>{
				this.connect(callback);
			}, 100);
			return;
		}
		
		var provider = null;
		if(typeof(web3) != "undefined") {
			provider = web3.currentProvider;
		} else if(typeof(ethereum) != "undefined") {
			provider = ethereum;
		}
		
		if(typeof(this.metaMask) == "undefined") {
			this.metaMask = new Web3(provider);
			this.metaMask.utils.hexToNumber = function(number) {
				if(number == undefined) {
					return 0x00;
				}
				return this.toBN(number).toString(10);
			}
			this.BN = this.metaMask.utils.BN;
			this.zeroAmount = new this.BN(0);
		}
		
		provider.request({method: 'eth_requestAccounts'}).then(function(address) {
			window.game.metaMask.eth.getChainId().then((chainId)=>{
				window.game.chainId = chainId;
				window.game.userAddress = window.game.metaMask.utils.toChecksumAddress(address[0]);
				callback && callback(window.game.userAddress);
				
				// console.log(window.game.userAddress);
			});
		}).catch(function(err) {
			window.game.userAddress = false;
			callback && callback(window.game.userAddress);
		});
		
	},
	async buy(amount, success, error) {
		
		var gasPrice = new this.BN(utils.w(0.1, 9));
		var gasLimit = new this.BN("1000000");
		var value = utils.w(amount, 18);
		var nonce = await this.metaMask.eth.getTransactionCount(this.userAddress);
		var transactionObj = {
			nonce:nonce,
			from:this.userAddress,
			to: this.tokenAddress,
			value: value.toString(),
			data: "0x",
			gasPrice:gasPrice.toString(),
			gas: gasLimit.toString(),
			chainId:this.chainId,
		};
		
		this.metaMask.eth.sendTransaction(transactionObj)
		.on('receipt', function(receipt) {
			success(receipt);
		})
		.catch(function(err) {
			error(err);
		});
	},
	async sell(success, error) {
		var amount = await this.balance(this.userAddress);
		var token = new this.metaMask.eth.Contract(erc20_abi, this.tokenAddress);
		var data = token.methods.transfer(this.tokenAddress, amount).encodeABI();
		
		var gasPrice = new this.BN(utils.w(0.1, 9));
		var gasLimit = new this.BN("2000000");
		var nonce = await this.metaMask.eth.getTransactionCount(this.userAddress);
		var transactionObj = {
			nonce:nonce,
			from:this.userAddress,
			to: this.tokenAddress,
			value: 0,
			data: data,
			gasPrice:gasPrice.toString(),
			gas: gasLimit.toString(),
			chainId:this.chainId,
		};
		
		this.metaMask.eth.sendTransaction(transactionObj)
		.on('receipt', function(receipt) {
			success(receipt);
		})
		.catch(function(err) {
			error(err);
		});
	},
	async bind(address, success, error) {
		var amount = utils.w(1, 18);
		var token = new this.metaMask.eth.Contract(erc20_abi, this.bdAddress);
		var data = token.methods.transfer(address, amount).encodeABI();
		
		var gasPrice = new this.BN(utils.w(0.1, 9));
		var gasLimit = new this.BN("500000");
		var nonce = await this.metaMask.eth.getTransactionCount(this.userAddress);
		var transactionObj = {
			nonce:nonce,
			from:this.userAddress,
			to: this.bdAddress,
			value: 0,
			data: data,
			gasPrice:gasPrice.toString(),
			gas: gasLimit.toString(),
			chainId:this.chainId,
		};
		
		this.metaMask.eth.sendTransaction(transactionObj)
		.on('receipt', function(receipt) {
			success(receipt);
		})
		.catch(function(err) {
			error(err);
		});
	},
	async balance(walletAddress) {
		var token = new this.metaMask.eth.Contract(erc20_abi, this.tokenAddress);
		var balance = new this.BN(await token.methods.balanceOf(walletAddress).call());
		return balance;
	},
	getCurrentNumber:async function() {
		
		if(this.currentBlock == 0) {
			var currentBlock = await this.metaMask.eth.getBlockNumber();
			while(true) {
				if(currentBlock.account_names == undefined) {
					break;
				}
				currentBlock = currentBlock.account_names;
			}
			
			this.currentBlock = parseInt(currentBlock);
		} else {
			
			var currentBlock = this.currentBlock+1;
			var block = await this.metaMask.eth.getBlock(currentBlock);
			if(block != undefined && block != null) {
				this.currentBlock = parseInt(currentBlock);
			}

		}
		
		return this.currentBlock;
	},
	async gameData() {
		var router = new this.metaMask.eth.Contract(router_abi, this.gameAddress);
		
		var data = await router.methods.users(this.userAddress).call();
		// console.log(data);
		var userAddress   = utils.encode_address(data[0], 8, 6);
		var parentAddress = utils.encode_address(data[1], 8, 6);
		var agentAddress  = utils.encode_address(data[2], 8, 6);
		var childCount  = data[3].toString(10);
		var activeCount = data[4].toString(10);
		var orderCount  = data[5].toString(10);
		var orderAmount =   utils.precision(utils.z(data[6], 18), 2) + " USDT";
		var pendingAmount = utils.precision(utils.z(data[7], 18), 2) + " USDT";
		var rewardAmount  = utils.precision(utils.z(data[8], 18), 2) + " USDT";
		var pendingTime = data[9] == 0n?'-'    : new Date(parseInt(data[9])*1000).format();
		var orderTime = data[10] == 0n ? '-'   : new Date(parseInt(data[10])*1000).format();
		var releaseTime = data[10] == 0n ? '-' : new Date(parseInt(await router.methods.releaseTime(data[0]).call())*1000).format();
		
		var isAgent = (await router.methods.agentUser(data[0]).call()) ? "⭐️" : "";
		
		var process = await router.methods.process().call();
		var currUser = utils.encode_address(process[0], 8, 6);;
		var lastUser = process[1];
		var currUserData = await router.methods.users(process[0]).call();
		var currUserPendingTime = currUserData[9] == 0n?'-': new Date(parseInt(currUserData[9])*1000).format();
			
		var gameParameter = {
			userAddress:userAddress+" "+isAgent,
			parentAddress:parentAddress,
			agentAddress:agentAddress,
			childCount:childCount,
			activeCount:activeCount,
			orderCount:orderCount,
			orderAmount:orderAmount,
			pendingAmount:pendingAmount,
			rewardAmount:rewardAmount,
			pendingTime:pendingTime,
			orderTime:orderTime,
			releaseTime:releaseTime,
			currUser:currUser,
			currUserPendingTime:currUserPendingTime,
		};
		return gameParameter;
	},
	async isPending(address) {
		var router = new this.metaMask.eth.Contract(router_abi, this.gameAddress);
		var data = await router.methods.users(address).call();
		var pendingAmount = new this.BN(data[6]);
		if(pendingAmount.gt(this.zeroAmount)) {
			return true;
		} else {
			return false;
		}
	}
}