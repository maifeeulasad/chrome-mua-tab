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
		return img;
	}

	var backgroundImageReq = new XMLHttpRequest();
	backgroundImageReq.addEventListener("load", onBackgroundImageResponse);
	backgroundImageReq.open("GET", "https://raw.githubusercontent.com/maifeeulasad/chrome-mua-tab/data-source/data.json");
	backgroundImageReq.send();
})();

