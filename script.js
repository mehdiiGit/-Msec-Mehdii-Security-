function back(){
    if(history.length > 1){
        history.back();
        return 0;
    }
}
const nav = document.getElementById('nav')
const icon = document.getElementById('icon');
window.addEventListener('scroll', () =>{
    if(window.scrollY > 100){
        icon.style.opacity = '1';
    }else{
        icon.style.opacity = '0';
    }
});
icon.addEventListener('click',() => {
    window.scrollTo({
        top:0,
        behavior: 'smooth'
    });
});
document.querySelectorAll("[data-scroll-nav]").forEach(navItem => {
    navItem.addEventListener("click", function() {
        let index = this.getAttribute("data-scroll-nav");
        let target = document.querySelector(`[data-scroll-index="${index}"]`);
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: "smooth"
            });
        }
    });
});
function cv(){
    window.open('images/profile.jpg');
}
const menuu = document.getElementById('menu');
function menu(){
    menuu.classList.add('open');
    document.body.style.overflowY = 'hidden';
}
function closefun(){
    menuu.classList.remove('open');
    document.body.style.overflowY = 'scroll';
}
const contact = document.getElementById('contact')
const about1 = document.getElementById('about1')
const about2 = document.getElementById('about2')
const about3 = document.getElementById('about3')
const services1 = document.getElementById('services1')
const services2 = document.getElementById('services2')
const services3 = document.getElementById('services3')
window.addEventListener('scroll',() =>{
    if(window.scrollY > 1778){
        contact.style.animationName = 'WebAnim';
        contact.style.animationDuration = '1.5s'
    }else{
        contact.style.animation = 'none';
    }
});
window.addEventListener('scroll',() =>{
    if(window.scrollY > 25){
        services1.style.animationName = 'WebAnim';
        services1.style.animationDuration = '1.7s';
        services2.style.animationName = 'WebAnim';
        services2.style.animationDuration = '1.7s';
        services3.style.animationName = 'WebAnim';
        services3.style.animationDuration = '1.7s';
    }else{
        services1.style.animation = 'none';
        services2.style.animation = 'none';
        services3.style.animation = 'none';
    }
});
window.addEventListener('scroll',() =>{
    if(window.scrollY > 773){
        about1.style.animationName = 'WebAnim';
        about1.style.animationDuration = '1.5s';
        about2.style.animationName = 'WebAnim';
        about2.style.animationDuration = '1.5s';
        about3.style.animationName = 'WebAnim';
        about3.style.animationDuration = '1.5s';
    }else{
        about1.style.animation = 'none';
        about2.style.animation = 'none';
        about3.style.animation = 'none';
    }
});
function device(){
    return 0;
}
function url(){
    window.open("url_scan/index.html")
    return 0;
}
function file(){
    window.open("file_scan/index.html")
    return 0;
}













