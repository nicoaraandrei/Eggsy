/// <reference path="jquery.d.ts" />
/// <reference path="jqueryui.d.ts" />
let SIDE: number = 40;
let canvas = <HTMLCanvasElement>document.getElementById('screen');
let ctx = canvas.getContext('2d');


//return a random hex color
function getRandomColor() {
    let letters = "0123456789ABCDEF".split("");
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 14)];
    }
    return color;
}

//Create a 2D array
function Array2D(numrows, numcols, initial) {
    let arr = [];
    for (let i = 0; i < numrows; ++i) {
        let columns = [];
        for (let j = 0; j < numcols; ++j) {
            columns[j] = initial;
        }
        arr[i] = columns;
    }
    return arr;
};

//move an element from an array to the given position
function moveElement(arr, oldpos: number, newpos: number) {
    let x: Piece = arr.splice(oldpos, 1)[0];
    arr.splice(newpos, 0, x);
}


class Point{
	constructor(public x: number, public y:number) {
    }
};


function triangleArea(A: Point, B: Point, C: Point) {
    return (C.x * B.y - B.x * C.y) - (C.x * A.y - A.x * C.y) + (B.x * A.y - A.x * B.y);
} 

//check if a point is inside a piece
function pointInside(P: Point, piece: Piece) {
    
    for (let i = 0; i < piece.cells.length; i++) {
        let A: Point = piece.cells[i][0];
        let B: Point = piece.cells[i][1];
        let C: Point = piece.cells[i][2];
        let D: Point = piece.cells[i][3];
        if (triangleArea(A, B, P) <= 0 && triangleArea(B, C, P) <= 0 && triangleArea(C, D, P) <= 0 && triangleArea(D, A, P) <= 0) {
            return true;
        }
    }
    return false;
}


interface PosData extends Array<number | number> { 0: number; 1: number; }

 
abstract class Piece {
	rot = 0;
	nr_rot = 0;
	nextrotation = 0;
	rotations = [];
	shape: number[][] = this.rotations[this.rot];
	topLeft: Point;
    cells: Point[][] = [];
    color: String;
    old_color: String;
    boardPos: PosData[] = [];

	constructor(public x: number, public y: number) {
        this.topLeft = new Point(x, y);
        this.color = getRandomColor();
        this.old_color = this.color;
	}

    //move the piece to the x,y coordinates
	move(x: number, y: number) {
		this.x = x;
        this.y = y;
        this.setCells();
    }
    

    //rotate the piece 90 degrees
	flipPiece() {
		if(this.rot == this.nr_rot) {
			this.rot = 0;
		} else {
			this.rot++;
        }

        this.shape = this.rotations[this.rot];
		return this.rotations[this.rot];
	}


    //determine the points of all 4 rectangles from the piece
	setCells() {
		let k = 0;
		for (let i = 0; i < this.shape.length; i++) {

            for (let j = 0; j < this.shape[i].length; j++) {
				if (this.shape[i][j] !== 0) {
					this.cells[k] = [];
					this.cells[k].push(new Point((SIDE * j) + this.x, (SIDE * i) + this.y));
					this.cells[k].push(new Point((SIDE * j) + this.x + SIDE, (SIDE * i) + this.y));
					this.cells[k].push(new Point((SIDE * j) + this.x + SIDE, (SIDE * i) + this.y + SIDE));
					this.cells[k].push(new Point((SIDE * j) + this.x, (SIDE * i) + this.y + SIDE));
					k++;
				}
			}
		}

	}

    //change piece color
    changeColor(c: String) {
        this.color = c;
    }

    //draw the piece on the canvas
    draw() {
		this.setCells();
		if(canvas.getContext) {
			for (let i = 0; i < this.cells.length; i++) {
                ctx.beginPath();
				ctx.moveTo(this.cells[i][0].x, this.cells[i][0].y);
				for (let j = 0; j < this.cells[i].length; j++) {
					ctx.lineTo(this.cells[i][j].x, this.cells[i][j].y);
				}
				ctx.lineTo(this.cells[i][0].x, this.cells[i][0].y);
				
				ctx.closePath();
                ctx.stroke();
                ctx.fillStyle = this.color;
                ctx.fill();
			}
		}
	}
}

class I extends Piece {
	nr_rot = 1;
	rotations = [
        [
            [1],
            [1],
            [1],
            [1]
        ],

        [
            [1, 1, 1, 1]
        ]
    ];
	shape = this.rotations[this.rot];

	constructor(public x: number, public y: number) {
        super(x, y);
        this.setCells();
	}
}

class O extends Piece {
	nr_rot = 1;
	rotations = [
        [
            [1, 1],
            [1, 1]
        ],
        [
            [1, 1],
            [1, 1]
        ]
    ];
    shape = this.rotations[0];

    constructor(public x: number, public y: number) {
        super(x, y);
        this.setCells();
    }
}

class J extends Piece {
	nr_rot = 3;
	rotations = [
        [
            [0, 1],
            [0, 1],
            [1, 1]
        ],

        [
            [1, 0, 0],
            [1, 1, 1]
        ],

        [
            [1, 1],
            [1, 0],
            [1, 0]
        ],

        [
            [1, 1, 1],
            [0, 0, 1]
        ]
    ];
    shape = this.rotations[this.rot];

    constructor(public x: number, public y: number) {
        super(x, y);
        this.setCells();
    }
}

class L extends Piece {
	nr_rot = 3;
	rotations = [
        [
            [1, 0],
            [1, 0],
            [1, 1]
        ],

        [
            [1, 1, 1],
            [1, 0, 0]
        ],

        [
            [1, 1],
            [0, 1],
            [0, 1]
        ],

        [
            [0, 0, 1],
            [1, 1, 1]
        ]
    ];
    shape = this.rotations[this.rot];

    constructor(public x: number, public y: number) {
        super(x, y);
        this.setCells();
    }
}

class T extends Piece {
	nr_rot = 3;
	rotations = [
        [
            [0, 1],
            [1, 1],
            [0, 1]
        ],

        [
            [0, 1, 0],
            [1, 1, 1]
        ],

        [
            [1, 0],
            [1, 1],
            [1, 0]
        ],

        [
            [1, 1, 1],
            [0, 1, 0]
        ]
    ];
    shape = this.rotations[this.rot];

    constructor(public x: number, public y: number) {
        super(x, y);
        this.setCells();
    }
}

class S extends Piece {
	nr_rot = 1;
	rotations = [
        [
            [0, 1, 1],
            [1, 1, 0]
        ],

        [
            [1, 0],
            [1, 1],
            [0, 1]
        ]
    ];
    shape = this.rotations[this.rot];

    constructor(public x: number, public y: number) {
        super(x, y);
        this.setCells();
    }
}

class Z extends Piece {
	nr_rot = 1;
	rotations = [
        [
            [1, 1, 0],
            [0, 1, 1]
        ],

        [
            [0, 1],
            [1, 1],
            [1, 0]
        ]
    ];
    shape = this.rotations[this.rot];

    constructor(public x: number, public y: number) {
        super(x, y);
        this.setCells();
    }


}


function logArrayElements(element, index, array) {
    console.log('a[' + index + '] = ' + element[0].x + "  "+ element[0].y);
}


class Board {
	pieces: Piece[] = [];
	grid: number[][];

	constructor(public x:number, public y:number, public rows: number, public columns: number) {
		this.grid = Array2D(rows, columns, 0);
	}

    //check if a piece is inside the board
	isInside(piece:Piece) {
        let A: Point = new Point(this.x, this.y);
        let B: Point = new Point(this.x + this.columns * SIDE, this.y);
        let C: Point = new Point(this.x + this.columns * SIDE, this.y + this.rows * SIDE);
        let D: Point = new Point(this.x, this.y + this.rows * SIDE);
        
        let i = 0;
         for(let cell of piece.cells) {
             let P = new Point(cell[0].x + SIDE / 2, cell[0].y + SIDE / 2);
             if (triangleArea(A, B, P) < 0 && triangleArea(B, C, P) < 0 && triangleArea(C, D, P) < 0 && triangleArea(D, A, P) < 0) {
                i++;
            }
         }
         if (i == 4) {
             return true;
         }
         else {
             return false;
         }
    }    

    //add a piece to the board
    addPiece(piece: Piece) {

        let data: PosData[] = [];

        if (this.isInside(piece)) {
            let row;
            let col;
            for (let cell of piece.cells) {
                row = Math.round((cell[0].x - this.x) / SIDE);
                col = Math.round((cell[0].y - this.y) / SIDE);
                console.log("row: " + row + "  col: " + col);
                if(this.grid[row][col] == 0){
                    data.push([row, col]);
                }
                else {
                    return;
                }
            }
            console.log("HUE: " + data.length);
            for (let x of data) {
                this.grid[x[0]][x[1]] = 1;

            }
            piece.boardPos = data;
            row = Math.round((piece.x - this.x) / SIDE);
            col = Math.round((piece.y - this.y) / SIDE);

            piece.x = this.x + row * SIDE;
            piece.y = this.y + col * SIDE;
            document.getElementById("pos").innerHTML = "Position: " + piece.x + "  " + piece.y;
            this.pieces.push(piece);
        }

            
            //document.getElementById("row-col").innerHTML = "row: " + row + "   col: " + col;
        else {
            return;
        }
        

	}
    
    //remove the piece from board
	removePiece(piece:Piece) {

        this.pieces.splice(this.pieces.indexOf(piece), 1);
        for(let x of piece.boardPos) {
            this.grid[x[0]][x[1]] = 0;
        }


	}



    //draw the board on canvas
    draw() {
        ctx.beginPath();
		for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                
				ctx.moveTo(this.x, this.y+SIDE * j);
				ctx.lineTo(this.x+SIDE*this.columns, this.y+SIDE * j);
				ctx.stroke();

				ctx.moveTo(this.x+SIDE * i, this.y);
                ctx.lineTo(this.x+SIDE * i, this.y+SIDE * this.columns);
                ctx.stroke();
                ctx.fillStyle = "#000000";
				let left = 0;
				for (let a = 0; a < this.rows; a++) {
					for (let b = 0; b < this.columns; b += 2) {
						let startX = this.x + b * SIDE;
						if (a % 2 == 0) startX = this.x + (b + 1) * SIDE;
						ctx.fillRect(startX + left, this.y + (a * SIDE), SIDE, SIDE);
					}
				}
			}
        }
        ctx.closePath();
	}
	
}


class Game {
    
	board: Board;
	pieces: Piece[];

    constructor() {
        this.board = new Board(100,100,4, 4);
        this.pieces = [];
    }
    
    //add a piece into the game
    addPiece(piece: Piece) {
        this.pieces.push(piece);   
    }

    //draw all pieces on canvas
    drawPieces() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.board.draw();
        for (let i = this.pieces.length-1; i >= 0 ; i--) {
            this.pieces[i].draw();
            
        }
    }

    logBoard() {
        console.log("VAI: " + this.board.rows + "  ;  " + this.board.columns);
        let str: string = "";
        for (let i = 0; i < this.board.rows;i++) {
            for (let j = 0; j < this.board.columns;j++) {
                str += this.board.grid[i][j] + "  ";
             
            }

            console.log(str);
            str = "";
        }
    }

    //check if the board is complete
    isComplete() {

        for (let i = 0; i < this.board.rows; i++) {
            for (let j = 0; j < this.board.columns; j++) {
                if (this.board.grid[i][j] == 0) {
                    return false;
                }
            }
        }
        return true;
    }
}
let mousedown: boolean = false;
let lastMousePos: Point;
let activePiece: Piece;

let game = new Game();
game.addPiece(new Z(400, 10));
game.addPiece(new L(500, 10));
game.addPiece(new Z(400, 100));
game.addPiece(new L(500, 100));
game.drawPieces();


function getMouseLoc(e) {
    let mouseX, mouseY;

    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
    let mouse = new Point(mouseX, mouseY);
    //document.getElementById("text").innerHTML = mouseX + "  " + mouseY;
    return mouse;
}

canvas.addEventListener("mousedown", function (e) {
    mousedown = true;
    
    let mouse = getMouseLoc(e);
    lastMousePos = mouse;

    for (let piece of game.pieces) {
        if (pointInside(mouse, piece)) {
            activePiece = piece;
            if(game.board.pieces.indexOf(activePiece) != -1){
                game.board.removePiece(activePiece);
            }
            break;
        }
    }

});

canvas.addEventListener("mouseup", function (e) {
    mousedown = false;
    if (activePiece) {
        moveElement(game.pieces, game.pieces.indexOf(activePiece), 0);
        game.board.addPiece(activePiece);
        activePiece = null;
    }

    if(game.isComplete()){
        document.getElementById("game").innerHTML = "LEVEL COMPLETE";
    }
    
});

canvas.addEventListener("mousemove", function (e) { 

    let mouse = getMouseLoc(e);
    if (mousedown && activePiece) {
        activePiece.move(activePiece.x + (mouse.x - lastMousePos.x), activePiece.y + (mouse.y - lastMousePos.y));
    }
    else {
        for (let piece of game.pieces) {
            if (pointInside(mouse, piece)) {
                moveElement(game.pieces, game.pieces.indexOf(piece), 0);
                piece.changeColor("#FF0000");
                break;

            }
            else {
                piece.changeColor(piece.old_color);
            }
        }
    }
    lastMousePos = mouse;
    game.drawPieces();
    if (activePiece)
    activePiece.draw();
});

document.addEventListener("keydown", function (e) {

    if (e.keyCode == 70 && activePiece) {
        activePiece.flipPiece();
        game.drawPieces();
    }

    if (e.keyCode == 66){
        game.logBoard();
    }
});

