import {gsap} from 'gsap';
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Lenis from 'lenis';
//! GSAP Animation section
gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis ({
    duration: 2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    autoRaf: true,
});
const scrollbox = {
        wrapper: document.querySelector(".wrapper"),
        cardsbox: document.querySelector(".cardsbox"),
        distance: 0,
        if_leave: false,
        init() {
            this.resize();
            window.addEventListener("resize", this.resize.bind(this));
            this.create_scrolltrigger();
        },
        create_scrolltrigger() {
            ScrollTrigger.create({
                trigger: this.wrapper,
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    this.cardsbox.style.transform = `translateX(-${self.progress * this.distance}px)`;
                },
                onLeave: () => {
                    this.if_leave = true;
                },
                onEnterBack: () => {
                    this.if_leave = false;
                }
            });
        },
        resize() {
            this.distance = this.cardsbox.offsetWidth - innerWidth;
            this.wrapper.style.height = `${this.distance}px`;
            if (this.if_leave) this.cardsbox.style.transform = `translateX(-${this.distance}px)`;
        }
    };
    scrollbox.init();

//Home Page GSAP effect
//TODO title effect 
function GSAP_titleEffect(){
    const title = document.querySelector(".title");
    if(!title) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const initialText = `${year}- ${month}${day}`;
    const finalText = "Daily Meal";

    title.textContent = initialText;

    const mainTl = gsap.timeline({delay: 1.5}); 

    const maxLength = Math.max(initialText.length, finalText.length);

    for(let i = 0; i < maxLength; i++){
        const startChar = initialText[i] || '';
        const endChar = finalText[i] || '';

        if(startChar !== endChar){
            mainTl.to({}, {
                duration: 1,  
                ease: "power1.inOut",  
                onUpdate: function() {
                    const progress = this.progress();
                    
                    let displayChar;
                    if (progress < 0.8) {  
                        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-';
                        displayChar = chars[Math.floor(Math.random() * chars.length)];
                    } else {  
                        displayChar = endChar;
                    }
                    
                    let currentText = '';
                    for (let j = 0; j < maxLength; j++) {
                        if (j < i) {
                            currentText += finalText[j] || '';
                        } else if (j === i) {
                            currentText += displayChar;
                        } else {
                            currentText += initialText[j] || '';
                        }
                    }
                    title.textContent = currentText;
                }
            }, i * 0.2);  

            mainTl.set({}, {
                onComplete: function() {
                    let correctText = '';
                    for (let j = 0; j <= i; j++) {
                        correctText += finalText[j] || '';
                    }
                    for (let j = i + 1; j < maxLength; j++) {
                        correctText += initialText[j] || '';
                    }
                    title.textContent = correctText;
                }
            });
        }
    }

    mainTl.set({}, {
        onComplete: function() {
            title.textContent = finalText;
        }
    })
    .to(title, { 
        scale: 1.2,
        duration: 0.3,
        ease: "back.out(1.7)",
        yoyo: true,
        repeat: 1
    });

    mainTl.add(GSAP_diceEffect(), 0);

    return mainTl;    
}

//TODO Dice jumpping and rotation effect
function GSAP_diceEffect(){
    const dice = document.querySelector(".Dice");

    if(!dice) return;

    const texts = "Dice"; 

    // 为每个字符创建span，初始状态正常显示
    dice.innerHTML = texts.split('').map((char, index) => 
         `<span class="dice-char-${index}" style="display: inline-block;">${char}</span>`
    ).join('');

    const tl = gsap.timeline();

    texts.split('').forEach((char, index) => {
        // 一个完整的翻滚动画 - 5圈旋转
        tl.to(`.dice-char-${index}`, {
            y: -60,                  
            rotation: 1800,           
            scale: 1.1,              
            duration: 0.3,           
            ease: "power2.out"
        })
        .to(`.dice-char-${index}`, {
            y: 0,                    
            scale: 1.0,             
            duration: 0.2,           
            ease: "bounce.out"
        })
    });
    
    return tl;
}
GSAP_titleEffect();


//Display Page tab jumping
document.addEventListener('click', (e) => {
  const card = e.target.closest('.cardsbox_card');
  if (!card) return;

  const slug = card.dataset.slug;
  if (!slug) return;

  const url = `recipe.html?slug=${encodeURIComponent(slug)}`;
  const win = window.open(url, '_blank'); // 新标签
  if (win) win.opener = null;            // 安全：切断 window.opener
});
