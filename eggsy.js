var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="jquery.d.ts" />
/// <reference path="jqueryui.d.ts" />
var SIDE = 40;
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');
//return a random hex color
function getRandomColor() {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 14)];
    }
    return color;
}
//Create a 2D array
function Array2D(numrows, numcols, initial) {
    var arr = [];
    for (var i = 0; i < numrows; ++i) {
        var columns = [];
        for (var j = 0; j < numcols; ++j) {
            columns[j] = initial;
        }
        arr[i] = columns;
    }
    return arr;
}
;
//move an element from an array to the given position
function moveElement(arr, oldpos, newpos) {
    var x = arr.splice(oldpos, 1)[0];
    arr.splice(newpos, 0, x);
}
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
;
function triangleArea(A, B, C) {
    return (C.x * B.y - B.x * C.y) - (C.x * A.y - A.x * C.y) + (B.x * A.y - A.x * B.y);
}
//check if a point is inside a piece
function pointInside(P, piece) {
    for (var i = 0; i < piece.cells.length; i++) {
        var A = piece.cells[i][0];
        var B = piece.cells[i][1];
        var C = piece.cells[i][2];
        var D = piece.cells[i][3];
        if (triangleArea(A, B, P) <= 0 && triangleArea(B, C, P) <= 0 && triangleArea(C, D, P) <= 0 && triangleArea(D, A, P) <= 0) {
            return true;
        }
    }
    return false;
}
var Piece = (function () {
    function Piece(x, y) {
        this.x = x;
        this.y = y;
        this.rot = 0;
        this.nr_rot = 0;
        this.nextrotation = 0;
        this.rotations = [];
        this.shape = this.rotations[this.rot];
        this.cells = [];
        this.boardPos = [];
        this.topLeft = new Point(x, y);
        this.color = getRandomColor();
        this.old_color = this.color;
    }
    //move the piece to the x,y coordinates
    Piece.prototype.move = function (x, y) {
        this.x = x;
        this.y = y;
        this.setCells();
    };
    //rotate the piece 90 degrees
    Piece.prototype.flipPiece = function () {
        if (this.rot == this.nr_rot) {
            this.rot = 0;
        }
        else {
            this.rot++;
        }
        this.shape = this.rotations[this.rot];
        return this.rotations[this.rot];
    };
    //determine the points of all 4 rectangles from the piece
    Piece.prototype.setCells = function () {
        var k = 0;
        for (var i = 0; i < this.shape.length; i++) {
            for (var j = 0; j < this.shape[i].length; j++) {
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
    };
    //change piece color
    Piece.prototype.changeColor = function (c) {
        this.color = c;
    };
    //draw the piece on the canvas
    Piece.prototype.draw = function () {
        this.setCells();
        if (canvas.getContext) {
            for (var i = 0; i < this.cells.length; i++) {
                ctx.beginPath();
                ctx.moveTo(this.cells[i][0].x, this.cells[i][0].y);
                for (var j = 0; j < this.cells[i].length; j++) {
                    ctx.lineTo(this.cells[i][j].x, this.cells[i][j].y);
                }
                ctx.lineTo(this.cells[i][0].x, this.cells[i][0].y);
                ctx.closePath();
                ctx.stroke();
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }
    };
    return Piece;
}());
var I = (function (_super) {
    __extends(I, _super);
    function I(x, y) {
        _super.call(this, x, y);
        this.x = x;
        this.y = y;
        this.nr_rot = 1;
        this.rotations = [
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
        this.shape = this.rotations[this.rot];
        this.setCells();
    }
    return I;
}(Piece));
var O = (function (_super) {
    __extends(O, _super);
    function O(x, y) {
        _super.call(this, x, y);
        this.x = x;
        this.y = y;
        this.nr_rot = 1;
        this.rotations = [
            [
                [1, 1],
                [1, 1]
            ],
            [
                [1, 1],
                [1, 1]
            ]
        ];
        this.shape = this.rotations[0];
        this.setCells();
    }
    return O;
}(Piece));
var J = (function (_super) {
    __extends(J, _super);
    function J(x, y) {
        _super.call(this, x, y);
        this.x = x;
        this.y = y;
        this.nr_rot = 3;
        this.rotations = [
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
        this.shape = this.rotations[this.rot];
        this.setCells();
    }
    return J;
}(Piece));
var L = (function (_super) {
    __extends(L, _super);
    function L(x, y) {
        _super.call(this, x, y);
        this.x = x;
        this.y = y;
        this.nr_rot = 3;
        this.rotations = [
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
        this.shape = this.rotations[this.rot];
        this.setCells();
    }
    return L;
}(Piece));
var T = (function (_super) {
    __extends(T, _super);
    function T(x, y) {
        _super.call(this, x, y);
        this.x = x;
        this.y = y;
        this.nr_rot = 3;
        this.rotations = [
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
        this.shape = this.rotations[this.rot];
        this.setCells();
    }
    return T;
}(Piece));
var S = (function (_super) {
    __extends(S, _super);
    function S(x, y) {
        _super.call(this, x, y);
        this.x = x;
        this.y = y;
        this.nr_rot = 1;
        this.rotations = [
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
        this.shape = this.rotations[this.rot];
        this.setCells();
    }
    return S;
}(Piece));
var Z = (function (_super) {
    __extends(Z, _super);
    function Z(x, y) {
        _super.call(this, x, y);
        this.x = x;
        this.y = y;
        this.nr_rot = 1;
        this.rotations = [
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
        this.shape = this.rotations[this.rot];
        this.setCells();
    }
    return Z;
}(Piece));
function logArrayElements(element, index, array) {
    console.log('a[' + index + '] = ' + element[0].x + "  " + element[0].y);
}
var Board = (function () {
    function Board(x, y, rows, columns) {
        this.x = x;
        this.y = y;
        this.rows = rows;
        this.columns = columns;
        this.pieces = [];
        this.grid = Array2D(rows, columns, 0);
    }
    //check if a piece is inside the board
    Board.prototype.isInside = function (piece) {
        var A = new Point(this.x, this.y);
        var B = new Point(this.x + this.columns * SIDE, this.y);
        var C = new Point(this.x + this.columns * SIDE, this.y + this.rows * SIDE);
        var D = new Point(this.x, this.y + this.rows * SIDE);
        var i = 0;
        for (var _i = 0, _a = piece.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            var P = new Point(cell[0].x + SIDE / 2, cell[0].y + SIDE / 2);
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
    };
    //add a piece to the board
    Board.prototype.addPiece = function (piece) {
        var data = [];
        if (this.isInside(piece)) {
            var row = void 0;
            var col = void 0;
            for (var _i = 0, _a = piece.cells; _i < _a.length; _i++) {
                var cell = _a[_i];
                row = Math.round((cell[0].x - this.x) / SIDE);
                col = Math.round((cell[0].y - this.y) / SIDE);
                console.log("row: " + row + "  col: " + col);
                if (this.grid[row][col] == 0) {
                    data.push([row, col]);
                }
                else {
                    return;
                }
            }
            console.log("HUE: " + data.length);
            for (var _b = 0, data_1 = data; _b < data_1.length; _b++) {
                var x = data_1[_b];
                this.grid[x[0]][x[1]] = 1;
            }
            piece.boardPos = data;
            row = Math.round((piece.x - this.x) / SIDE);
            col = Math.round((piece.y - this.y) / SIDE);
            piece.x = this.x + row * SIDE;
            piece.y = this.y + col * SIDE;
            this.pieces.push(piece);
        }
        else {
            return;
        }
    };
    //remove the piece from board
    Board.prototype.removePiece = function (piece) {
        this.pieces.splice(this.pieces.indexOf(piece), 1);
        for (var _i = 0, _a = piece.boardPos; _i < _a.length; _i++) {
            var x = _a[_i];
            this.grid[x[0]][x[1]] = 0;
        }
    };
    //draw the board on canvas
    Board.prototype.draw = function () {
        ctx.beginPath();
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                ctx.moveTo(this.x, this.y + SIDE * j);
                ctx.lineTo(this.x + SIDE * this.columns, this.y + SIDE * j);
                ctx.stroke();
                ctx.moveTo(this.x + SIDE * i, this.y);
                ctx.lineTo(this.x + SIDE * i, this.y + SIDE * this.columns);
                ctx.stroke();
                ctx.fillStyle = "#000000";
                var left = 0;
                for (var a = 0; a < this.rows; a++) {
                    for (var b = 0; b < this.columns; b += 2) {
                        var startX = this.x + b * SIDE;
                        if (a % 2 == 0)
                            startX = this.x + (b + 1) * SIDE;
                        ctx.fillRect(startX + left, this.y + (a * SIDE), SIDE, SIDE);
                    }
                }
            }
        }
        ctx.closePath();
    };
    return Board;
}());
var Game = (function () {
    function Game() {
        this.board = new Board(100, 100, 4, 4);
        this.pieces = [];
    }
    //add a piece into the game
    Game.prototype.addPiece = function (piece) {
        this.pieces.push(piece);
    };
    //draw all pieces on canvas
    Game.prototype.drawPieces = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.board.draw();
        for (var i = this.pieces.length - 1; i >= 0; i--) {
            this.pieces[i].draw();
        }
    };
    Game.prototype.logBoard = function () {
        console.log("VAI: " + this.board.rows + "  ;  " + this.board.columns);
        var str = "";
        for (var i = 0; i < this.board.rows; i++) {
            for (var j = 0; j < this.board.columns; j++) {
                str += this.board.grid[i][j] + "  ";
            }
            console.log(str);
            str = "";
        }
    };
    //check if the board is complete
    Game.prototype.isComplete = function () {
        for (var i = 0; i < this.board.rows; i++) {
            for (var j = 0; j < this.board.columns; j++) {
                if (this.board.grid[i][j] == 0) {
                    return false;
                }
            }
        }
        return true;
    };
    return Game;
}());
var mousedown = false;
var lastMousePos;
var activePiece;
var game = new Game();
game.addPiece(new Z(400, 10));
game.addPiece(new L(500, 10));
game.addPiece(new Z(400, 100));
game.addPiece(new L(500, 100));
game.drawPieces();
function getMouseLoc(e) {
    var mouseX, mouseY;
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
    var mouse = new Point(mouseX, mouseY);
    //document.getElementById("text").innerHTML = mouseX + "  " + mouseY;
    return mouse;
}
canvas.addEventListener("mousedown", function (e) {
    mousedown = true;
    var mouse = getMouseLoc(e);
    lastMousePos = mouse;
    for (var _i = 0, _a = game.pieces; _i < _a.length; _i++) {
        var piece = _a[_i];
        if (pointInside(mouse, piece)) {
            activePiece = piece;
            if (game.board.pieces.indexOf(activePiece) != -1) {
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
    if (game.isComplete()) {
        document.getElementById("game").innerHTML = "LEVEL COMPLETE";
    }
});
canvas.addEventListener("mousemove", function (e) {
    var mouse = getMouseLoc(e);
    if (mousedown && activePiece) {
        activePiece.move(activePiece.x + (mouse.x - lastMousePos.x), activePiece.y + (mouse.y - lastMousePos.y));
    }
    else {
        for (var _i = 0, _a = game.pieces; _i < _a.length; _i++) {
            var piece = _a[_i];
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
    if (e.keyCode == 66) {
        game.logBoard();
    }
});
//# sourceMappingURL=eggsy.js.map