const key = '3239d9e1d5a785f2bdcbd999';
let data = {};
let from = 'RUB';
let to = 'USD';
let strat= false;
let wifi = false; 
let currBtn = document.querySelectorAll(".buttons")
let inputCrr = document.querySelectorAll(".inputext")

//api istifadə etmək üçün
function getData() {
    
    fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`)
        .then(r => r.json())
        .then(d => {
            if (d.result === 'success') {
                data.USD = 1;
                data.EUR = d.conversion_rates.EUR;
                data.GBP = d.conversion_rates.GBP;
                data.RUB = d.conversion_rates.RUB;
                wifi = true;
                teref('l');
                document.querySelector('.checkwifi').style.display = 'none';
            } else {
                document.querySelector('.checkwifi').style.display = 'block';
                wifi = false;
            }
            console.log(d)
        })
}


// Aşağıdakı balaca məlumat yeri üçün
function forcİnFo() {
    if (!wifi) return; 
    
    let a = document.querySelector('.from .currency-info');
    let b = document.querySelector('.to .currency-info');
    let rateAtoB = conv(1, from, to);
    let rateBtoA = conv(1, to, from);
    a.innerHTML = `1 ${from} = ${nummfix(rateAtoB)} ${to}`

        console.log(a.innerHTML)
    b.innerHTML = `1 ${to} = ${nummfix(rateBtoA)} ${from}`
        console.log(b.innerHTML)

}


function conv(value, to, from) {
    if (!wifi) return 0; 
    
    if (to == from) {
        return value;
    }

    if (!data[to] || !data[from]) {
        return 0;
    }

    let inUSD = value / data[to];
    console.log(inUSD)
    return inUSD * data[from];
}



//yuvarlaşdırmaq
function nummfix(num) {
    console.log(Math.round(num))
    return Math.round(num * 100000) / 100000;
}


//əsas çevrilmə işi burdadı
function teref(side) {
    if (strat|| !wifi) return; // Internet yoxdursa işləməsin
    strat= true;
    let fromInp = document.querySelector('.fromInp');
    let toInp = document.querySelector('.toInp');
    if (side == 'l') {
        let val = Number(fromInp.value.replace(',', '.'));
        if (isNaN(val)) val = 0;
        let result = conv(val, from, to);
        toInp.value = nummfix(result);
    } else {
        let val = Number(toInp.value.replace(',', '.'));
        if (isNaN(val)) val = 0;
        let result = conv(val, to, from);
        fromInp.value = nummfix(result);
    }
    forcİnFo();
    strat= false;
}




// Düymələrə basanda rəngini dəyişmək üçün **parentElementi arasdirdim
function btn(e) {
    if (!e.target.classList.contains('btn')) return;
    if (!wifi) return; // Internet yoxdursa işləməsin
    
    e.target.parentElement.querySelectorAll('.btn').forEach(x => {
        x.classList.remove('active');
    });
    e.target.classList.add('active');
    if (e.target.classList.contains('left')) {
        from = e.target.innerText;
    } else {
        to = e.target.innerText;
    }
    teref('l');
}


//inputda birdən çox nöqtə və nöqtədən sonra max 5 rəqəm olması üçün
function inputChange(e) {
    if (!wifi) return; // Internet yoxdursa işləməsin
    
    let v = e.target.value;
    v = v.replace(/\s/g, '');
    v = v.replace(',', '.');
    v = v.replace(/[^\d.]/g, '');
    let parts = v.split('.');
    if (parts.length > 2) {
        v = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length === 2 && parts[1].length > 5) {
        v = `${parts[0]}.${parts[1].slice(0, 5)}`;
    }
    e.target.value = v;
    if (e.target.classList.contains('fromInp')) {
        teref('l');
    } else {
        teref('r');
    }

    console.log(e.data)
}




document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.fromInp').value = 5000;
    document.querySelector('.toInp').value = 0;
    getData();
    checkConnection(); 
    document.querySelectorAll('.buttons').forEach(b => {
        b.addEventListener('click', btn);
    });
    document.querySelectorAll('.inputext').forEach(i => {
        i.addEventListener('input', inputChange);
    });
    
    //online funksiyasina w3schooldan baxdim aidan heçne baxmadım
    window.addEventListener('online', () => {
        document.querySelector('.checkwifi').style.display = 'none';
        getData();
    });
    
    window.addEventListener('offline', () => {
        document.querySelector('.checkwifi').style.display = 'block';
        wifi = false;
    });
});

// Interneti yoxlamaq
function checkConnection() {
    if (!navigator.onLine) {
        document.querySelector('.checkwifi').style.display = 'block';
        wifi = false;
    }
}
