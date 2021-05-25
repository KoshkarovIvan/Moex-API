var ArrayForSelect2 = [];
var prepend_index = 2;

$(document).ready(() => {
    SetStocksArray();
    setSelect2($('#select-1'), ArrayForSelect2);

    var graph = document.getElementById('graph-1'),
	ctx = graph.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(5, graph.height - 5);
    ctx.lineTo(graph.width, graph.height-5);
    ctx.stroke();
    ctx.font = 'italic 9pt Arial';
    ctx.fillText('p', 10, 10);
    ctx.fillText('t', graph.width -10, graph.height -10);
    ctx.closePath();
})

$(document).on('select2:open', () => {
    setTimeout(function() {
        document.querySelector('.select2-search__field').focus();
    }, 10);
});

$('#select-1').on('select2:select', function(){
    clearCanvas();
    checkMarketData(this);
    takeHistory(this);
})

function addTickerPanel(){
    var panelHTML = `<div id='ticker-panel' class='panel panel-default col-lg-5'>
                        <div class='panel-body'>
                            <div class='row'>
                                <div class='col-lg-6'>
                                    <select id='select-${prepend_index}'></select>
                                </div>
                                <div class='col-lg-6'>
                                    <input type='text' id='input-${prepend_index}' class='col-lg-4' style='margin-right: 10px; padding-left: 10px;'>
                                </div>
                            </div>
                            <div class='row'>
                                <div class='col-lg-6'>
                                    <canvas id='graph-${prepend_index}'>
                                    </canvas>
                                </div>
                                <div class='col-lg-2'></div>
                                <div class='col-lg-4'>
                                    <div><button class='btn btn-sm btn-primary' onclick='takeTrades()'>Take orderbook (AFLT)</button></div>
                                    <div><button class='btn btn-sm btn-warning' onclick='clearCanvas();'>Clear canvas</button></div>
                                </div>
                            </div>
                        </div>
                    </div>`
    $('#row-1').append(panelHTML);
    setSelect2($('#select-' + prepend_index), ArrayForSelect2);
    prepend_index++;
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