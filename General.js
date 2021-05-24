var ArrayForSelect2 = [];
var prepend_index = 2;

$(document).ready(() => {
    SetStocksArray();
    setSelect2($('#select-1'), ArrayForSelect2);

    var example = document.getElementById("example"),
	ctx = example.getContext('2d');
	//ctx.fillRect(0, 0, example.width, example.height);
    ctx.beginPath();
    ctx.moveTo(5, 0); // перемещает "курсор" в позицию x, y и делает её текущей
    ctx.lineTo(5, example.height - 5); // ведёт линию из текущей позиции в указанную, и делает в последствии указанную текущей
    ctx.lineTo(example.width, example.height-5);
    ctx.stroke();
    ctx.font = "italic 9pt Arial";
    //fillText(text, x, y [, maxWidth])
    ctx.fillText('p', 10, 10);
    ctx.fillText('t', example.width -10, example.height -10);
    ctx.closePath();
})

$(document).on('select2:open', () => {
    setTimeout(function() {
        document.querySelector('.select2-search__field').focus();
    }, 10);
});

$('#select-1').on('select2:select', function(){
    checkMarketData(this);
    takeHistory(this)
})

function checkMarketData(that){
    var $ticker = $(that);
    var $result = $($ticker.parent().parent()).find('input');

    $.each(ArrayForSelect2,(idx,elem) => {
        if (elem.id == $ticker.val()){
            url = 'https://iss.moex.com/iss/engines/stock/markets/shares/securities/' + elem.tickerName + '.json'
        }
    });
    $.ajax({
        method:"GET",
        url: url,
        async: true,
        crossdomain: true,
        dataType: 'json',
        success: (responce) => {
            if (responce != null){
                $result.val(responce.marketdata.data[0][18]);
            }
        }
    })
}
function takeTrades(){
    url = 'https://iss.moex.com/iss/engines/stock/markets/shares/securities/AFLT/trades.json';
    $.ajax({
        method:"GET",
        url: url,
        async: true,
        crossdomain: true,
        dataType: 'json',
        success: (responce) => {
            if (responce != null){
                console.log(responce);
            }
        }
    })
}
function takeHistory(that){
    var $ticker = $(that);

    $.each(ArrayForSelect2,(idx,elem) => {
        if (elem.id == $ticker.val()){
            url = 'https://iss.moex.com/iss/history/engines/stock/markets/shares/securities/'+ elem.tickerName +'.json?from=2021-05-17&till=2021-05-24';        }
    });
    $.ajax({
        method:"GET",
        url: url,
        async: true,
        crossdomain: true,
        dataType: 'json',
        success: (responce) => {
            if (responce != null){
                var histotyRange = responce.history.data.filter(f => f.includes('TQBR'));
                var hist = [];
                var example = document.getElementById("example"),
                canvas = example.getContext('2d');
                $.each(histotyRange, function(i, v){
                    hist.push({'date' : v[1], 'price': v[10]});
                });
                var high = getHighElemOfArrObjects(hist, 'price');
                var low = getLowElemOfArrObjects(hist, 'price');
                var diff = Math.round((example.height - 15)/(high - low), 2);
                var step = hist.length;
                $.each(hist, function(i, v){
                    drawPoint(canvas, example.width/step * i + 10,example.height - diff * (v.price - low) - 20, v.price);
                });


            }
        }
    })
}
function authMOEX(){
    $.ajax({
        method:"GET",
        url:"http://passport.moex.com/authenticate",
        async: false,
        crossdomain: true,
        dataType: 'jsonp',
    })
}
function addTickerPanel(){
    var panelHTML = `<div id="ticker-panel" class="panel panel-default col-lg-5" style="box-shadow: rgba(0, 0, 0, 0.4) 1px 2px 2px 2px; margin-top: 10px; margin-left: 10px;">
                        <div class="panel-body">
                            <div class="row" style="margin:10px; ">
                                <div class="col-lg-6">
                                    <select id="select-${prepend_index}"></select>
                                </div>
                                <div class="col-lg-6">
                                    <input type="text" id="input-${prepend_index}" class="col-lg-4" style="margin-right: 10px; padding-left: 10px;">
                                </div>
                            </div>
                        </div>
                    </div>`
    $('#row-1').append(panelHTML);
    setSelect2($('#select-' + prepend_index), ArrayForSelect2);
    prepend_index++;
}
function SetStocksArray(){
    var url = 'https://iss.moex.com/iss/engines/stock/markets/shares/securities.json';

    $.ajax({
        method:"GET",
        url: url,
        async: false,
        crossdomain: true,
        dataType: 'json',
        success: (responce) => {
            if (responce != undefined){
                $.each(responce.securities.data, function(idx, elem){
                    if (arrayNotTiket(elem[0])){
                        ArrayForSelect2.push({id: idx, text: elem[0] + " - " + elem[2], tickerName:elem[0] });
                    }
                });
            }
        }
    })
}
function arrayNotTiket(ticker){
    var result = true;
    $.each(ArrayForSelect2,(i,el) => {
        if (el.tickerName == ticker){
            result = false;
        }
    });
    return result;
}
function setSelect2(elem, array){
    elem.select2({
        data: array,
        allowClear: true,
        width: '100%'
    });
    elem.val(null).trigger('change');
}
function drawPoint(context, x, y, text) {
    console.log(x + ' ' + y);
    context.save();
    context.fillStyle = '#0000FF';
    context.beginPath();
    context.arc(x, y, 3, 0, 2 * Math.PI, false);
    context.fill();
    context.fillText(text, x + 10, y);
    context.restore();
}
function getHighElemOfArrObjects(arr, property){
    var res = arr[0][property];
    for(var i = 1; i < arr.length; i++){
        if (arr[i][property] > res){
            res = arr[i][property];
        }
    }
    return res;
}
function getLowElemOfArrObjects(arr, property){
    var res = arr[0][property];
    for(var i = 1; i < arr.length; i++){
        if (arr[i][property] < res){
            res = arr[i][property];
        }
    }
    return res;
}
function clearCanvas(){
    var example = document.getElementById("example"),
    canvas = example.getContext('2d');
    canvas.clearRect(0, 0, example.width, example.height);
    canvas.beginPath();
    canvas.moveTo(5, 0); // перемещает "курсор" в позицию x, y и делает её текущей
    canvas.lineTo(5, example.height - 5); // ведёт линию из текущей позиции в указанную, и делает в последствии указанную текущей
    canvas.lineTo(example.width, example.height-5);
    canvas.stroke();
    canvas.font = "italic 9pt Arial";
    //fillText(text, x, y [, maxWidth])
    canvas.fillText('p', 10, 10);
    canvas.fillText('t', example.width -10, example.height -10);
    canvas.closePath();
}