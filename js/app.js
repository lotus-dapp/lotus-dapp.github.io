$(document).ready(()=>{
	
	$("#startBtn").click(()=>{
		$("body").loading({message:"CONNECT...",zIndex:999})
		game.connect(async (userAddress)=> {
			if(userAddress == false) {
				$.toast({
					text: '[ERROR] Connect Failed',
					position: 'top-center',
					stack: false
				});
			} else if(game.chainId != 56 && game.chainId != 97) {
				$.toast({
					text: '[ERROR] Please select BSC network',
					position: 'top-center',
					stack: false
				});
			} else {
				
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
				
				$(".start-btn").hide();
				$(".buy-btn").show();
				$(".sell-btn").show();
				$(".user").css("display", "flex");
				
			}
			$("body").loading("stop");
		});
	});
	
	$("#buyBtn").click(async ()=>{
		$(".inputBox").css("display", "flex");
	});
	
	$(".inputBox .mask").click(async ()=>{
		$(".inputBox").css("display", "none");
	});
	
	$(".inputBox .submit-btn").click(async ()=>{
		
		if($(".submit-btn").hasClass("disable-btn")) {
			return;
		}
		
		$("body").loading({message:"SENDING...",zIndex:999});
		
		var amount = $(".inputBox input[name=amount]").val();
		console.log(amount);
		await window.game.buy(amount, function(receipt) {
			
				console.log(receipt.transactionHash);
				
				$.toast({
					text: '[SUCCESS] TransactionHash ' + receipt.transactionHash,
					position: 'top-center',
					stack: false
				});
				$("body").loading("stop");
				
			},
			function(err) {
				$.toast({
					text: "[ERROR] " + err.message,
					position: 'top-center',
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
		
		$("body").loading({message:"SENDING...",zIndex:999})
		
		await window.game.sell(function(receipt) {
				$.toast({
					text: '[SUCCESS] TransactionHash ' + receipt.transactionHash,
					position: 'top-center',
					stack: false
				});
				$("body").loading("stop");
				
			},
			function(err) {
				$.toast({
					text: "[ERROR] " + err.message,
					position: 'top-center',
					stack: false
				});
				$("body").loading("stop");
			}
		);
	});
	

});