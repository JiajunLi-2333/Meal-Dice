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

    //the timeline of character rolling change
    const tl = gsap.timeline({delay: 1.5}); //

    const maxLength = Math.max(initialText.length, finalText.length);

    for(let i = 0; i < maxLength; i++){
        const startChar = initialText[i] || '';
        const endChar = finalText[i] || '';

        if(startChar !== endChar){
            tl.to({}, {
                duration: 2,  
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
            }, i * 0.4);  


            tl.set({}, {
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

    // 最终确保显示完整文本 + 强调效果
    tl.set({}, {
        onComplete: function() {
            title.textContent = finalText;
        }
    })
    .to(title, {  // ✅ 添加完成后的强调动画
        scale: 1.2,
        duration: 0.3,
        ease: "back.out(1.7)",
        yoyo: true,
        repeat: 1
    });

    return tl;    
}
GSAP_titleEffect();


