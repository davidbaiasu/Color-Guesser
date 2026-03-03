console.log("Hello!");

const colorSquareElement = document.getElementById('id-div-color-square');
const sliderElements = document.querySelectorAll('.class-range');
const redSlider = document.getElementById('id-range-red');
const greenSlider = document.getElementById('id-range-green');
const blueSlider = document.getElementById('id-range-blue');
const submitElement = document.getElementById('id-button-submit');
const attemptsSpan = document.getElementById('id-span-attempt');

const MAX_COLOR_CODE = 255;
const MAX_ATTEMPTS = 10;

sliderElements.forEach(sliderElements => {
    sliderElements.addEventListener('input', (event) => {
        const currentSlider = event.target;
        const newValue = currentSlider.value;
        const valueSpan = currentSlider.nextElementSibling;
        valueSpan.textContent = newValue;
    });
});

submitElement.addEventListener('click', () => {
	const redValue   = Number(redSlider.value);
	const greenValue = Number(greenSlider.value);
	const blueValue  = Number(blueSlider.value);
	inputColor.updateColor(redValue, greenValue, blueValue);
	
	let attemptNumber = Number(attemptsSpan.innerHTML);
	if( attemptNumber < MAX_ATTEMPTS ){
		attemptNumber++;
		attemptsSpan.innerHTML = `${attemptNumber}` ;
	}
	if( attemptNumber == MAX_ATTEMPTS ){
		////
	}
	
});

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

const targetColor = new Color();
const inputColor = new Color();

colorSquareElement.style.backgroundColor = targetColor.rgbToString();
targetColor.tableColors();
inputColor.tableColors();