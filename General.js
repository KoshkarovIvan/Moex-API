var ArrayForSelect2 = [];

$(document).ready(function(){
    SetStocksArray();
    $('#select-1').select2({
        data: ArrayForSelect2,
        allowClear: true,
        width: '100%'
    });
})

$(document).on('select2:open', () => {
    setTimeout(function() {
        document.querySelector('.select2-search__field').focus();
    }, 10);
});

function checkMarketData(){
    var $inp = $('#select-1');
    var url = '';

    $.each(ArrayForSelect2, function(idx,elem){
        if (elem.id == $inp.val()){
            url = 'https://iss.moex.com/iss/engines/stock/markets/shares/securities/' + elem.tickerName + '.json'
        }
    });
    $.ajax({
        method:"GET",
        url: url,
        async: false,
        crossdomain: true,
        dataType: 'json',
        success: function(responce){
            if (responce != null){
                $('#input-2').val(responce.marketdata.data[0][18]);
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

function SetStocksArray(){
    var url = 'https://iss.moex.com/iss/engines/stock/markets/shares/securities.json';
    //var url = 'https://iss.moex.com/iss/securities.json';
    //var url = 'https://iss.moex.com/iss/securities.json?engine=stock&start=100';
    $.ajax({
        method:"GET",
        url: url,
        async: false,
        crossdomain: true,
        dataType: 'json',
        success: function(responce){
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
    $.each(ArrayForSelect2, function(i,el){
        if (el.tickerName == ticker){
            result = false;
        }
    });
    return result;
}