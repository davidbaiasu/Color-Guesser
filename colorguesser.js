console.log("Hello!");

const colorSquareElement = document.getElementById('id-div-color-square');
const sliderElements = document.querySelectorAll('.class-range');
const redSlider = document.getElementById('id-range-red');
const greenSlider = document.getElementById('id-range-green');
const blueSlider = document.getElementById('id-range-blue');
const submitElement = document.getElementById('id-button-submit');
const prevButton = document.getElementById('id-button-prev');
const nextButton = document.getElementById('id-button-next');
const attemptsSpan = document.getElementById('id-span-attempt');
const attemptsContainer = document.getElementById('id-div-attempts');
const displayArea = document.getElementById('id-current-history-display');

const MAX_COLOR_CODE = 255;
const MAX_DISTANCE = Math.sqrt(3 * 255 * 255);

sliderElements.forEach(slider => {
    slider.addEventListener('input', () => {
        myGame.updateSliderLabels(); 
    });
});

submitElement.addEventListener('click', () => {
    if (myGame.gameOn) {
        myGame.checkGuess();
    }
	else{
        myGame.newGame();
        
        submitElement.textContent = "Submit";
        submitElement.style.backgroundColor = "#333";
        
        const attemptPara = document.getElementById('id-para-attempt');
        attemptPara.innerHTML = 'Attempt: <span id="id-span-attempt">1</span>';
        
        window.attemptsSpan = document.getElementById('id-span-attempt');
    }
});

prevButton.addEventListener('click', () => {
    myGame.changeView(-1);
});

nextButton.addEventListener('click', () => {
    myGame.changeView(1);
});

class Game{

	gameOn = true;
	targetColor = null;
	inputColor = null;
	currentAttempt = 1;
	unlocked = { r: false, g: false, b: false };
	
	attemptsHistory = [];
	viewIndex = 0;
	
	constructor() {
        this.newGame();
    }

    newGame() {
		this.targetColor = new Color();
		this.inputColor = new Color();
		this.currentAttempt = 1;
		this.gameOn = true;

		this.attemptsHistory = [];
		this.viewIndex = 0;
		this.unlocked = { r: false, g: false, b: false };

		const displayArea = document.getElementById('id-current-history-display');
		displayArea.innerHTML = '<p id="id-placeholder-text">No attempts yet</p>';

		colorSquareElement.style.backgroundColor = this.targetColor.rgbToString();
		
		const span = document.getElementById('id-span-attempt');
		if (span) span.textContent = this.currentAttempt;

		this.updateSliderLabels();

		console.log("New Game Started");
		this.targetColor.tableColors();
}
	
	calculateAccuracy(){
		const rDiff = this.targetColor.valueRed - this.inputColor.valueRed;
		const gDiff = this.targetColor.valueGreen - this.inputColor.valueGreen;
		const bDiff = this.targetColor.valueBlue - this.inputColor.valueBlue;

		const distance = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);

		const accuracy = (1 - (distance / MAX_DISTANCE)) * 100;

		return parseFloat(accuracy.toFixed(2));
	}

	createHistoryElement(score) {
		const checkR = this.inputColor.valueRed === this.targetColor.valueRed;
		const checkG = this.inputColor.valueGreen === this.targetColor.valueGreen;
		const checkB = this.inputColor.valueBlue === this.targetColor.valueBlue;

		const newAttempt = {
			number: this.currentAttempt,
			color: this.inputColor.rgbToString(),
			accuracy: score,
			matches: { r: checkR, g: checkG, b: checkB }
		};
		
		this.attemptsHistory.push(newAttempt);
		this.viewIndex = this.attemptsHistory.length - 1;
		this.renderCurrentHistory();
	}
	
	renderCurrentHistory() {
		const displayArea = document.getElementById('id-current-history-display');
		const attempt = this.attemptsHistory[this.viewIndex];

		if (!attempt) {
			displayArea.innerHTML = '<p id="id-placeholder-text">No attempts yet</p>';
			return;
		}

		displayArea.innerHTML = '';

		const rgbText = document.createElement('span');
		rgbText.className = 'class-card-rgb';
		rgbText.textContent = attempt.color;

		const card = document.createElement('div');
		card.className = 'class-color-card';
		card.style.backgroundColor = attempt.color;

		const labelContainer = document.createElement('div');
		labelContainer.className = 'class-card-label-container';

		const label = document.createElement('span');
		label.className = 'class-card-label';
		label.textContent = `#${attempt.number}`;
		labelContainer.appendChild(label);

		const accBox = document.createElement('div');
		accBox.className = 'class-accuracy-box';
		accBox.textContent = `${attempt.accuracy}%`;

		card.appendChild(labelContainer);
		card.appendChild(accBox);
		
		displayArea.appendChild(rgbText); 
		displayArea.appendChild(card);
	}
	
	updateSliderLabels() {
		const rVal = Number(redSlider.value);
		const gVal = Number(greenSlider.value);
		const bVal = Number(blueSlider.value);

		const rSpan = redSlider.nextElementSibling;
		const gSpan = greenSlider.nextElementSibling;
		const bSpan = blueSlider.nextElementSibling;

		rSpan.textContent = (this.unlocked.r && rVal === this.targetColor.valueRed) ? `${rVal} ✅` : rVal;
		gSpan.textContent = (this.unlocked.g && gVal === this.targetColor.valueGreen) ? `${gVal} ✅` : gVal;
		bSpan.textContent = (this.unlocked.b && bVal === this.targetColor.valueBlue) ? `${bVal} ✅` : bVal;
	}
	
	changeView(direction) {
		if ( this.attemptsHistory.length === 0 ){
			return;
		}
		this.viewIndex = (this.viewIndex + direction + this.attemptsHistory.length) % this.attemptsHistory.length;
		this.renderCurrentHistory();
	}
	
    checkGuess() {
		if (this.gameOn === false) return;

		const r = Number(redSlider.value);
		const g = Number(greenSlider.value);
		const b = Number(blueSlider.value);
		this.inputColor.updateColor(r, g, b);

		if (r === this.targetColor.valueRed) this.unlocked.r = true;
		if (g === this.targetColor.valueGreen) this.unlocked.g = true;
		if (b === this.targetColor.valueBlue) this.unlocked.b = true;

		const score = this.calculateAccuracy();
		this.createHistoryElement(score);
		this.updateSliderLabels();

		if (this.unlocked.r && this.unlocked.g && this.unlocked.b) {
			this.gameOn = false;
			
			const attemptPara = document.getElementById('id-para-attempt');
			attemptPara.innerHTML = `You won in ${this.currentAttempt} attempts!`;

			submitElement.textContent = "New Game";		
		}
		else {
			this.currentAttempt++;
			attemptsSpan.textContent = this.currentAttempt;
		}
	}

}
	

class Color{
	
	valueRed = 0;
	valueGreen = 0;
	valueBlue = 0;
	
	constructor(){
		this.newColors();
	}
	
	newColors(){
		this.valueRed = this.randomColorCode();
        this.valueGreen = this.randomColorCode();
        this.valueBlue = this.randomColorCode();
	}
	
	randomColorCode(){
		return Math.floor(Math.random() * (MAX_COLOR_CODE + 1));
	}
	
	updateColor(r, g, b){
		this.valueRed = r;
		this.valueGreen = g;
		this.valueBlue = b;
	}
	
	rgbToString(){
		return `rgb(${this.valueRed}, ${this.valueGreen}, ${this.valueBlue})`;
	}
	
	tableColors(){
		console.table([this]);
	}
	
}

const myGame = new Game();
