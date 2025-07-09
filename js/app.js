$(document).ready(()=>{
	
	$("#startBtn").click(()=>{
		$("body").loading({message:"連結中...",zIndex:999})
		game.connect(async (userAddress)=> {
			if(userAddress == false) {
				$.toast({
					text: '[操作失敗] 連結失敗',
					position: 'top-center',
					icon:"error",
					stack: false
				});
			} else if(game.chainId != 56 && game.chainId != 97) {
				$.toast({
					text: '[操作失敗] 請選擇BSC網絡',
					position: 'top-center',
					icon:"error",
					stack: false
				});
			} else {
				
				await loadGameData();
				
				$(".start-btn").hide();
				$(".buy-btn").show();
				$(".sell-btn").show();
				$(".bind-btn").show();
				$(".user").css("display", "flex");
				
			}
			$("body").loading("stop");
		});
	});
	
	async function loadGameData() {
		var gameData = await this.game.gameData();
		
		$(".user .userAddress .value").html(gameData.userAddress);
		$(".user .parentAddress .value").html(gameData.parentAddress);
		$(".user .agentAddress .value").html(gameData.agentAddress);
		$(".user .childCount .value").html(gameData.activeCount);
		$(".user .activeCount .value").html(gameData.activeCount);
		$(".user .orderCount .value").html(gameData.orderCount);
		$(".user .orderAmount .value").html(gameData.orderAmount);
		$(".user .pendingTime .value").html(gameData.pendingTime);
		$(".user .orderTime .value").html(gameData.orderTime);
		$(".user .releaseTime .value").html(gameData.releaseTime);
		$(".user .currUser .value").html(gameData.currUser);
		$(".user .currUserPendingTime .value").html(gameData.currUserPendingTime);
	}
	
	$("#buyBtn").click(async ()=>{
		$(".inputBox").css("display", "flex");
	});
	
	$(".inputBox .mask").click(async ()=>{
		$(".inputBox").css("display", "none");
	});
	
	$(".inputBox .submit-btn").click(async ()=>{
		
		if($(".inputBox .submit-btn").hasClass("disable-btn")) {
			return;
		}
		
		$("body").loading({message:"發送中...",zIndex:999});
		
		var amount = $(".inputBox input[name=amount]").val();
		console.log(amount);
		await window.game.buy(amount, function(receipt) {
			
				console.log(receipt.transactionHash);
				
				$.toast({
					text: '[交易成功] 交易ID ' + receipt.transactionHash,
					position: 'top-center',
					icon:"success",
					stack: false
				});
				$("body").loading("stop");
				
				loadGameData();
				
			},
			function(err) {
				$.toast({
					text: "[交易失敗] " + err.message,
					position: 'top-center',
					icon:"error",
					stack: false
				});
				$("body").loading("stop");
			}
		);
		
	});
	
	
	$("#sellBtn").click(async ()=>{
		if($(".sell-btn").hasClass("disable-btn")) {
			return;
		}
		
		$("body").loading({message:"發送中...",zIndex:999})
		
		await window.game.sell(function(receipt) {
			
				$.toast({
					text: '[交易成功] 交易ID ' + receipt.transactionHash,
					position: 'top-center',
					icon:"success",
					stack: false
				});
				$("body").loading("stop");
				
				loadGameData();
				
			},
			function(err) {
				$.toast({
					text: "[交易失敗] " + err.message,
					position: 'top-center',
					icon:"error",
					stack: false
				});
				$("body").loading("stop");
			}
		);
	});
	
	
	$("#bindBtn").click(async ()=>{
		$(".bindBox").css("display", "flex");
	});
	
	$(".bindBox .mask").click(async ()=>{
		$(".bindBox").css("display", "none");
	});
	
	$(".bindBox .submit-btn").click(async ()=>{
		
		if($(".bindBox .submit-btn").hasClass("disable-btn")) {
			return;
		}
		
		var address = $(".bindBox input[name=address]").val();
		
		if(address == "") {
			$.toast({
				text: "[交易失敗] 請輸入成員錢包地址",
				position: 'top-center',
				icon:"error",
				stack: false
			});
			return;
		}		
		console.log(address);
		
		$("body").loading({message:"發送中...",zIndex:999});
		
		await window.game.bind(address, function(receipt) {
			
				console.log(receipt.transactionHash);
				
				$.toast({
					text: '[交易成功] 交易ID ' + receipt.transactionHash,
					position: 'top-center',
					icon:"success",
					stack: false
				});
				$("body").loading("stop");
				
				loadGameData();
				
			},
			function(err) {
				$.toast({
					text: "[交易失敗] " + err.message,
					position: 'top-center',
					icon:"error",
					stack: false
				});
				$("body").loading("stop");
			}
		);
		
	});

});