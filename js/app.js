
function getDate(date) {
    year = date.getFullYear();
    month = date.getMonth()+1;
    dt = date.getDate();

    dh = date.getHours();
    dm = date.getMinutes();
    ds = date.getSeconds();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (dh < 10) {
        dh = '0' + dh;
    }
    if (dm < 10) {
        dm = '0' + dm;
    }
    if (ds < 10) {
        ds = '0' + ds;
    }

    return (dt + '.' + month + '.' + year + ' ' + dh + ':' + dm + ':' + ds);
}

var projects = [];
var payment_methods = [];

$.each(data, function (index, element) {

    $('#payments tbody').append('<tr>' +
        '<td>'+element.transaction.project.name+'</td>'+
        '<td>'+element.transaction.payment_method.name+'</td>'+
        '<td>'+getDate(new Date(element.transaction.transfer_date))+'</td>'+
        '<td class="text-center">'+(element.transaction.is_refund_allowed == '1' ? 'Есть' : 'Отсутствует')+'</td>'+
        '<td>'+element.user.id+'</td>'+
        '<td>'+element.payment_details.payment.amount+'</td>'+
        '<td>'+element.payment_details.payment.currency+'</td>'+
        '</tr>');

    var project = projects.find(el => el.id == element.transaction.project.id);

    if (!project) {
        projects.push(element.transaction.project);
        $('#projectTable').append('<tr>' +
            '<td>'+element.transaction.project.name+'</td>' +
        '</tr>');
    }

    var method = payment_methods.find(el => el.id == element.transaction.payment_method.id);

    if (method) {
        method.count++;
    } else {
        payment_methods.push({
            id: element.transaction.payment_method.id,
            name: element.transaction.payment_method.name,
            count: 1
        });
    }

});

payment_methods.sort(function(a, b) {
    if (a.count < b.count) {
        return 1;
    }
    return -1;
});

$.each(payment_methods, function(index, method) {
    $('#ratingTable tbody').append('<tr>' +
        '<td>'+method.name+'</td>' +
        '<td>'+method.count+'</td>' +
        '</tr>')
});

$('#search').keyup(function() {

    var table = $('#payments')[0];
    var regPhrase = new RegExp($(this).val(), 'i');

    var flag = false;

    for (var i = 1; i < table.rows.length; i++) {
        flag = false;
        for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
            if (flag) break;
        }
        if (flag) {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }

    }

});














var canv = document.getElementById('canvas');
var ctx = canv.getContext('2d');

function swap(m, a, b) {
    temp = m[a];
    m[a] = m[b];
    m[b] = temp;
}


labels = payment_methods.map(el => el.name);
dataChart = payment_methods.map(el => el.count);

var color = Chart.helpers.color;
var barChartData = {
    labels: labels,
    datasets: [{
        label: 'Популярность',
        backgroundColor: color('rgb(255, 99, 132)').alpha(0.5).rgbString(),
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
        data: dataChart
    }]

};


ctx.clearRect(0, 0, canv.width, canv.height);
window.myBar = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
    options: {
        responsive: true,
        legend: {
            position: 'top',
        },
        title: {
            display: false,
            text: ''
        }
    }
});



