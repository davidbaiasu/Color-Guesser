console.log("Hello!");

const MAX_COLOR_CODE = 255;

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
	
	rgbToString(){
		return `rgb(${this.valueRed}, ${this.valueGreen}, ${this.valueBlue})`;
	}
	
	tableColors(){
		console.table([this]);
	}
	
}

let colorObj = new Color();

colorObj.tableColors();