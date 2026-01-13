(function () {
	let background = document.getElementById("background");
	let redditWallpaper = false;

	function setBackground(backgroundImage) {
		background.appendChild(backgroundImage);
	}

	function onBackgroundImageResponse(background) {
		try {
			if (redditWallpaper) {
				const parsedResponse = JSON.parse(this.responseText);
				if (!parsedResponse?.data?.children?.[0]?.data) {
					console.error('Invalid Reddit response format');
					return;
				}

				let responseJson = parsedResponse.data.children;
				let randomIndex = Math.floor(Math.random() * responseJson.length);
				let randomPost = responseJson[randomIndex].data;
				let imageUrl;

				if (randomPost.is_gallery) {
					// Handle gallery post
					if (randomPost.media_metadata) {
						const mediaIds = Object.keys(randomPost.media_metadata);
						const randomMediaId = mediaIds[Math.floor(Math.random() * mediaIds.length)];
						const mediaItem = randomPost.media_metadata[randomMediaId];
						
						if (mediaItem?.s?.u) {
							imageUrl = mediaItem.s.u.replace(/&amp;/g, '&'); // Fix encoded ampersands
						}
					}
				} else if (randomPost.url) {
					// Handle single image post
					imageUrl = randomPost.url;
				}

				if (!imageUrl) {
					console.error('No valid image URL found');
					return;
				}

				let backgroundImage = createImage(imageUrl);
				setBackground(backgroundImage);
			} else {
				const responseJson = JSON.parse(this.responseText);
				if (!responseJson || !Array.isArray(responseJson) || !responseJson.length) {
					console.error('Invalid local JSON response format');
					return;
				}
				const randomIndex = Math.floor(Math.random() * responseJson.length);
				const randomImage = responseJson[randomIndex];
				const backgroundImage = createImage(randomImage.url);

				setBackground(backgroundImage);
			}
		} catch (error) {
			console.error('Error processing background image:', error);
		}
	}
	function createImage(url) {
		let img = document.createElement("img");
		img.setAttribute("src", url);
		img.setAttribute("alt", "chrome-mua-tab-background");
		img.className = "bg-img";
		return img;
	}

	var backgroundImageReq = new XMLHttpRequest();
	backgroundImageReq.addEventListener("load", onBackgroundImageResponse);

	chrome.storage.sync.get('reddit-wallpaper', function (value) {
		redditWallpaper = value["reddit-wallpaper"];
		if (redditWallpaper) {
			backgroundImageReq.open("GET", "https://www.reddit.com/r/wallpaper/best.json?t=day");
		} else {
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

		if (-today.getTimezoneOffset() > hour * 60 + minutes) {
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
		}, 1000 * 1);
	}
	getTime();
})();


(function () {
	let batteryElem = document.getElementById("battery");
	let batteryLabelElem = document.getElementById("battery-label");
	function getBattery() {
		navigator
			.getBattery()
			.then(battery => {
				let batLevelInt = Math.round(battery.level * 100)
				batteryElem.style.height = batLevelInt + "%";
				batteryLabelElem.setAttribute("title", batLevelInt + "%");
				if (batLevelInt < 20) {
					batteryElem.classList.add("alert");
				} else if (batLevelInt < 40) {
					batteryElem.classList.add("warn");
				}
			})

		setTimeout(function () {
			getBattery()
		}, 1000 * 60 * 2);
	}
	getBattery();
})();

(function () {
	let quoteElem = document.getElementById("quote");
	let retryCount = 0;
	const MAX_RETRIES = 3;

	function setRandomQuote(quote) {
		quoteElem.innerHTML = quote;
	}

	function fetchQuotes() {
		var quotesReq = new XMLHttpRequest();
		quotesReq.addEventListener("load", onQuotesResponse);
		quotesReq.open("GET", "https://www.reddit.com/r/quotes/best.json?t=day");
		quotesReq.send();
	}

	function onQuotesResponse(quotesData) {
		try {
			let responseJson = JSON.parse(this.responseText);
			if (!responseJson?.data?.children?.length) {
				if (retryCount < MAX_RETRIES) {
					console.log(`Retrying quotes fetch, attempt ${retryCount + 1} of ${MAX_RETRIES}`);
					retryCount++;
					setTimeout(fetchQuotes, 1000); // Wait 1 second before retry
					return;
				} else {
					console.error('Failed to fetch quotes after maximum retries');
					setRandomQuote('Inspiring quote loading...');
					return;
				}
			}

			let quotes = responseJson.data.children;
			let randomIndex = Math.floor(Math.random() * quotes.length);
			let randomQuote = quotes[randomIndex];
			
			if (randomQuote?.data?.title) {
				setRandomQuote(randomQuote.data.title);
			} else {
				setRandomQuote('Inspiring quote loading...');
			}
		} catch (error) {
			console.error('Error processing quotes response:', error);
			if (retryCount < MAX_RETRIES) {
				console.log(`Retrying quotes fetch, attempt ${retryCount + 1} of ${MAX_RETRIES}`);
				retryCount++;
				setTimeout(fetchQuotes, 1000);
			} else {
				setRandomQuote('Inspiring quote loading...');
			}
		}
	}

	fetchQuotes();
})();


(function () {
	let checkRedditWallpaper = document.getElementById("input-check-reddit-wallpaper");

	chrome.storage.sync.get('reddit-wallpaper', function (value) {
		checkRedditWallpaper.checked = value["reddit-wallpaper"];
	});

	checkRedditWallpaper.onclick = () => {
		chrome.storage.sync.set({ 'reddit-wallpaper': checkRedditWallpaper.checked })
	}
})();
