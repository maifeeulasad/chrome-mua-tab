(function (){
	let background = document.getElementById("background");
	function setBackground (backgroundImage) {
		background.appendChild(backgroundImage);	
	}

	function onBackgroundImageResponse (background) {
		let responseJson = JSON.parse(this.responseText);
		let randomIndex = Math.random() * responseJson.length | 0;
		let randomImage = responseJson[randomIndex];
		let backgroundImage = createImage(randomImage.url)
		
		setBackground(backgroundImage);
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
	backgroundImageReq.open("GET", "https://raw.githubusercontent.com/maifeeulasad/chrome-mua-tab/data-source/data.json");
	backgroundImageReq.send();
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
            	let time = hour + " : " + minutes;

		let day = today.getUTCDate();
		day = day.toString().length === 1 ? ("0" + day) : day;
		let month = today.getUTCMonth() + 1;
		month = month.toString().length === 1 ? ("0" + month) : month;
		let year = today.getUTCFullYear();
		let date = day + " / " + month + " / " + year;

        	timeElem.innerHTML = time;
        	dateElem.innerHTML = date;

     		setTimeout(function () {
            		getTime()
        	}, 1000*10);
    }
    getTime();
})();
