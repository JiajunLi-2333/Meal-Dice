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
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, #home, #about, #discover, #share, #contact');
    
    // 定义每个页面的颜色配置
    const sectionColors = {
        home: {
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'rgba(255, 255, 255, 0.2)',
            textColor: 'rgba(255, 255, 255, 0.9)',
            hoverBg: 'rgba(255, 255, 255, 0.2)',
            activeBg: 'rgba(255, 255, 255, 0.25)'
        },
        about: {
            background: 'rgba(0, 0, 0, 0.1)',
            border: 'rgba(0, 0, 0, 0.2)',
            textColor: 'rgba(0, 0, 0, 0.8)',
            hoverBg: 'rgba(0, 0, 0, 0.1)',
            activeBg: 'rgba(0, 0, 0, 0.15)',
            shadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
        },
        discover: {
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'rgba(255, 255, 255, 0.3)',
            textColor: 'rgba(255, 255, 255, 0.9)',
            hoverBg: 'rgba(255, 255, 255, 0.25)',
            activeBg: 'rgba(255, 255, 255, 0.3)'
        },
        share: {
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'rgba(255, 255, 255, 0.3)',
            textColor: 'rgba(255, 255, 255, 0.9)',
            hoverBg: 'rgba(255, 255, 255, 0.25)',
            activeBg: 'rgba(255, 255, 255, 0.3)'
        },
        contact: {
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'rgba(255, 255, 255, 0.3)',
            textColor: 'rgba(255, 255, 255, 0.9)',
            hoverBg: 'rgba(255, 255, 255, 0.25)',
            activeBg: 'rgba(255, 255, 255, 0.3)'
        }
    };
    
    // 应用颜色配置到导航栏
    function applyNavbarColors(colorConfig) {
        if (!navContainer) return;
        
        // 更新导航栏容器样式
        navContainer.style.background = colorConfig.background;
        navContainer.style.borderColor = colorConfig.border;
        if (colorConfig.shadow) {
            navContainer.style.boxShadow = colorConfig.shadow;
        }
        
        // 更新所有导航链接的颜色
        navLinks.forEach(link => {
            link.style.color = colorConfig.textColor;
        });
        
        // 更新搜索按钮颜色
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.style.color = colorConfig.textColor;
            searchBtn.style.borderColor = colorConfig.border;
            searchBtn.style.background = colorConfig.background;
        }
        
        // 动态更新CSS变量以影响hover和active状态
        document.documentElement.style.setProperty('--nav-hover-bg', colorConfig.hoverBg);
        document.documentElement.style.setProperty('--nav-active-bg', colorConfig.activeBg);
        document.documentElement.style.setProperty('--nav-text-color', colorConfig.textColor);
    }
    
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
        
        // 根据当前页面应用颜色
        if (currentSection && sectionColors[currentSection]) {
            applyNavbarColors(sectionColors[currentSection]);
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

// Text Reveal Animation using GSAP
function initTextRevealAnimations() {
    // 改进的文本分割函数，保持原始文本格式
    function splitTextIntoLines(element) {
        const originalText = element.textContent; // 使用textContent而不是innerHTML
        const words = originalText.split(' ');
        
        // 创建一个临时容器来测量文本
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = window.getComputedStyle(element).cssText;
        tempDiv.style.position = 'absolute';
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.height = 'auto';
        tempDiv.style.width = element.offsetWidth + 'px';
        document.body.appendChild(tempDiv);
        
        element.innerHTML = '';
        
        // 创建包装容器
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        
        // 创建单个span包含所有文本，保持正常的文本流
        const span = document.createElement('span');
        span.textContent = originalText;
        span.style.display = 'block';
        span.style.transform = 'translateY(100%)';
        
        wrapper.appendChild(span);
        element.appendChild(wrapper);
        
        // 清理临时元素
        document.body.removeChild(tempDiv);
        
        return [span]; // 返回span数组以保持接口一致
    }
    
    // 为所有需要动画的文本元素应用逐行浮现效果
    document.querySelectorAll('.reveal-text').forEach(element => {
        const spans = splitTextIntoLines(element);
        
        // 判断元素是否在Contact页面（footer）中
        const isInContact = element.closest('.footer') !== null;
        
        gsap.fromTo(spans, 
            {
                y: "100%",
                opacity: 0
            },
            {
                y: "0%",
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: isInContact ? "top 95%" : "top 90%", // Contact页面更早触发
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
}

// 初始化文字浮现动画
document.addEventListener('DOMContentLoaded', () => {
    // 确保GSAP和ScrollTrigger已加载
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initTextRevealAnimations();
    }
});

// 导入表单处理功能
import { RecipeSubmission, initFileUpload } from './formHandler.js';
// 导入搜索功能
import { SearchPage } from './searchPage.js';

// 初始化表单功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化食谱提交功能
    new RecipeSubmission();
    
    // 初始化文件上传功能
    initFileUpload();
    
    // 初始化搜索功能
    new SearchPage();
    
    console.log('🎯 Form handlers initialized');
    console.log('🔍 Search functionality initialized');
});