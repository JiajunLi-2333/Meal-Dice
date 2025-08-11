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
    const titleContainer = document.querySelector(".title-container");
    if(!title || !titleContainer) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const initialText = `${month}${day}`;
    const finalText = "Meal";

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
    });

    // 添加Dice动画
    const diceAnimation = GSAP_diceEffect();
    mainTl.add(diceAnimation, 0);
    
    // 在Dice动画结束后添加整体放大强调效果
    mainTl.to(titleContainer, { 
        scale: 1.2,
        duration: 0.4,
        ease: "back.out(2)",
        delay: 0.3  // 在Dice动画结束后稍微延迟
    })
    .to(titleContainer, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
    })
    .to(titleContainer, {
        scale: 1.0,
        duration: 0.4,
        ease: "elastic.out(1, 0.6)"
    });

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

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, #home, #about, #discover, #share, #contact');
    
    // Handle navbar scroll animation
    function handleNavbarScroll() {
        const scrollPosition = window.pageYOffset;
        
        if (scrollPosition > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Smooth scroll to sections
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                lenis.scrollTo(targetPosition, {
                    duration: 2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });
    
    // Update active navigation based on scroll position
    function updateActiveNav() {
        const navbarHeight = navbar.offsetHeight;
        const scrollPosition = window.pageYOffset + navbarHeight + 100;
        
        let currentSection = '';
        
        // Check which section is currently in view
        const checkSections = ['home', 'about', 'discover', 'share', 'contact'];
        
        for (const sectionId of checkSections) {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = sectionId;
                    break;
                }
            }
        }
        
        // Special handling for the discover section (wrapper)
        const wrapper = document.getElementById('discover');
        if (wrapper && scrollPosition >= wrapper.offsetTop && 
            scrollPosition < wrapper.offsetTop + wrapper.offsetHeight) {
            currentSection = 'discover';
        }
        
        // Update active class
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkSection = link.getAttribute('data-section');
            if (linkSection === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Combined scroll handler
    function handleScroll() {
        handleNavbarScroll();
        updateActiveNav();
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
}

// Initialize navigation after DOM is loaded
document.addEventListener('DOMContentLoaded', initNavigation);

// Also initialize after a short delay to ensure all elements are ready
setTimeout(initNavigation, 500);
