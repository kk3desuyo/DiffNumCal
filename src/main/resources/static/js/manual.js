
const MAX_PREVIEW_HEIGHT = 800;
// 画像読み込みと表示
function loadImage(obj) {
    if (obj.files.length > 0) {
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            var previewCanvas = document.getElementById("imgPreview");
            var drawingCanvas = document.getElementById("drawing-canvas");
            previewCanvas.innerHTML = ''; // 以前の画像をクリア
            var ctx = previewCanvas.getContext("2d");
            var img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                var graph = document.getElementById('graph');

                console.log(graph.clientWidth,graph.clientHeight)
                // 画像のロードが完了したら、canvasのサイズを親要素に合わせて設定
                previewCanvas.width = graph.clientWidth - 20; // paddingを除外した幅
                previewCanvas.height = window.innerHeight * 0.6; // 4割をグラフ表示

                drawingCanvas.width = graph.clientWidth - 20; // paddingを除外した幅
                drawingCanvas.height = window.innerHeight * 0.6;

                graph.style.height = (previewCanvas.height+ 60) + 'px';
                console.log('グラフサイズ: ' + graph.style.height);

                // アスペクト比を無視して、canvas全体に画像をフィットさせる
                ctx.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);


                // スライダーの初期化
                sliderInit(previewCanvas.height, previewCanvas.width);
            };
            img.style.maxWidth = "100%"; // 画像サイズを適切に調整

            // 削除ボタンの追加
            var rmBtn = document.createElement("button");
            rmBtn.textContent = "削除";
            rmBtn.addEventListener('click', function() {
                previewCanvas.innerHTML = ''; // 画像をDOMから削除
                var demoImage = document.querySelector('.demo-img');
                if (demoImage) {
                    demoImage.style.display = 'block'; // デモ画像を再表示
                }
            });
            previewCanvas.appendChild(rmBtn);
        };
        fileReader.readAsDataURL(obj.files[0]);
    }
}

// デモ画像の非表示
function hideDemoImage() {
    var demoImage = document.querySelector('.demo-img');
    if (demoImage) {
        demoImage.style.display = 'none';
    }
}

// 画像クリック時に座標を取得
function imageClicked(event) {
    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log('Clicked position: X=' + x + ', Y=' + y);
}


var minMemoryX = -1;
var minMemoryY = -1;
var maxMemoryX = -1;
var maxMemoryY = -1;
var finalX = -10000;
var finalY = -100000;

//サニタイズ
function sanitize(input) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return input.replace(/[&<>"']/g, function(m) { return map[m]; });
}

//差枚数計算
function diffNumCal() {
    //スライダーが動かされていない時のアラート
    if(minMemoryY === maxMemoryY){
        alert('スライダーを動かしてください。')
        return;
    }
    var MemoryNum;
    MemoryNum = sanitize(document.getElementById('memory-num').value); // ボタンクリック時に値を取得するように修正
    //入力検証
    if (!/^-?\d*\.?\d+$/.test(MemoryNum)) { // 正または負の数値であるかを検証する正規表現
        alert('数値を入力してください。');
        MemoryNum = ''; // 不正な入力をクリア
    }
    if (MemoryNum === '') {
        alert('上部目盛りの値を入力してください。');
        return;
    }

    console.log('minY'+minMemoryY)
    console.log('maxY'+maxMemoryY)
    var distanceMinYtoMaxY = Math.abs(minMemoryY - maxMemoryY);
    console.log('距離' + distanceMinYtoMaxY);
    console.log(MemoryNum);
    var sheetsPerCoordinate = MemoryNum / distanceMinYtoMaxY;
    console.log(sheetsPerCoordinate)
    var distanceFinalYtoBase = Math.abs(finalY - minMemoryY);


    var diffNumSheets = Math.round(sheetsPerCoordinate * distanceFinalYtoBase);
    //差枚数がマイナス雨の時の判定
    diffNumSheets = finalY < minMemoryY ? diffNumSheets : -diffNumSheets;
    console.log('差枚数 :'+diffNumSheets);

    document.getElementById('result').innerText = diffNumSheets + '枚';
}

//スライダーの初期化
// スライダーの初期化
function sliderInit(imgSizeHeight, imgSizeWidth) {
    console.log(imgSizeHeight, imgSizeWidth);
    var minSlider = document.getElementById('min-slider');
    var maxSlider = document.getElementById('max-slider');
    var finalSlider = document.getElementById('final-slider');


    // スライダーの最大値、最小値を設定
    minSlider.min = 0;
    minSlider.max = imgSizeHeight;
    maxSlider.min = 0;
    maxSlider.max = imgSizeHeight;
    finalSlider.min = 0;
    finalSlider.max = imgSizeHeight;
    console.log('スライダー初期化しました。',minSlider.min,minSlider.max);
    // スライダーの値が変更された時のイベントリスナーを追加
    minSlider.addEventListener('input', function() {
        minMemoryY = imgSizeHeight - minSlider.value
        console.log('Slider value: ' + minMemoryY);
        drawLine();
    });

    maxSlider.addEventListener('input', function() {
        maxMemoryY = imgSizeHeight - maxSlider.value
        console.log('Slider value: ' + maxMemoryY);
        drawLine();
    });

    finalSlider.addEventListener('input', function() {
        finalY = imgSizeHeight - finalSlider.value;
        console.log('Slider value: ' + finalY);
        drawLine();
    });
}


//画像に直線を表示
function drawLine(){
    var canvas = document.getElementById('drawing-canvas');
    var ctx = canvas.getContext("2d");


    // 前回の線を消去
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 5;

    // 0メモリの位置描画
    ctx.beginPath();
    ctx.moveTo(0, minMemoryY);
    ctx.lineTo(canvas.width, minMemoryY);
    ctx.strokeStyle = "#00FF00";
    ctx.stroke();


    // 上部メモリの位置描画
    ctx.beginPath();
    ctx.moveTo(0, maxMemoryY);
    ctx.lineTo(canvas.width, maxMemoryY);
    ctx.strokeStyle = "#00FFFF";
    ctx.stroke();


    // 最終位置の描画
    ctx.beginPath();
    ctx.moveTo(0, finalY);
    ctx.lineTo(canvas.width, finalY);
    ctx.strokeStyle = "#FF00FF";
    ctx.stroke();


}

//スライダー
