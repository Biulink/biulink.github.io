var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function () {
    load_ui();

};
script.src = 'https://libs.baidu.com/jquery/2.0.0/jquery.min.js';
head.appendChild(script);


function load_ui() {
    var ui_html = '<table class="input_table" style="width: 800px;margin: auto; border: solid 1px black"> <tbody> <tr> <td style="text-align: right;padding: 20px;"> 订单号： </td> <td style="padding: 20px;"> <input type="text" id="order_no" name="order_no" style="width: 100px"> <button onclick="set_order_no()">修改</button> </td> </tr> <tr> <td style="text-align: right;padding: 20px;"> 入住人： </td> <td style="padding: 20px;"> <input type="text" id="person" name="person" style="width: 100px"> <button onclick="set_person()">修改</button> </td> </tr> <tr> <td style="text-align: right;padding: 20px;"> 入住日期： </td> <td style="padding: 20px;"> <input type="text" id="start_date" name="start_date" style="width: 100px"> <button onclick="set_start_date()">修改</button> </td> </tr> <tr> <td style="text-align: right;padding: 20px;"> 离店日期： </td> <td style="padding: 20px;"> <input type="text" id="end_date" name="end_date" style="width: 100px"> <button onclick="set_end_date()">修改</button> </td> </tr> <tr> <td style="text-align: right;padding: 20px;"> 房型： </td> <td style="padding: 20px;"> <input type="text" id="room_type" name="room_type" style="width: 100px"> <button onclick="set_room_type()">修改</button> </td> </tr> <tr> <td style="text-align: right;padding: 20px;"> 每日数据： </td> <td style="padding: 20px;"> <input type="text" id="all_day_data" name="all_day_data" style="width: 200px"> <button onclick="set_all_day_data()">修改</button> </td> </tr> <tr> <td style="text-align: right;padding: 20px;"> 房价： </td> <td style="padding: 20px;"> <input type="text" id="room_price" name="room_price" style="width: 100px"> <button onclick="set_room_price()">修改</button> </td> </tr> <tr> <td style="text-align: right;padding: 20px;"> 优惠立减： </td> <td style="padding: 20px;"> <input type="text" id="room_discount" name="room_discount" style="width: 100px"> <button onclick="set_room_discount()">修改</button> </td> </tr> <tr> <td style="text-align: right;padding: 20px;"> 总价： </td> <td style="padding: 20px;"> <input type="text" id="final_price" name="final_price" style="width: 100px"> <button onclick="set_final_price()">修改</button> </td> </tr> <tr> <td style="text-align: right;padding: 20px;"> </td> <td style="padding: 20px;"> <button onclick="finish()">完成</button> </td> </tr> </tbody> </table>';
    $(ui_html).insertBefore($('body div center').parent());
}

function set_order_no() {
    $('td strong:contains(订单号)').parent().siblings().first().find('strong').text($('#order_no').val());
}

function set_person() {
    $('td strong:contains(入住人)').parent().siblings().first().text($('#person').val());
}

function set_start_date() {
    try {
        var start_date = new Date($('#start_date').val());
        start_date.toISOString();
    } catch (e) {
        alert('入住日期不正确');
        return;
    }
    $('td strong:contains(入住日期)').parent().siblings().first().text(start_date.toISOString().slice(0, 10));
    var tomorrow = new Date(start_date);
    tomorrow.setDate(start_date.getDate() + 1);
    $('td:contains(最晚保留时间)').siblings().first().text(tomorrow.toISOString().slice(0, 10) + ' 06:00:00');
}

function set_end_date() {
    if ($('#start_date').val() === '') {
        alert('请先修改入住日期');
        return;
    }

    try {
        var start_date = new Date($('#start_date').val());
        start_date.toISOString();
        var end_date = new Date($('#end_date').val());
        end_date.toISOString();
    } catch (e) {
        alert('入住日期或离店日期不正确');
        return;
    }

    if (end_date < start_date) {
        alert('入住日期或离店日期不正确');
        return;
    }

    $('td strong:contains(离店日期)').parent().siblings().first().text(end_date.toISOString().slice(0, 10));
    $('td strong:contains(每日单价)').text('每日单价（' + start_date.toISOString().slice(5, 10) + '至' + end_date.toISOString().slice(5, 10) + '）');

    var iDays = parseInt(Math.abs(end_date - start_date) / 1000 / 60 / 60 / 24);
    $('td:contains(每日数据：)').text('每日数据：(' + (iDays + 1) + '天)：')
}

function set_room_type() {
    $('td strong:contains(房型)').parent().siblings().first().find('strong').text($('#room_type').val());
}

function set_all_day_data() {
    if ($('#start_date').val() === '' || $('#end_date').val() === '') {
        alert('请先修改入住日期和离店日期');
        return;
    }

    try {
        var start_date = new Date($('#start_date').val());
        start_date.toISOString();
        var end_date = new Date($('#end_date').val());
        end_date.toISOString();
    } catch (e) {
        alert('入住日期或离店日期不正确');
        return;
    }

    if (end_date < start_date) {
        alert('入住日期或离店日期不正确');
        return;
    }

    var iDays = parseInt(Math.abs(end_date - start_date) / 1000 / 60 / 60 / 24);

    var all_day_data = $('#all_day_data').val().split(';');

    if (all_day_data.length != (iDays + 1) * 2) {
        alert('需要输入' + (iDays + 1) + '天的数据');
        return;
    }

    var html = '';
    var row = [];
    var index = 0;
    var i = new Date(start_date);
    while (i <= end_date) {
        row.push([new Date(i), all_day_data[index * 2], all_day_data[index * 2 + 1]]);

        if (row.length == 3) {
            html += '<tr style="background-color:#fff">';
            for (var j = 0; j < row.length; j++) {
                html += '<td>' + row[j][0].toISOString().slice(5, 10) + '</td>'
            }
            html += '</tr> <tr>';
            for (j = 0; j < row.length; j++) {
                html += '<td style="padding:12px 0;">&yen;' + parseFloat(row[j][1]).toFixed(2) + '<br/>' + (parseInt(row[j][2]) == 0 ? '无餐食' : row[j][2] + '份早餐') + '</td>'
            }
            html += '</tr>';
            row = []
        }

        index += 1;
        i.setDate(i.getDate() + 1);
    }

    if (row.length > 0) {
        html += '<tr style="background-color:#fff">';
        for (var j = 0; j < row.length; j++) {
            html += '<td>' + row[j][0].toISOString().slice(5, 10) + '</td>'
        }
        html += '</tr> <tr>';
        for (j = 0; j < row.length; j++) {
            html += '<td style="padding:12px 0;">&yen;' + row[j][1] + '<br/>' + (parseInt(row[j][2]) == 0 ? '无餐食' : row[j][2] + '份早餐') + '</td>'
        }
        html += '</tr>';
        row = []
    }

    $('td strong:contains(每日单价)').parent().parent().siblings().remove();
    $(html).insertAfter($('td strong:contains(每日单价)').parent().parent());
}

function set_room_price() {
    var room_price = parseFloat($('#room_price').val());
    $('td strong:contains(房价)').parent().siblings().first().html('&yen;&nbsp;' + room_price.toFixed(2));
}

function set_room_discount() {
    var room_discount = parseFloat($('#room_discount').val());
    $('td strong:contains(优惠立减)').parent().siblings().first().html('-&nbsp;&yen;&nbsp;' + room_discount.toFixed(2));
}


function set_final_price() {
    var final_price = parseFloat($('#final_price').val());
    $('td strong:contains(总价)').parent().siblings().first().html('&yen;&nbsp;' + final_price.toFixed(2));
}

function finish() {
    $('.input_table').hide();
}