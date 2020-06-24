export const Point = function (x, y) {
    this.x = x;
    this.y = y;
};

export const getArrowEnds = (c1, c2, r, distance) => {    

    const { x: x1, y: y1 } = c1;
    const { x: x2, y: y2 } = c2;

    
    if (x1 === x2 && y1 === y2) {
        return [0, 0]
    }

    const length = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y2 - y1), 2));
    let a = r * (x1 - x2) / length;
    let b = r * (y1 - y2) / length;
    let [c, d] = getAnotherPoint(a, b, distance);
    
    const m = x1-c;
    const n = y1-d;

    return new Point(m, n);
}

const getAnotherPoint = (a, b, k) => {
    if(k === 0) {
        return [a, b]
    }
    const e = b * k / a;
    const c = ((b*k/e)* Math.sqrt(Math.pow(e,2)/Math.pow(k,2)+1)-e) / Math.sqrt(Math.pow(e,2)/Math.pow(k, 2) +1);
    let d;
    if (k>0) {
        d = Math.sqrt(Math.pow(e, 2) + Math.pow(k, 2)) + (c * e) / k;
    } else {
        d = (c * e) / k - Math.sqrt(Math.pow(e, 2) + Math.pow(k, 2));
    }
    return [c, d];
}

export const getArrowPoints = (c1, c2, r, repeatTime) => {
    let distance
    if(repeatTime % 2) { 
        distance = -10 * (Math.floor(repeatTime/2));
    } else {
        distance = 10 * (Math.floor(repeatTime/2));
    }
    return [getArrowEnds(c1, c2, r, distance), getArrowEnds(c2, c1, r, distance)]
}

export const makePoints = (centerX, centerY, radius, sides, startingAngle) => {
    let points = [],
        angle = startingAngle;

    for (let i = 0; i < sides; i++) {
        // console.log(angle * (180/Math.PI)); // => radians
        points.push(new Point(centerX + radius * Math.sin(angle),
            centerY - radius * Math.cos(angle)));
        angle += 2 * Math.PI / sides;
    }

    return points;
}

// draw arrow
export const drawArrow = (ctx, x1, y1, x2, y2, style, which, angle, d, color, width) => {
    if (typeof (x1) === 'string') {
        x1 = parseInt(x1);
    }
    if (typeof (y1) === 'string') {
        y1 = parseInt(y1);
    }
    if (typeof (x2) === 'string') {
        x2 = parseInt(x2);
    }
    if (typeof (y2) === 'string') {
        y2 = parseInt(y2);
    }
    style = typeof (style) != 'undefined' ? style : 3;
    which = typeof (which) != 'undefined' ? which : 1;
    angle = typeof (angle) != 'undefined' ? angle : Math.PI / 9;
    d = typeof (d) != 'undefined' ? d : 10;
    color = typeof (color) != 'undefined' ? color : '#000';
    width = typeof (width) != 'undefined' ? width : 1;
    let toDrawHead = typeof (style) != 'function' ? drawHead : style;
    let dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    let ratio = (dist - d / 3) / dist;
    let tox, toy, fromx, fromy;
    if (which & 1) {
        tox = Math.round(x1 + (x2 - x1) * ratio);
        toy = Math.round(y1 + (y2 - y1) * ratio);
    } else {
        tox = x2;
        toy = y2;
    }

    if (which & 2) {
        fromx = x1 + (x2 - x1) * (1 - ratio);
        fromy = y1 + (y2 - y1) * (1 - ratio);
    } else {
        fromx = x1;
        fromy = y1;
    }

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    let lineangle = Math.atan2(y2 - y1, x2 - x1);
    let h = Math.abs(d / Math.cos(angle));
    if (which & 1) {
        let angle1 = lineangle + Math.PI + angle;
        let topx = x2 + Math.cos(angle1) * h;
        let topy = y2 + Math.sin(angle1) * h;
        let angle2 = lineangle + Math.PI - angle;
        let botx = x2 + Math.cos(angle2) * h;
        let boty = y2 + Math.sin(angle2) * h;
        toDrawHead(ctx, topx, topy, x2, y2, botx, boty, style, color, width);
    }

    if (which & 2) {
        let angle1 = lineangle + angle;
        let topx = x1 + Math.cos(angle1) * h;
        let topy = y1 + Math.sin(angle1) * h;
        let angle2 = lineangle - angle;
        let botx = x1 + Math.cos(angle2) * h;
        let boty = y1 + Math.sin(angle2) * h;
        toDrawHead(ctx, topx, topy, x1, y1, botx, boty, style, color, width);
    }
}

// Draw arrow head
const drawHead = (ctx, x0, y0, x1, y1, x2, y2, style, color, width) => {
    if (typeof (x0) === 'string') {
        x0 = parseInt(x0);
    }
    if (typeof (y0) === 'string') {
        y0 = parseInt(y0);
    }
    if (typeof (x1) === 'string') {
        x1 = parseInt(x1);
    }
    if (typeof (y1) === 'string') {
        y1 = parseInt(y1);
    }
    if (typeof (x2) === 'string') {
        x2 = parseInt(x2);
    }
    if (typeof (y2) === 'string') {
        y2 = parseInt(y2);
    }

    let radius = 3,
        twoPI = 2 * Math.PI;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);

    switch (style) {
        case 0: {
            let backdist = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
            ctx.arcTo(x1, y1, x0, y0, .55 * backdist);
            ctx.fill();
            break;
        }
        case 1: {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x0, y0);
            ctx.fill();
            break;
        }
        case 2: {
            ctx.stroke();
            break;
        }
        case 3: {
            let cpx = (x0 + x1 + x2) / 3;
            let cpy = (y0 + y1 + y2) / 3;
            ctx.quadraticCurveTo(cpx, cpy, x0, y0);
            ctx.fill();
            break;
        }
        case 4: {
            let cp1x, cp1y, cp2x, cp2y, backdist;
            let shiftamt = 5;
            if (x2 === x0) {
                backdist = y2 - y0;
                cp1x = (x1 + x0) / 2;
                cp2x = (x1 + x0) / 2;
                cp1y = y1 + backdist / shiftamt;
                cp2y = y1 - backdist / shiftamt;
            } else {
                backdist = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
                let xback = (x0 + x2) / 2;
                let yback = (y0 + y2) / 2;
                let xmid = (xback + x1) / 2;
                let ymid = (yback + y1) / 2;
                let m = (y2 - y0) / (x2 - x0);
                let dx = (backdist / (2 * Math.sqrt(m * m + 1))) / shiftamt;
                let dy = m * dx;
                cp1x = xmid - dx;
                cp1y = ymid - dy;
                cp2x = xmid + dx;
                cp2y = ymid + dy;
            }
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x0, y0);
            ctx.fill();
            break;
        }
        default:
            break;
    }
    ctx.restore();
}

export const getFontInfo = (text, radius) => {
    const textArray = [];

    textArray.push(`${text.slice(0, 10)}`);
    if(text.length >= 20) {
        textArray.push(`${text.slice(10, 20)}`);
    }    
    if ((text.length < 20) && (text.length >= 10)) {
        textArray.push(`${text.slice(10, 20)}`);
    }    
    if ((text.length < 30) && (text.length >= 20)) {
        textArray.push(`${text.slice(20, 30)}`);
    }
    if (text.length >= 30) {
        textArray.push(`${text.slice(20, 30)}...`);
    }

    const fontSize = radius * 2 / 6;
    return [textArray, fontSize];
}

