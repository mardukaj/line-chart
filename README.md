# line-chart

In this example project i have created a library for drawing line charts on X, Y axes. 
Also i have made a live example for line chart project.

- chart.html - Displays line chart example. Inside of this file you can insert your data for generating new charts.
- scripts/canvasChart.js - In this file i have written the code for creating line chart.

To edit line chart you can change data inside of chart.html file.

Example of Data model:

<pre>
  var dataDef = { 
    title: "Working hours",
    xLabel: 'Days', 
    yLabel: 'Hours',
    labelFont: '19pt Arial', 
    dataPointFont: '10pt Arial',
    renderTypes: [renderType.lines, renderType.points],
    dataPoints: [
      { x: '1', y: 11 },
      { x: '2', y: 12 },
      { x: '3', y: 6 },
      { x: '5', y: 11 },
      { x: '8', y: 7 },
      { x: '9', y: 14 },
      { x: '11', y: 9 },
      { x: '12', y: 12 },
      { x: '14', y: 12 },
      { x: '15', y: 5 },
    ]
  };   
</pre>

-----------------------

2. Take any OOP language and create mini graphs (charts) library that is able to draw basic bar chart on X, Y axes. Create another chart type - line as just different visual representation for distinct values. 
Notes:
Demonstrate usage of OOP with classes, inheritance etc
Use any library for image drawing and generation that works with your language of choice. Result of your program might be JPG, PNG... image. Do not use existing graph libraries 

-----------------
