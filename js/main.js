$(function(){

    

    
    
    if ($('.gallery').length) {
        galstep = $('.smallimage').width(); // померили ширину блока с мелкой картинкой
        galgap = parseInt($('.gallery_rail').css('gap')); // померили промежуток между картинками
        /* подключаем кнопки */
        $('.g_left').click(function(){
            galSlide('left'); // если двигать блок некуда, кнопка не видна - и нажать на нее не получится. если по дизайну неактивная кнопка должна быть видна, тут лучше сделать проверку класса.
        });
        $('.g_right').click(function(){
            galSlide('right');
        });
        $('.smallimage img').click(function(){
            $('.bigimage img').prop('src', $(this).prop('src').split('min').join('big'));
        });
        $('.bigimage img').click(function(){
            lightbox(this);
        });
    }
    
    if ($('.catalog').length) {
        $('.accordeon, .accordeon .level2, .accordeon .level3').hide();
        $('.catmenu').click(function(){
            $(this).toggleClass('open');
            $('.accordeon').toggle('slow');
        })
        $('.accordeon .level1 > .menupoint').click(function(){
            if ($(this).parent().find('div').length && !$(this).parent().hasClass('open')) {
                $('.level1.open').removeClass('open').find('.level2, .level3').hide('slow');
                $(this).parent().addClass('open').find('.level2').show('slow');
                return false;
            }
        });
        $('.accordeon .level2 > .menupoint').click(function(){
            if ($(this).parent().find('div').length && !$(this).parent().hasClass('open')) {
                $(this).parent().parent().find('.level2.open').removeClass('open').find('.level3').hide('slow');
                $(this).parent().addClass('open').find('.level3').show('slow');
                return false;
            }
        });
    }
    
    if ($('.retaimer').length) {
        retimer();
        setInterval(retimer, 500);
    }
    
    if ($('.slider_block').length) {
        setInterval(function(){
            sliderRun('toleft');
        }, 4000);
        $('.slider .to_left').click(function(){
            sliderRun('toleft');
        });
        $('.slider .to_right').click(function(){
            sliderRun('toright');
        });
    }
})
let slideFlag = false;
let gapFlag = false; // флаг нужен для блокировки новых запусков функции во время, когда она уже запущена
let galstep, galgap; // объявляем переменные глобально, чтобы видеть их как из функции, так и вне ее






function lightbox(aim){
    let src = $(aim).prop('src').split('big').join('max');
    let w = document.documentElement.clientWidth - 200; // отступ от края и паддинг по 50 с каждой стороны
    let h = document.documentElement.clientHeight - 200; // отступ от края и паддинг по 50 с каждой стороны
    let sides = aim.clientWidth / aim.clientHeight; // соотношение сторон картинки
    if (w > sides * h) { // если ширина больше, чем нужна по соотношению сторон, уменьшаем ширину
        w = sides * h;
    } else if (w < sides * h) { // если высота больше, чем нужна по соотношению сторон, уменьшаем высоту
        h = w / sides;
    }
    // и теперь у нас максимальные возможные ширина и высота при нужном соотношении сторон
    let leftfix = w / 2 + 50; // значение поправки для положения лайтбокса по центру экрана
    let hlpstr = '<div class="screen"><div class="lightbox" style="margin-left:-' + leftfix + 'px;"><button type="button">+</button><img src="' + src + '" style="width:' + w + 'px;height:' + h + 'px;"></div></div>';
    document.body.insertAdjacentHTML('beforeend', hlpstr);
    $('.screen').click(function(e){
        if ((e.target == document.querySelector('.screen')) || (e.target == document.querySelector('.screen button'))) {
            $('.screen').remove();
        }
    });
}
function galSlide(direction) {
    if (gapFlag) return; // если эта функция сейчас работает, не будем ей мешать
    gapFlag = true; // поднимаем флаг блокировки - теперь новые вызовы функции не будут исполняться
    let hlpstr = parseInt($('.gallery_rail').css('left')); // определили текущее положение блока
    if (direction == 'left') { // вычисляем новое положение с учетом направления движения
        hlpstr -= galstep;
        hlpstr -= galgap;
    } else {
        hlpstr += galstep;
        hlpstr += galgap;
    }
    $('.gallery_rail').animate({ // плавно перемещаем блок
        left: hlpstr
    }, function(){ // затем проверяем, должны ли работать кнопки в новом положении
    // такую же проверку можно поставить в $(function(){}), если у нас может быть на странице разное число картинок.
        if ($('.gallery_window').width() - $('.gallery_rail').width() >= parseInt(getComputedStyle($('.gallery_rail')[0]).left)) {
            $('.g_left').removeClass('active');
        } else {
            $('.g_left').addClass('active');
        }
        if (parseInt($('.gallery_rail').css('left')) >= 0) {
            $('.g_right').removeClass('active');
        } else {
            $('.g_right').addClass('active');
        }
        gapFlag = false; // опускаем флаг - наш вызов отработал, можно делать новые вызовы
    });
}
function sliderRun(direction) {
    if (slideFlag) return;
    slideFlag = true;
    let hlp = $('.slider_block').index($('.slider_block.curr'));
    let width = $('.slider_block.curr').width();
    let next;
    if (direction == 'toleft') {
        next = hlp + 1;
        if (next > $('.slider_block').length - 1) next -= $('.slider_block').length;
        $('.slider_block').eq(next).css('left', width + 'px').addClass('curr');
        next = '-=' + width;
    } else if (direction == 'toright') {
        next = hlp - 1;
        if (next < 0) next += $('.slider_block').length;
        $('.slider_block').eq(next).css('left', -width + 'px').addClass('curr');
        next = '+=' + width;
    } else {
        console.error('invalid direction');
        slideFlag = false;
        return;
    }
    $('.slider_block.curr').animate({left: next}, 2000, function() {
        $('.slider_block').eq(hlp).removeClass('curr').prop('style','');
        slideFlag = false;
    });
}
function retimer() {
    let limit = new Date($('.retaimer').data('fordate'));
    let now = new Date();
    let delta = Math.floor((limit.getTime() - now.getTime()) / 1000);
    if (delta < 0) delta = 0;
    let sec = delta % 60;
    $('.retaimer .num')[3].innerHTML = `${addChar(sec)}<span class="subnum">${multiple(sec, ['секунда', 'секунды', 'секунд'])}</span>`;
    delta = Math.floor(delta / 60);
    let minute = delta % 60;
    $('.retaimer .num')[2].innerHTML = `${addChar(minute)}<span class="subnum">${multiple(minute, ['минута', 'минуты', 'минут'])}</span>`;
    delta = Math.floor(delta / 60);
    let hour = delta % 24;
    $('.retaimer .num')[1].innerHTML = `${addChar(hour)}<span class="subnum">${multiple(hour, ['час', 'часа', 'часов'])}</span>`;
    delta = Math.floor(delta / 24);
    $('.retaimer .num')[0].innerHTML = `${delta}<span class="subnum">${multiple(delta, ['день', 'дня', 'дней'])}</span>`;
}
function addChar(c) {
    c += '';
    if (c.length < 2) {
        c = '0' + c;
    }
    return c;
}
function multiple(num, words) {
    num = num % 100;
    if (Math.floor(num / 10) != 1) {
        if (num % 10 == 1) {
            return words[0];
        } else if ((num % 10 > 1) && (num % 10 < 5)) {
            return words[1];
        }
    }
    return words[2];
}