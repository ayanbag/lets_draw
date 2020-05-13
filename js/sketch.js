




let sketchRNN;
let currentStroke;
let x, y;
let nextPen = 'down';
let seedPath = [];
let seedPoints = [];
let personDrawing = false;
let model_sel='book';
let de = 'everything';



function preload(id) {

  if(id==null){
    model_sel=de
    console.log("Model: "+model_sel+" is loaded");
  } else {
    model_sel=document.getElementById(id).value
    console.log("Model: "+model_sel+" is loaded");
  }
  
  sketchRNN = ml5.sketchRNN(model_sel);
  notif("Model: "+model_sel.bold()+" is loaded","success");
}

function startDrawing() {
  personDrawing = true;
  x = mouseX;
  y = mouseY;

}

function sketchRNNStart() {
  personDrawing = false;

  // RDP Line Simplication
  const rdpPoints = [];
  const total = seedPoints.length;
  const start = seedPoints[0];
  const end = seedPoints[total - 1];
  rdpPoints.push(start);
  rdp(0, total - 1, seedPoints, rdpPoints);
  rdpPoints.push(end);
  
  background(255);
  stroke(0);
  strokeWeight(4);
  beginShape();
  noFill();
  for (let v of rdpPoints) {
    vertex(v.x, v.y); 
  }
  endShape();
  
  x = rdpPoints[rdpPoints.length-1].x;
  y = rdpPoints[rdpPoints.length-1].y;
  
  
  seedPath = [];
  for (let i = 1; i < rdpPoints.length; i++) {
    let strokePath = {
      dx: rdpPoints[i].x - rdpPoints[i-1].x,
      dy: rdpPoints[i].y - rdpPoints[i-1].y,
      pen: 'down'
    }
   
    seedPath.push(strokePath);
  }
  
  
  
  
  sketchRNN.generate(seedPath, gotStrokePath);
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.mousePressed(startDrawing);
  canvas.mouseReleased(sketchRNNStart);
  background(255);
  console.log('model loaded'); 
}


function gotStrokePath(error, strokePath) {
  currentStroke = strokePath;
}

function draw() {
  stroke(0);
  strokeWeight(4);
  if (personDrawing) {
    line(mouseX, mouseY, pmouseX, pmouseY);
    seedPoints.push(createVector(mouseX, mouseY));
  }

  if (currentStroke) {

    if (nextPen == 'end') {
      sketchRNN.reset();
      sketchRNNStart();
      currentStroke = null;
      nextPen = 'down';
      return;
    }

    if (nextPen == 'down') {
      line(x, y, x + currentStroke.dx, y + currentStroke.dy);
    }
    x += currentStroke.dx;
    y += currentStroke.dy;
    nextPen = currentStroke.pen;
    currentStroke = null;
    sketchRNN.generate(gotStrokePath);

  }


}



//Notification
function notif(mod,ty) {
  window.notificationService.notify({
       title: 'Alert',
      text: mod,
      type: ty,              // 'success', 'warning', 'error'
      position: 'bottom-right',    // 'top-right', 'bottom-right', 'top-left', 'bottom-left'
      autoClose: true,
      duration: 5000,
      showRemoveButton: false
    })   
}