var ctx;
var margin = { top: 40, left: 75, right: 80, bottom: 75 };
var chartHeight, chartWidth, yMax, xMax, data;
var maxYValue = 0, ratio = 0;
var renderType = { lines: 'lines', points: 'points' };

class Download {
    downloadListener() {
        var buttonJPG = document.getElementById('btn-jpg');
        var buttonPNG = document.getElementById('btn-png');
        
        buttonJPG.addEventListener('click', function (e) {
            var dataURL = canvas.toDataURL('image/jpg');
            buttonJPG.href = dataURL;
        });
    
        buttonPNG.addEventListener('click', function (e) {
            var dataURL = canvas.toDataURL('image/png');
            buttonPNG.href = dataURL;
        });
    }
}

class Draw extends Download {
    drawBackground(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-30, -45, xMax + margin.right, yMax + (margin.top*3.25));
        ctx.fillStyle = '#000000';
    }

    drawLine(startX, startY, endX, endY, strokeStyle, lineWidth) {
        if (strokeStyle != null) ctx.strokeStyle = strokeStyle;
        if (lineWidth != null) ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.closePath();
    }

    drawCircle(ctx, ptX, ptY) {
        ctx.beginPath();
        ctx.fillStyle = '#3498db';
        ctx.arc(ptX, ptY, 8, 0, 2 * Math.PI, false)
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';
        ctx.stroke();
        ctx.closePath();
    }
}

class CanvasChart extends Draw {
    render(canvasId, dataObj) {
        data = dataObj;
        this.getMaxDataYValue();
        var canvas = document.getElementById(canvasId);
        canvas.width = 800;
        canvas.height = 600;
        chartHeight = canvas.height;
        chartWidth = canvas.width;
        xMax = chartWidth - margin.left;
        yMax = chartHeight - (margin.top + margin.bottom);
        ratio = yMax / maxYValue;
        ctx = canvas.getContext("2d");
        // Element positioning
        ctx.translate(30, 30);
        this.renderChart(); 
        this.downloadListener();
    }

    renderChart() {
        this.drawBackground(ctx);
        this.renderText();
        this.renderLinesAndLabels();

        //render data based upon type of renderType(s) that client supplies
        if (data.renderTypes == undefined || data.renderTypes == null) data.renderTypes = [renderType.lines];
        for (var i = 0; i < data.renderTypes.length; i++) {
            this.renderData(data.renderTypes[i]);
        }
    }

    getMaxDataYValue() {
        for (var i = 0; i < data.dataPoints.length; i++) {
            if (data.dataPoints[i].y > maxYValue) maxYValue = data.dataPoints[i].y;
        }
    }

    renderText() {
        var labelFont = (data.labelFont != null) ? data.labelFont : '20pt Arial';
        ctx.font = labelFont;
        ctx.textAlign = "center";

        //Title
        var txtSize = ctx.measureText(data.title);
        ctx.fillText(data.title, (chartWidth / 2), (margin.top / 2));

        //X-axis text
        txtSize = ctx.measureText(data.xLabel);
        ctx.fillText(data.xLabel, margin.left + (xMax / 2) - (txtSize.width / 2), yMax + (margin.bottom / 1.2));

        //Y-axis text
        ctx.save();
        ctx.rotate(-Math.PI / 2);
        ctx.font = labelFont;
        ctx.fillText(data.yLabel, (yMax / 2) * -1, margin.left / 4);
        ctx.restore();
    }

    renderLinesAndLabels() {
        //Vertical guide lines
        var yInc = yMax / data.dataPoints.length;
        var yPos = 0;
        var xInc = this.getXInc();
        var xPos = margin.left;
        for (var i = 0; i < data.dataPoints.length; i++) {
            yPos += (i == 0) ? margin.top : yInc;
            //Draw horizontal lines

            //Dont draw help horizontal lines if last range value is close to 0 point
            if(yPos<440){
                this.drawLine(margin.left, yPos, xMax+21, yPos, '#E8E8E8');
            }
            //y axis labels
            ctx.font = (data.dataPointFont != null) ? data.dataPointFont : '10pt Calibri';
            var txt = Math.round(maxYValue - ((i == 0) ? 0 : yPos / ratio));
            var txtSize = ctx.measureText(txt);

            //Dont draw y axis numbers if last range value is close to 0 point or negative value
            if(!String(txt).includes('-') && txt != 0){
                ctx.fillText(txt, margin.left - ((txtSize.width >= 14)?txtSize.width:10) - 7, yPos + 4);
            } 
            
            //x axis labels
            txt = data.dataPoints[i].x;
            txtSize = ctx.measureText(txt);
            ctx.fillText(txt, xPos, yMax + (margin.bottom / 3));
            xPos += xInc;
        }

        //Vertical line
        this.drawLine(margin.left, margin.top, margin.left, yMax, 'black');

        //Horizontal Line
        this.drawLine(margin.left, yMax, xMax+21, yMax, 'black');
    }
    
    renderData(type) {
        var xInc = this.getXInc();
        var prevX = 0, 
        prevY = 0;

        for (var i = 0; i < data.dataPoints.length; i++) {
            var pt = data.dataPoints[i];
            var ptY = (maxYValue - pt.y) * ratio;
            if (ptY < margin.top) ptY = margin.top;
            var ptX = (i * xInc) + margin.left;

            if (i > 0 && type == renderType.lines) {
                //Draw connecting lines
                this.drawLine(ptX, ptY, prevX, prevY, 'black', 2);
            }

            if (type == renderType.points) {
                this.drawCircle(ctx, ptX, ptY);
            }

            prevX = ptX;
            prevY = ptY;
        }
    }

    getXInc() {
        return Math.round(xMax / data.dataPoints.length) - 1;
    }
}
