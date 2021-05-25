function takeHistory(that){
    var $ticker = $(that);

    $.each(ArrayForSelect2,(idx,elem) => {
        if (elem.id == $ticker.val()){
            url = 'https://iss.moex.com/iss/history/engines/stock/markets/shares/securities/'+ elem.tickerName +'.json?from=2021-05-17&till=2021-05-24';        }
    });
    $.ajax({
        method:'GET',
        url: url,
        async: true,
        crossdomain: true,
        dataType: 'json',
        success: (responce) => {
            if (responce != null){
                var histotyRange = responce.history.data.filter(f => f.includes('TQBR'));
                var hist = [];
                var graph = document.getElementById('graph-1'),
                canvas = graph.getContext('2d');
                $.each(histotyRange, function(i, v){
                    hist.push({'date' : v[1], 'price': v[10]});
                });
                var high = getHighElemOfArrObjects(hist, 'price');
                var low = getLowElemOfArrObjects(hist, 'price');
                var topPoint = 10;
                var botPoint = graph.height - 10;
                var h = botPoint - topPoint;

                var leftPoint = 10;
                var rightPoint = graph.width - 10;
                var w = rightPoint - leftPoint;

                var diff = high - low;
                var step = hist.length;
                var previous_point = {};
                $.each(hist, function(i, v){
                    if (v.price == low){
                        let y = botPoint;
                        let x =  w/step * i + leftPoint;
                        drawPoint(canvas,x,y, v.price)
                        if (previous_point.x != undefined){
                            drawLine(canvas, previous_point.x, previous_point.y, x , y)
                        }
                        previous_point.x = x;
                        previous_point.y = y;
                    }
                    else if (v.price == high){
                        let y = topPoint;
                        let x =  w/step * i + leftPoint;
                        drawPoint(canvas,x,y, v.price)
                        if (previous_point.x != undefined){
                            drawLine(canvas, previous_point.x, previous_point.y, x , y)
                        }
                        previous_point.x = x;
                        previous_point.y = y;
                    }
                    else{
                        let y = botPoint - h * (v.price - low)/diff;
                        let x =  w/step * i + leftPoint;
                        drawPoint(canvas,x,y, v.price);
                        if (previous_point.x != undefined){
                            drawLine(canvas, previous_point.x, previous_point.y, x , y)
                        }
                        previous_point.x = x;
                        previous_point.y = y;                  
                    }
                });


            }
        }
    })
}
function takeTrades(){
    url = 'https://iss.moex.com/iss/engines/stock/markets/shares/securities/AFLT/trades.json';
    $.ajax({
        method:'GET',
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
function checkMarketData(that){
    var $ticker = $(that);
    var $result = $($ticker.parent().parent()).find('input');

    $.each(ArrayForSelect2,(idx,elem) => {
        if (elem.id == $ticker.val()){
            url = 'https://iss.moex.com/iss/engines/stock/markets/shares/securities/' + elem.tickerName + '.json'
        }
    });
    $.ajax({
        method:'GET',
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
function SetStocksArray(){
    var url = 'https://iss.moex.com/iss/engines/stock/markets/shares/securities.json';

    $.ajax({
        method:'GET',
        url: url,
        async: false,
        crossdomain: true,
        dataType: 'json',
        success: (responce) => {
            if (responce != undefined){
                $.each(responce.securities.data, function(idx, elem){
                    if (arrayNotTiket(elem[0])){
                        ArrayForSelect2.push({id: idx, text: elem[0] + ' - ' + elem[2], tickerName:elem[0] });
                    }
                });
            }
        }
    })
}
function authMOEX(){
    $.ajax({
        method:'GET',
        url:'http://passport.moex.com/authenticate',
        async: false,
        crossdomain: true,
        dataType: 'jsonp',
    })
}