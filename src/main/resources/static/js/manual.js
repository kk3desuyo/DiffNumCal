
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

                graph.style.height = (previewCanvas.height+ 90) + 'px';
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

    document.getElementById('diff-num').innerText = diffNumSheets;
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

//機種の確率情報を管理するクラス
class Model{
    //I'm
    iam_cherry_payout = 2
    iam_grape_payout = 8
    iam_replay_payout = 3
    iam_big_payout = 252
    iam_reg_payout = 96
    iam_big = [273.1,269.7,269.7,259.0,259.0,255.0]
    iam_reg = [439.8,399.6,331.0,315.1,255.0,255.0]
    iam_big_ch = [1129.93,1129.93,1129.93,1129.93,1092.27,1092.27,1092.27]
    iam_reg_ch = [1394.38,1236.53,1092.27,1057.03,851.12,851.12]
    iam_grape =[6.02,6.02,6.02,6.02,6.02,5.78]
    iam_cherry =32.29
    iam_clown　=1092.27
    iam_bell　=1092.27
    iam_replay = 7.3

    constructor(model){
        //I'mジャグラー
        if(model === "iam"){
            this.cherry_payout = this.iam_cherry_payout;
            this.replay_payout = this.iam_replay_payout
            this.grape_payout  = this.iam_grape_payout
            this.big_payout = this.iam_big_payout;
            this.reg_payout = this.iam_reg_payout;
            this.big = this.iam_big;
            this.reg = this.iam_reg
            this.big_ch = this.iam_big_ch
            this.reg_ch = this.iam_reg_ch
            this.grape = this.iam_grape;
            this.clown = this.iam_clown;
            this.bell = this.iam_bell;
            this.cherry = this.iam_cherry;
            this.replay = this.iam_replay;
        }

    }

    static calculateReturns(model,num_of_revolutions) {
        //チェリー
        const cherry_hits = num_of_revolutions / model.cherry ;
        const replay_hits = num_of_revolutions / model.replay;
        const bell_hits = num_of_revolutions/model.bell;
        const clown_hits = num_of_revolutions/model.clown;
        console.log(cherry_hits,"   ",replay_hits,"   ",bell_hits,"   ",clown_hits);
        return {
            cherry: cherry_hits,
            replay: replay_hits,
            bell:bell_hits,
            clown:clown_hits
        };

    }
     static grape_simulate(){
        //入力値の取得
        var big_count = sanitize(document.getElementById('big-count').value)
        var reg_count =sanitize(document.getElementById('reg-count').value)
        var num_of_revolutions = sanitize(document.getElementById('revolutions').value)
        var model_input = document.getElementById('model').value
        var diff_num = parseInt(document.getElementById('diff-num').innerText)

         console.log('big',big_count)
         console.log('reg',reg_count)
         console.log('revo',num_of_revolutions)
         console.log('iam',model_input)
         console.log('diff',diff_num)
         //入力のバリデーションチェック 一個でも入力されていたらぶどうシミュを使用と判定する
// 入力のバリデーションチェック 一個でも入力されていたらぶどうシミュを使用と判定する
         if (big_count !== '' || reg_count !== '' || num_of_revolutions !== '' || model_input !== '') {
             // 一個でも入力漏れがある場合
             if (big_count === '' || reg_count === '' || num_of_revolutions === '' || model_input === '') {
                 alert('機種, BIG回数, REG回数 または回転数が入力漏れがあります。もし、ぶどうシミュを使わない場合には、機種名、BIG,REG回数,回転数の欄にデータを一つも入力しないでください。');
             }
         }
         console.log(big_count)
        //  var big_count = 24
        //  var reg_count =31
        //  var num_of_revolutions = 6671
        //  var model_input = 'iam'
        //  var diff_num = 1180

        console.log('big',big_count)
        console.log('reg',reg_count)
        console.log('revo',num_of_revolutions)
        console.log('iam',model_input)
        console.log('diff',diff_num)

         //機種の割り当て
         var model = new Model(model_input);
        console.log('情報',model.replay)
        console.log(big_count)
        console.log(reg_count)
        console.log(num_of_revolutions)
        //使用枚数を計算(リプレイ等は無視) 3枚掛け * 回転数
        var used_num = 3 * num_of_revolutions;
        console.log(used_num)
        //ビッグ,regの払い出し枚数 - (1ベットで揃える時の1マイ)
        var big_return = model.big_payout * big_count - big_count;
        var reg_return = model.reg_payout * reg_count - reg_count;
        console.log('big'+big_return)
        console.log('reg'+reg_return)

        var hits_infos = this.calculateReturns(model,num_of_revolutions);
        console.log(hits_infos);
        //チェリーの払い出しを計算
        var cherry_return = hits_infos.cherry * model.cherry_payout;

        //リプレイの払い戻し
        var replay_return = hits_infos.replay * 3;

        //ベル
        var bell_return = hits_infos.bell * 14;
        //ピエロ
        var clown_return = hits_infos.clown*14;

        var total_return = (big_return + reg_return + cherry_return+replay_return + bell_return + clown_return)
        var grape_return =  used_num + diff_num - total_return;
        console.log(used_num)
         console.log(diff_num)
         console.log(total_return)
         // 各払い戻し情報をコンソールに出力
         console.log('Cherry Return: ' + cherry_return);
         console.log('Replay Return: ' + replay_return);
         console.log('Bell Return: ' + bell_return);
         console.log('Clown Return: ' + clown_return);
         console.log('Total Return: ' + total_return);
         console.log('used',used_num)
         console.log('diff',diff_num)
         console.log('total',total_return)
         console.log(grape_return)
        console.log('ぶどうの枚数ue')
        //（払い戻し(ぶどう以外)+ぶどう) - 投入枚数　＝差枚数
        var grape_count = grape_return/8;
        console.log('ぶどうの個数',grape_count)
        //分数の変換
        var grape_probability = grape_count/num_of_revolutions;
        console.log(grape_probability)
        grape_probability = 100/(grape_probability*100);
        console.log('武道確率',grape_probability)
         //武道確率表示部分の変更
         document.getElementById('grape-probability').innerText = Math.round(grape_probability * 100) / 100;
    }
}

