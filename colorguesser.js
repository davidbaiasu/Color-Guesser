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
const MAX_ATTEMPTS = 10;
const MAX_DISTANCE = Math.sqrt(3 * 255 * 255);

sliderElements.forEach(sliderElements => {
    sliderElements.addEventListener('input', (event) => {
        const currentSlider = event.target;
        const newValue = currentSlider.value;
        const valueSpan = currentSlider.nextElementSibling;
        valueSpan.textContent = newValue;
    });
});

submitElement.addEventListener('click', () => {
    myGame.checkGuess();
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

        colorSquareElement.style.backgroundColor = this.targetColor.rgbToString();
        
        attemptsSpan.textContent = this.currentAttempt;

        console.log("Game Start");
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
		const newAttempt = {
			number: this.currentAttempt,
			color: this.inputColor.rgbToString(),
			accuracy: score
		};
		
		this.attemptsHistory.push(newAttempt);
		
		this.viewIndex = this.attemptsHistory.length - 1;

		this.renderCurrentHistory();
	}
	
	renderCurrentHistory() {
		const attempt = this.attemptsHistory[this.viewIndex];

		if (!attempt) return;

		displayArea.innerHTML = '';

		const card = document.createElement('div');
		card.className = 'class-color-card';
		card.style.backgroundColor = attempt.color;

		const label = document.createElement('span');
		label.className = 'class-card-label';
		label.textContent = `#${attempt.number}`;

		const accBox = document.createElement('div');
		accBox.className = 'class-accuracy-box';
		accBox.textContent = `${attempt.accuracy}%`;

		card.appendChild(label);
		card.appendChild(accBox);
		displayArea.appendChild(card);
	}		
	
	changeView(direction) {
		if ( this.attemptsHistory.length === 0 ){
			return;
		}
		this.viewIndex = (this.viewIndex + direction + this.attemptsHistory.length) % this.attemptsHistory.length;
		this.renderCurrentHistory();
	}		
	
    checkGuess(){
		if ( this.gameOn === false ){
			return;
		}
		const r = Number(redSlider.value);
		const g = Number(greenSlider.value);
		const b = Number(blueSlider.value);
		this.inputColor.updateColor(r, g, b);

		const score = this.calculateAccuracy();
		this.createHistoryElement(score);
		console.log(`Result: ${score}%`);
		
		if( this.currentAttempt < MAX_ATTEMPTS ){
			this.currentAttempt++;
			attemptsSpan.textContent = this.currentAttempt;
		}
		else{
			this.gameOn = false;
			console.log("Game Over");
			submitElement.disabled = true;
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
