import React, {useLayoutEffect, useRef, useState} from 'react';
import C2S from 'canvas2svg';
import fileDownload from 'js-file-download';
import { useSelector } from 'react-redux';
import {
    Card,
    Button,
    OverlayTrigger,
    Popover
} from 'react-bootstrap';
import findIndex from 'lodash/findIndex';
import { Icon } from '../../../components/Icon';
import { makePoints, getArrowPoints, drawArrow, responsiveText } from './util';

const Diagram = () => {

    const [pixelRatio, setPixelRatio] = useState(window.devicePixelRatio)
    const [width, setWidth] = useState(800)
    const [height, setHeight] = useState(800);
    const [polygonRadius, setPloyonRadius] = useState(250)
    const [circleRadius, setCircleRadius] = useState(70);
    const canvas = useRef(null);
    const cardRef = useRef(null);

    const stakeholders = useSelector(
        state => state.app.stakeholderState.stakeholders.list,
    );
    const connections = useSelector(
        state => state.app.connectionState.connections.list,
    );
    const projects = useSelector(
        state => state.app.projectState.projects.list,
    );

    useLayoutEffect(() => {
        const ctx = canvas.current.getContext("2d");
        drawDiagram(ctx);
        if(cardRef.current) {
            const cardWidth = cardRef.current.offsetWidth;
            const canvasWidth = cardWidth;
            setWidth(canvasWidth);
            setHeight(canvasWidth)
            setPloyonRadius(canvasWidth/2*0.7)
        }
    });

    const drawDiagram = (ctx) => {
        ctx.clearRect(0, 0, width, height);
        drawStandard(ctx);
        if (projects.length) {
            drawProjectName(ctx);
        }

        if (!!stakeholders.length && !!connections.length) {
            const circleCenters = makePoints(width / 2-40, height / 2-40, polygonRadius, stakeholders.length, 0);

            circleCenters.forEach((center, index) => {
                drawCircle(ctx, center.x, center.y);
                ctx.font = '20px Barlow';
                ctx.textAlign = 'center';
                ctx.fillStyle = 'black';
                const text = stakeholders[index].name.length > 10 ? stakeholders[index].name.slice(0, 10) + '...' : stakeholders[index].name;
                ctx.fillText(text, center.x, center.y);
            })
            const rearrangedConnections = rearrangeConnection(connections);
            rearrangedConnections.forEach((con) => {
                if ((findIndex(stakeholders, { _id: con.from._id }) >= 0) && (findIndex(stakeholders, { _id: con.to._id })) >= 0) {
                    const [startPoint, endPoint] = getArrowPoints(
                        circleCenters[findIndex(stakeholders, { _id: con.from._id })],
                        circleCenters[findIndex(stakeholders, { _id: con.to._id })],
                        circleRadius + 5,
                        con.repeated
                    )
                    const Arrow = {
                        startPoint,
                        endPoint,
                        arrowColor: con.type === 'influence' ? 'red' : con.type === 'funding' ? 'orange' : '#8FC3FF'
                    }
                    drawArrow(ctx, Arrow.startPoint.x, Arrow.startPoint.y, Arrow.endPoint.x, Arrow.endPoint.y, 3, 1, 50, 25, Arrow.arrowColor, 5);
                } 
            })
        }
    }

    const rearrangeConnection = connections => {
        const others = connections.map(con => ({...con, repeated: 0}))
        return others.map(connection => {
            for(let i = 0; i < others.length; i+=1) {
                if (
                    ((others[i].from._id === connection.from._id) && (others[i].to._id === connection.to._id) && (others[i].repeated >= connection.repeated))
                    || ((others[i].to._id === connection.from._id) && (others[i].from._id === connection.to._id) && (others[i].repeated >= connection.repeated))
                ) {
                    connection.repeated ++;
                }
            }
            return connection;
        })
    }

    const drawStandard = (ctx) => {

        ctx.font = '18px Barlow';
        ctx.fillStyle = 'orange';
        ctx.fillText('Funding', 50, 15);
        ctx.fillStyle = '#8FC3FF';
        ctx.fillText('Data', 50, 40);
        ctx.fillStyle = 'red';
        ctx.fillText('Influence', 50, 65);

        drawArrow(ctx, 100, 10, 150, 10, 3, 1, 50, 20, 'orange', 4);
        drawArrow(ctx, 100, 35, 150, 35, 3, 1, 50, 20, '#8FC3FF', 4);
        drawArrow(ctx, 100, 60, 150, 60, 3, 1, 50, 20, 'red', 4);
    }

    const drawProjectName = (ctx) => {
        ctx.font = 'bolder 30px Barlow';
        ctx.fillStyle = '#312975';
        ctx.fillText(projects[0].name, width/2, 30);
    }

    const drawCircle = (ctx, x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#f3ece1';
        ctx.fill();
        ctx.strokeStyle = '#f3ece1';
        ctx.stroke();
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
            <Card.Body ref={cardRef}>
        
                <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    overlay={
                        <Popover id={`popover-positioned-buttom`}>
                            <Popover.Title as="h3">Digram!</Popover.Title>
                            <Popover.Content>
                                This is a Diagram showing the relationship between stakeholders.
                            </Popover.Content>
                        </Popover>
                    }
                >
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
                </OverlayTrigger>

                <canvas id="diagram" ref={canvas} width={width} height={height}/>
                <Button onClick={exportPNG} letiant="info" className="pull-left mr-3">Export PNG</Button>
                <Button onClick={exportSVG} letiant="info" className="pull-left">Export SVG</Button>
            </Card.Body>
        </Card>
    )
}

export { Diagram };