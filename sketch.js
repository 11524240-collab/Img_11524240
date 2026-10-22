// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://11524240-collab.github.io/Img_11524240/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(320, 320);
  // Create the video
  var constraints = {
    audio: false,
    video: {
      facingMode: "environment" 
    }
  };

  video = createCapture(constraints);
  video.size(320, 320);
  video.hide();
  
  // 🔴 刪除了原本在這裡會導致報錯的 flippedVideo = ml5.flipImage(video)
  
  // Start classifying
  classifyVideo();
}

function draw() {
  background(0);
  
  // 🟢 加上判斷式：確保鏡頭影像處理好之後才畫出來
  if (flippedVideo) {
    image(flippedVideo, 0, 0);
  }
  
  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
  // 🟢 檢查 video 是否已經加載完成（寬度大於0），避免提早翻轉發生錯誤
  if (video.width > 0) {
    flippedVideo = ml5.flipImage(video);
    classifier.classify(flippedVideo, gotResult);
  } else {
    // 如果還沒準備好，100毫秒後再試一次
    setTimeout(classifyVideo, 100);
  }
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  label = results[0].label;
  // Classifiy again!
  classifyVideo();
}
