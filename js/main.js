const scratchCard = document.getElementById('scratch-card');
let imgSrc;

// 生成 0 到 1 之間的隨機數
const randomNumber = Math.random();

// 根據機率選擇底圖
if (randomNumber < 0.1) {
    imgSrc = './images/background-o.jpg'; // 底圖一
} else {
    imgSrc = './images/background-x.jpg'; // 底圖二
}

scratchCard.style.backgroundImage = `url('${imgSrc}')`;


const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = './images/scratch-off.jpg'; // The scratch-off image
img.onload = function() {
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height); // 計算縮放比例
    const newWidth = img.width * scale;
    const newHeight = img.height * scale;
    ctx.drawImage(img, 0, 0, newWidth, newHeight); 
};

let isDrawing = false;
let pixelsFilled = 0; // 記錄刮開得像素數量
const threshold = 0.6; // 整張清空的比例


function scratchOff(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (e.touches) { // 觸摸事件
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else { // 滑鼠事件
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // 更新刮開的像素
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    pixelsFilled = 0;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) {
            pixelsFilled++;
        }
    }
    
    // 判斷是否達到清空設定值
    if (pixelsFilled / (canvas.width * canvas.height) >= threshold) {
        clearCanvas();
    }
}

function startDrawing(e) {
    isDrawing = true;
    scratchOff(e);
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空塗層
    pixelsFilled = 0; 
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', scratchOff);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    startDrawing(e.touches[0]);
});
canvas.addEventListener('touchmove', scratchOff);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);