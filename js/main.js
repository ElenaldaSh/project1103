$(function(){
    $('.catmenu').click(function(){
        $(this).toggleClass('open');
    })
    
    setInterval(retimer, 500);
})


























function retimer() {
    let limit = new Date($('.retaimer').data('fordate'));
    let now = new Date();
    let delta = Math.floor((limit.getTime() - now.getTime()) / 1000);
    let sec = delta % 60
    $('.retaimer .num')[3].innerHTML = `${addChar(sec)}<span class="subnum">${multiple(sec, ['секунда', 'секунды', 'секунд'])}</span>`;






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