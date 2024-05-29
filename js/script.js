class Shape {
    constructor(type, color) {
        this.type = type;
        this.color = color;
    }
}

class Line extends Shape {
    constructor(startX, startY, endX, endY, color) {
        super('line', color);
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.startX, this.startY);
        context.lineTo(this.endX, this.endY);
        context.strokeStyle = this.color;
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.stroke();
    }

    static drawIcon(context) {
        context.beginPath();
        context.moveTo(10, 40);
        context.lineTo(40, 10);
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.stroke();
    }
}

class Rectangle extends Shape {
    constructor(startX, startY, width, height, color) {
        super('rectangle', color);
        this.startX = startX;
        this.startY = startY;
        this.width = width;
        this.height = height;
    }

    draw(context) {
        context.beginPath();
        context.rect(this.startX, this.startY, this.width, this.height);
        context.strokeStyle = this.color;
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.stroke();
    }

    static drawIcon(context) {
        context.beginPath();
        context.rect(10, 10, 30, 30);
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.stroke();
    }
}

class Circle extends Shape {
    constructor(centerX, centerY, radius, color) {
        super('circle', color);
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        context.strokeStyle = this.color;
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.stroke();
    }

    static drawIcon(context) {
        context.beginPath();
        context.arc(25, 25, 15, 0, 2 * Math.PI);
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.stroke();
    }
}

class Pencil extends Shape {
    constructor(color) {
        super('pencil', color);
        this.points = [];
    }

    addPoint(x, y) {
        this.points.push({ x, y });
    }

    draw(context) {
        context.beginPath();
        for (let i = 0; i < this.points.length - 1; i++) {
            context.moveTo(this.points[i].x, this.points[i].y);
            context.lineTo(this.points[i + 1].x, this.points[i + 1].y);
        }
        context.strokeStyle = this.color;
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.stroke();
    }

    static drawIcon(context) {
        context.beginPath();
        context.moveTo(10, 10);
        context.lineTo(20, 20);
        context.lineTo(30, 10);
        context.lineTo(40, 20);
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.stroke();
    }
}

class CanvasApp {
    constructor() {
        this.canvas = document.getElementById('paintCanvas');
        this.context = this.canvas.getContext('2d');
        this.shapes = [];
        this.isDrawing = false;
        this.currentShape = null;
        this.shapeType = 'line';
        this.color = document.getElementById('color').value;

        this.setupListeners();
        this.drawFigureIcons();
    }

    setupListeners() {
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.getElementById('color').addEventListener('input', this.onColorChange.bind(this));
        document.getElementById('clearCanvasBtn').addEventListener('click', this.clearCanvas.bind(this));

        document.querySelectorAll('.figure').forEach(figure => {
            figure.addEventListener('click', () => {
                this.shapeType = figure.getAttribute('data-shape');
                document.querySelectorAll('.figure').forEach(f => f.classList.remove('selected'));
                figure.classList.add('selected');
                document.getElementById('selectedShapeName').textContent = this.shapeType.charAt(0).toUpperCase() + this.shapeType.slice(1);
                this.drawShapePreview();
            });
        });
    }

    drawFigureIcons() {
        document.querySelectorAll('.figure').forEach(figure => {
            const context = figure.getContext('2d');
            switch (figure.getAttribute('data-shape')) {
                case 'line':
                    Line.drawIcon(context);
                    break;
                case 'rectangle':
                    Rectangle.drawIcon(context);
                    break;
                case 'circle':
                    Circle.drawIcon(context);
                    break;
                case 'pencil':
                    Pencil.drawIcon(context);
                    break;
            }
        });
    }

    onMouseDown(e) {
        this.isDrawing = true;
        const x = e.clientX - this.canvas.offsetLeft;
        const y = e.clientY - this.canvas.offsetTop;

        if (this.shapeType === 'pencil') {
            this.currentShape = new Pencil(this.color);
            this.currentShape.addPoint(x, y);
        } else {
            this.startX = x;
            this.startY = y;
        }
    }

    onMouseMove(e) {
        if (!this.isDrawing) return;
        const x = e.clientX - this.canvas.offsetLeft;
        const y = e.clientY - this.canvas.offsetTop;

        if (this.shapeType === 'pencil' && this.currentShape) {
            this.currentShape.addPoint(x, y);
            this.redraw();
        } else {
            this.redraw();
            this.context.strokeStyle = this.color;
            this.context.lineWidth = 5;
            this.context.lineCap = 'round';
            if (this.shapeType === 'line') {
                this.context.beginPath();
                this.context.moveTo(this.startX, this.startY);
                this.context.lineTo(x, y);
                this.context.stroke();
            } else if (this.shapeType === 'rectangle') {
                this.context.beginPath();
                this.context.rect(this.startX, this.startY, x - this.startX, y - this.startY);
                this.context.stroke();
            } else if (this.shapeType === 'circle') {
                const radius = Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2));
                this.context.beginPath();
                this.context.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
                this.context.stroke();
            }
        }
    }

    onMouseUp(e) {
        this.isDrawing = false;
        const x = e.clientX - this.canvas.offsetLeft;
        const y = e.clientY - this.canvas.offsetTop;

        if (this.shapeType === 'line') {
            this.shapes.push(new Line(this.startX, this.startY, x, y, this.color));
        } else if (this.shapeType === 'rectangle') {
            this.shapes.push(new Rectangle(this.startX, this.startY, x - this.startX, y - this.startY, this.color));
        } else if (this.shapeType === 'circle') {
            const radius = Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2));
            this.shapes.push(new Circle(this.startX, this.startY, radius, this.color));
        } else if (this.shapeType === 'pencil' && this.currentShape) {
            this.shapes.push(this.currentShape);
        }
        this.currentShape = null;
        this.redraw();
    }

    onColorChange(e) {
        this.color = e.target.value;
        this.drawShapePreview();
    }

    clearCanvas() {
        this.shapes = [];
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    redraw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.shapes.forEach(shape => shape.draw(this.context));
    }

    drawShapePreview() {
        const previewCanvas = document.getElementById('shapePreviewCanvas');
        const previewContext = previewCanvas.getContext('2d');
        previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

        previewContext.strokeStyle = this.color;
        previewContext.lineWidth = 5;
        previewContext.lineCap = 'round';

        previewContext.beginPath();
        if (this.shapeType === 'line') {
            previewContext.moveTo(10, 10);
            previewContext.lineTo(40, 40);
        } else if (this.shapeType === 'rectangle') {
            previewContext.rect(10, 10, 30, 30);
        } else if (this.shapeType === 'circle') {
            previewContext.arc(25, 25, 15, 0, 2 * Math.PI);
        } else if (this.shapeType === 'pencil') {
            previewContext.moveTo(10, 10);
            previewContext.lineTo(20, 20);
            previewContext.lineTo(30, 10);
            previewContext.lineTo(40, 20);
        }
        previewContext.stroke();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CanvasApp();
});