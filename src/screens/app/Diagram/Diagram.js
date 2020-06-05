import React, {useLayoutEffect, useRef, useState} from 'react';
import C2S from 'canvas2svg';
import fileDownload from 'js-file-download';

import { useSelector } from 'react-redux';
import {
    Card,
    Button
} from 'react-bootstrap';
import findIndex from 'lodash/findIndex';
import { Icon } from '../../../components/Icon';

const Point = function (x, y) {
    this.x = x;
    this.y = y;
};

const getArrowEnds = (c1, c2, r) => {
    const { x: x1, y: y1 } = c1;
    const { x: x2, y: y2 } = c2;

    if(x1 === x2 && y1 === y2) {
        return [0, 0]
    }

    const length = Math.sqrt(Math.pow((x1-x2), 2)+Math.pow((y2-y1), 2));
    const a = x1 - r * (x1 - x2) / length;
    const b = y1 - r * (y1 - y2) / length;

    return new Point(a, b);
}

const getArrowPoints = (c1, c2, r) => {
    return [getArrowEnds(c1, c2, r), getArrowEnds(c2, c1, r)]
}


const Diagram = () => {

    const [pixelRatio, setPixelRatio] = useState(window.devicePixelRatio)
    const [width, setWidth] = useState(800)
    const [height, setHight] = useState(800);
    const [polygonRadius, setPloyonRadius] = useState(250)
    const [circleRadius, setCircleRadius] = useState(50);

    const stakeholders = useSelector(
        state => state.app.stakeholderState.stakeholders.list,
    );
    const connections = useSelector(
        state => state.app.connectionState.connections.list,
    );
    const projects = useSelector(
        state => state.app.projectState.projects.list,
    );

    const canvas = useRef(null);

    useLayoutEffect(() => {
        const ctx = canvas.current.getContext("2d");
        drawDiagram(ctx);
    });

    const drawDiagram = (ctx) => {
        ctx.clearRect(0, 0, width, height);
        drawStandard(ctx);
        if (projects.length) {
            drawProjectName(ctx);
        }

        if (!!stakeholders.length && !!connections.length) {
            const circleCenters = makePoints(width / 2, width / 2, polygonRadius, stakeholders.length, 0);

            circleCenters.forEach((center, index) => {
                drawCircle(ctx, center.x, center.y);
                ctx.font = "14px Barlow";
                ctx.textAlign = 'center';
                ctx.fillStyle = "white";
                ctx.fillText(stakeholders[index].name, center.x, center.y);
            })

            connections.forEach((con) => {
                const [startPoint, endPoint] = getArrowPoints(
                    circleCenters[findIndex(stakeholders, { _id: con.from._id })],
                    circleCenters[findIndex(stakeholders, { _id: con.to._id })],
                    circleRadius + 5
                )
                const Arrow = {
                    startPoint,
                    endPoint,
                    arrowColor: con.type === 'influence' ? 'red' : con.type === 'funding' ? 'orange' : '#8FC3FF'
                }
                drawArrow(ctx, Arrow.startPoint.x, Arrow.startPoint.y, Arrow.endPoint.x, Arrow.endPoint.y, 4, 1, 26, 10, Arrow.arrowColor, 4);
            })
        }
    }

    const drawStandard = (ctx) => {

        ctx.font = '14px Barlow';
        ctx.fillStyle = 'orange';
        ctx.fillText('Funding', 30, 15);
        ctx.fillStyle = '#8FC3FF';
        ctx.fillText('Data', 30, 40);
        ctx.fillStyle = 'red';
        ctx.fillText('Influence', 30, 65);

        drawArrow(ctx, 80, 10, 120, 10, 4, 1, 26, 10, 'orange', 4);
        drawArrow(ctx, 80, 35, 120, 35, 4, 1, 26, 10, '#8FC3FF', 4);
        drawArrow(ctx, 80, 60, 120, 60, 4, 1, 26, 10, 'red', 4);
    }

    const drawProjectName = (ctx) => {
        ctx.font = '18px Barlow';
        ctx.fillStyle = '#312975';
        ctx.fillText(projects[0].name, width-150, 30);
    }

    const makePoints = (centerX, centerY, radius, sides, startingAngle) => {
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

    const drawCircle = (ctx, x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#312975';
        ctx.fill();
        ctx.strokeStyle = '#312975';
        ctx.stroke();
    }

    // draw arrow
    const drawArrow = (ctx, x1, y1, x2, y2, style, which, angle, d, color, width) => {
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
            case 3:{
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

    const dw = Math.floor(pixelRatio * width);
    const dh = Math.floor(pixelRatio * height);
    const style = { width, height };

    const exportPNG = () => {
        let downloadLink = document.createElement('a');
        downloadLink.setAttribute('download', `output-${Date.now()}.png`);
        const canvas = document.getElementById('diagram');
        let dataURL = canvas.toDataURL('image/png');
        let url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
        downloadLink.setAttribute('href', url);
        downloadLink.click();
    }

    const exportSVG = () => {
        const ctx = new C2S(dw, dh);
        drawDiagram(ctx);
        const svg = ctx.getSerializedSvg(true);
        console.log(svg)
        fileDownload(svg, `output-${Date.now()}.svg`)
    }

    return (
        <Card className="bg-light mt-5 px-5 position-relative">
            <Card.Body>

                <a
                    href="#"
                    className="position-absolute"
                    style={{
                        "top": "15px",
                        "right": "20px",
                        "fontSize": "22px",
                        "color": "#312975"
                    }}
                >
                    <Icon name="question-circle" />
                </a>

                <canvas id="diagram" ref={canvas} width={dw} height={dh} style={style} />
                <Button onClick={exportPNG} letiant="info" className="pull-left mr-3">Export PNG</Button>
                <Button onClick={exportSVG} letiant="info" className="pull-left">Export SVG</Button>
            </Card.Body>
        </Card>
    )
}

export { Diagram };