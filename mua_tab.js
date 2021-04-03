(function (){
	let background = document.getElementById("background");
	let redditWallpaper = false;

	function setBackground (backgroundImage) {
		background.appendChild(backgroundImage);	
	}

	function onBackgroundImageResponse (background) {
		if(redditWallpaper){
			let responseJson = JSON.parse(this.responseText).data.children;
			let randomIndex = Math.random() * responseJson.length | 0;
			let randomImage = responseJson[randomIndex].data;
			let backgroundImage = createImage(randomImage.url)
			
			setBackground(backgroundImage);
		}else{
			let responseJson = JSON.parse(this.responseText);
			let randomIndex = Math.random() * responseJson.length | 0;
			let randomImage = responseJson[randomIndex];
			let backgroundImage = createImage(randomImage.url)
			
			setBackground(backgroundImage);
		}
	}
	function createImage (url) {
		let img = document.createElement("img");
            	img.setAttribute("src", url);
		img.setAttribute("alt", "chrome-mua-tab-background");
		img.className = "bg-img" ;
		return img;
	}

	var backgroundImageReq = new XMLHttpRequest();
	backgroundImageReq.addEventListener("load", onBackgroundImageResponse);

	chrome.storage.sync.get('reddit-wallpaper', function (value) {
		redditWallpaper = value["reddit-wallpaper"];
		if(redditWallpaper){
			backgroundImageReq.open("GET", "https://www.reddit.com/r/wallpaper/top.json");
		}else{
			backgroundImageReq.open("GET", "https://raw.githubusercontent.com/maifeeulasad/chrome-mua-tab/data-source/data.json");
		}
		backgroundImageReq.send();
	});
})();

(function () {
	let timeElem = document.getElementById("time");
	let dateElem = document.getElementById("date");

	function getTime() {
		let today = new Date();

            	let hour = today.getHours();
		hour = hour.toString().length === 1 ? ("0" + hour) : hour;
            	let minutes = today.getMinutes();
		minutes = minutes.toString().length === 1 ? ("0" + minutes) : minutes;
            	let seconds = today.getSeconds();
		seconds = seconds.toString().length === 1 ? ("0" + seconds) : seconds;
            	let time = hour + " : " + minutes + " : " + seconds;

		let day = today.getUTCDate();
		let dayOfWeek = today.getUTCDay();

		if(-today.getTimezoneOffset() > hour * 60 + minutes){
			day += 1;
			dayOfWeek += 1;		
		}
		day = day.toString().length === 1 ? ("0" + day) : day;
		let month = today.getUTCMonth() + 1;
		month = month.toString().length === 1 ? ("0" + month) : month;
		let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		let date = daysOfWeek[dayOfWeek] + " , " + day + " / " + month;

        	timeElem.innerHTML = time;
        	dateElem.innerHTML = date;

     		setTimeout(function () {
            		getTime()
        	}, 1000*1);
    }
    getTime();
})();


(function (){
	let batteryElem = document.getElementById("battery");
	let batteryLabelElem = document.getElementById("battery-label");
	function getBattery() {
		navigator
			.getBattery()
			.then(battery => { 
				let batLevelInt = Math.round(battery.level * 100)
				batteryElem.style.height = batLevelInt + "%";
				batteryLabelElem.setAttribute("title",batLevelInt + "%");
				if(batLevelInt<20){
					batteryElem.classList.add("alert");
				}else if(batLevelInt<40){
					batteryElem.classList.add("warn");
				}
			})
		
     		setTimeout(function () {
            		getBattery()
        	}, 1000*60*2);
	}
	getBattery();
})();

(function (){
	let quoteElem = document.getElementById("quote");

	function setRandomQuote(quote){
		quoteElem.innerHTML = quote;
	}

	function onQuotesResponse (quotesData) {
		let responseJson = JSON.parse(this.responseText);
		responseJson = responseJson.data.children;
		let randomIndex = Math.random() * responseJson.length | 0;
		let randomQuote = responseJson[randomIndex];
		let quote =  randomQuote.data.title;
		
		setRandomQuote(quote);
	}

	var quotesReq = new XMLHttpRequest();
	quotesReq.addEventListener("load", onQuotesResponse);
	quotesReq.open("GET", "https://www.reddit.com/r/quotes/new.json");
	quotesReq.send();
})();


(function (){
	let checkRedditWallpaper = document.getElementById("input-check-reddit-wallpaper");

	chrome.storage.sync.get('reddit-wallpaper', function (value) {
		checkRedditWallpaper.checked = value["reddit-wallpaper"];
	});

	checkRedditWallpaper.onclick = () => {
		chrome.storage.sync.set({'reddit-wallpaper': checkRedditWallpaper.checked})
	}
})();
