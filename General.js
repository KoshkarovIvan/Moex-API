var ArrayForSelect2 = [];
var prepend_index = 2;

$(document).ready(() => {
    SetStocksArray();

    setSelect2($('#select-1'), ArrayForSelect2);
})

$(document).on('select2:open', () => {
    setTimeout(function() {
        document.querySelector('.select2-search__field').focus();
    }, 10);
});

function checkMarketData(event){
    var $ticker = $($(event.target).parent().parent()).find('select');
    var $result = $($(event.target).parent().parent()).find('input');

    var url = '';

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
                                <button class="btn btn-sm btn-info col-lg-5" style="margin-bottom: 5px;" onclick="checkMarketData(event);">Get WAPRICE</button>
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
}