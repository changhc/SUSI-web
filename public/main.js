var agentList = [];

function addAgentBlock () { 
  	// create a new div element 
  	// and give it some content 
	var block = document.getElementById("blocklist").firstElementChild;
	//console.log(block);
	var copy = block.cloneNode(true);
	var count = document.getElementById("blocklist").childElementCount + 1;
	copy.firstElementChild.nextElementSibling.textContent = "set " + count.toString();
	copy.setAttribute("id", "block" + count.toString());
	// add the newly created element and its content into the DOM 
	document.getElementById("blocklist").appendChild(copy); 

}

function removeBlock(element){
	var node = element.parentNode.parentNode;
	if(node.parentNode.childElementCount != 1)
		node.parentNode.removeChild(node);
	var count = document.getElementById("blocklist").childElementCount;
	var h = document.getElementsByTagName("h4");
	for(i = 0; i < count; ++i)
		h[i].innerHTML = "set " + (i + 1).toString();
}

function agentSelected(option){

	if(option.selectedIndex != 0){
		var handlerList = agentList[option.selectedIndex - 1].handlerList.handler;
		var select = option.parentNode.nextElementSibling.lastElementChild;
		while (select.options.length > 1) {                
			select.remove(1);
		} 
		
		if(handlerList.length === undefined){
			var option = document.createElement("option");
			option.value = handlerList.handlerName;
			option.text = handlerList.handlerName;
			select.add(option);
		}
		else{

			for(i = 0; i < handlerList.length; ++i){
				var option = document.createElement("option");
				option.value = handlerList[i].handlerName;
				option.text = handlerList[i].handlerName;
				select.add(option);

			}
		}
	}
	else{
		var select = option.parentNode.nextElementSibling.lastElementChild;
		while (select.options.length > 1) {                
			select.remove(1);
		}
	}
	
}

function handlerSelected(option){
	var op = option;
	var select = option.parentNode.previousElementSibling.lastElementChild;
	if(select.selectedIndex != 0 && op.selectedIndex != 0){
		var req_body = {
			"request": {
				"agentId": select.options[select.selectedIndex].value,
				"handler": option.value
			}
		};

		var url = "http://wise-paas-server.eastasia.cloudapp.azure.com/webresources/DeviceCtl/getSensorID";
		var user = "admin";
		var pass = "admin";
		var request = new XMLHttpRequest();
		request.open("POST", url, true);
		request.setRequestHeader("Authorization", "Basic " + window.btoa(user + ":" + pass));
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		request.setRequestHeader("Accept", "application/json");
		console.log(JSON.stringify(req_body));
		request.send(JSON.stringify(req_body));
		request.onload = function() {
			var state = this.readyState;
			var responseCode = request.status;
			console.log("request.onload called. readyState: " + state + "; status: " + responseCode);

			if (state == this.DONE && responseCode == 200) {
				//console.log(this.response);
				var list = JSON.parse(this.response).result.itemList.item;
				select = op.parentNode.nextElementSibling.lastElementChild;
				//console.log(list);
				while (select.options.length > 0) {                
					select.remove(0);
				} 
				for(i = 0; i < list.length; ++i){
					if(list[i].type != "v") continue;
					var option = document.createElement("option");
					option.value = list[i].sensorID;
					option.text = list[i].sensorID;
					select.add(option);
				}
				
			}
		};

		request.error = function(e) {
			console.log("request.error called. Error: " + e);
		};

		request.onreadystatechange = function(){
			console.log("request.onreadystatechange called. readyState: " + this.readyState);
		};
	}
	else{
		select = op.parentNode.nextElementSibling.lastElementChild;
		//console.log(list);
		while (select.options.length > 0) {                
			select.remove(0);
		} 
	}
}

function submit(){
	var req = [];
	var block = document.getElementById("blocklist").firstElementChild;
	var count = document.getElementById("blocklist").childElementCount;
	for(i = 0; i < count; ++i){
		var list = block.getElementsByTagName("select");
		var item = {};
		for(j = 0; j < list.length; ++j){
			if(list[j].selectedIndex < 1 && list[j].name != "sensorId") {
				alert('Blanks not allowed!');
				return;
			}
			var options = list[j].selectedOptions;
			if(options.length > 1){
				item[list[j].name] = [];
				for(k = 0; k < options.length; ++k){
					item[list[j].name].push(options[k].value);
				}
			}
			else item[list[j].name] = options[0].value;
			
		}
		if(Object.keys(item).length != 0){
			for(j = 0; j < req.length; ++j){
				if(item[list[0].name] == req[j][list[0].name] && item[list[1].name] == req[j][list[1].name]){
					alert('Please do not select identical agentId and handlerId pairs!');
					return;
				}
			}
			req.push(item);
		}
			
		block = block.nextElementSibling;
	}
	var data = { pass: 'This is for WISE-PaaS only.', msg: req };
	var request = new XMLHttpRequest();
	request.open("POST", "http://wise-webapp.azurewebsites.net/list", true);
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	request.send(JSON.stringify(data));
	request.onload = function() {
		var state = this.readyState;
		var responseCode = request.status;
		console.log("request.onload called. readyState: " + state + "; status: " + responseCode);

		if (state == this.DONE && responseCode == 200) {
			
		}
	};

	request.error = function(e) {
		console.log("request.error called. Error: " + e);
	};

	request.onreadystatechange = function(){
		console.log("request.onreadystatechange called. readyState: " + this.readyState);
	};
	alert("submitted!");
}	

function getAgentId(){
	var url = "http://wise-paas-server.eastasia.cloudapp.azure.com/webresources/DeviceMgmt";
	var user = "admin";
	var pass = "admin";
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.setRequestHeader("Authorization", "Basic " + window.btoa(user + ":" + pass));
	request.setRequestHeader("Accept", "application/json");
	request.send(null);
	request.onload = function() {
		var state = this.readyState;
		var responseCode = request.status;
		console.log("request.onload called. readyState: " + state + "; status: " + responseCode);

		if (state == this.DONE && responseCode == 200) {
			var list = JSON.parse(this.response).result.item;
			for(i = 0; i < list.length; ++i){
				if(list[i].status != "Connected") continue;
				agentList.push(list[i]);
				var select = document.getElementsByClassName("select-agentid");
				var option = document.createElement("option");
				option.value = list[i].agentId;
				option.text = list[i].name + " (" + list[i].agentId + ')';
				for(j = 0; j < select.length; ++j){
					select[j].add(option);
				}
			}
			
		}
	};

	request.error = function(e) {
		console.log("request.error called. Error: " + e);
	};

	request.onreadystatechange = function(){
		console.log("request.onreadystatechange called. readyState: " + this.readyState);
	};
	
}