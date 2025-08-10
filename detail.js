import {gsap} from 'gsap';
import {ScrollTrigger} from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// 食谱数据
const recipeData = {
    'minced-pork-eggplant': {
        title: 'Minced Pork Eggplant',
        image: [
            '/public/image/minedpork/mincedpork.png',
            '/public/image/minedpork/eggplant.jpg',
            '/public/image/minedpork/garlic.jpg',
            '/public/image/minedpork/pork.jpg',
            '/public/image/minedpork/rice.jpg',
            '/public/image/minedpork/scallion.jpg',
            '/public/image/minedpork/salt.jpg'
        ],
        ingredients: ['Eggplant', 'Minced Pork', 'Garlic', 'Douban', 'Scallion', 'Wine', 'Salt'],
        instructions: 'To make minced pork eggplant, start by slicing one large eggplant into bite-sized pieces and soaking them in salted water for 10 minutes to reduce bitterness. Meanwhile, heat oil in a pan and sauté minced garlic and chopped onions until fragrant. Add about 200 grams of minced pork and cook until browned. Drain the eggplant and add it to the pan, stir-frying until it begins to soften. Pour in a sauce made from soy sauce, oyster sauce, a touch of sugar, and a splash of water or chicken broth. Cover and simmer for 5–10 minutes until the eggplant is tender and the flavors are well absorbed. Finish with a drizzle of sesame oil and chopped green onions for extra aroma. Serve hot with steamed rice.',
        cookingTime: '25 minutes'
    },
    'beef-stew': {
        title: 'Beef Stew',
        image: 'https://via.placeholder.com/250x180/cccccc/666666?text=Beef+Stew',
        ingredients: ['Beef', 'Potatoes', 'Carrots', 'Onions', 'Beef Stock', 'Tomato Paste', 'Garlic', 'Thyme'],
        instructions: 'Cut beef into chunks and season with salt and pepper. Heat oil in a large pot and brown the beef on all sides. Remove beef and sauté diced onions and garlic until softened. Add tomato paste and cook for 1 minute. Return beef to pot, add beef stock, and bring to a boil. Reduce heat and simmer covered for 1 hour. Add potatoes and carrots, continue cooking for 30 minutes until vegetables are tender. Season with thyme, salt, and pepper. Serve hot.',
        cookingTime: '90 minutes'
    },
    'spaghetti-bolognese': {
        title: 'Spaghetti Bolognese',
        image: 'https://via.placeholder.com/250x180/cccccc/666666?text=Spaghetti+Bolognese',
        ingredients: ['Spaghetti', 'Ground Beef', 'Tomato Sauce', 'Onion', 'Garlic', 'Carrots', 'Celery', 'Red Wine'],
        instructions: 'Heat olive oil in a large pan and sauté diced onions, carrots, and celery until soft. Add minced garlic and cook for 1 minute. Add ground beef and cook until browned, breaking it up with a spoon. Pour in red wine and let it simmer until reduced. Add tomato sauce, salt, pepper, and herbs. Simmer for 30 minutes, stirring occasionally. Meanwhile, cook spaghetti according to package directions. Drain and serve with the Bolognese sauce, topped with parmesan cheese.',
        cookingTime: '45 minutes'
    },
    'chicken-curry': {
        title: 'Chicken Curry',
        image: 'https://via.placeholder.com/250x180/cccccc/666666?text=Chicken+Curry',
        ingredients: ['Chicken', 'Curry Powder', 'Coconut Milk', 'Onion', 'Garlic', 'Ginger', 'Tomatoes', 'Cilantro'],
        instructions: 'Cut chicken into bite-sized pieces and season with salt. Heat oil in a large pan and cook chicken until golden. Remove and set aside. In the same pan, sauté diced onions until soft. Add minced garlic, ginger, and curry powder, cooking until fragrant. Add diced tomatoes and cook until they break down. Pour in coconut milk and bring to a simmer. Return chicken to the pan and cook for 15-20 minutes until chicken is cooked through and sauce has thickened. Garnish with fresh cilantro and serve with rice.',
        cookingTime: '35 minutes'
    },
    'vegetable-stir-fry': {
        title: 'Vegetable Stir-Fry',
        image: 'https://via.placeholder.com/250x180/cccccc/666666?text=Vegetable+Stir+Fry',
        ingredients: ['Broccoli', 'Bell Peppers', 'Soy Sauce', 'Garlic', 'Ginger', 'Carrots', 'Snow Peas', 'Sesame Oil'],
        instructions: 'Prepare all vegetables by cutting them into uniform bite-sized pieces. Heat oil in a large wok or pan over high heat. Add minced garlic and ginger, stir-fry for 30 seconds. Add harder vegetables like carrots and broccoli first, stir-fry for 2-3 minutes. Add bell peppers and snow peas, continue stir-frying for another 2 minutes. Pour in soy sauce and a splash of water, toss everything together. Cook for 1 more minute until vegetables are crisp-tender. Drizzle with sesame oil and serve immediately over rice.',
        cookingTime: '20 minutes'
    }
};

// 获取URL参数
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 更新页面内容
function updateRecipeContent() {
    const slug = getURLParameter('slug');
    const recipe = recipeData[slug];
    
    if (!recipe) {
        console.warn('Recipe not found for slug:', slug);
        return;
    }
    
    // 更新页面标题
    document.title = recipe.title;
    
    // 更新所有图片的src
    const pic4 = document.querySelector('.pic4');
    const otherImages = document.querySelectorAll('.rom-img img:not(.pic4)');

    // pic4 使用第一张图片
    if (pic4) {
        pic4.src = recipe.image[0];
        pic4.alt = recipe.title;
    }

// 其他图片按顺序分配剩余图片
otherImages.forEach((img, index) => {
    img.src = recipe.image[index + 1];
    img.alt = recipe.title;
});
    
    // 更新菜名
    const titleElement = document.querySelector('.screen2 h3');
    if (titleElement) {
        titleElement.textContent = recipe.title;
    }
    
    // 更新原料列表
    const ingredientsList = document.querySelector('.ingredients ul');
    if (ingredientsList) {
        ingredientsList.innerHTML = recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');
    }
    
    // 更新制作步骤
    const instructionsElement = document.querySelector('.steps p');
    if (instructionsElement) {
        instructionsElement.textContent = recipe.instructions;
    }
    
    // 更新烹饪时间
    const cookingTimeElement = document.querySelector('.cooking.time p');
    if (cookingTimeElement) {
        cookingTimeElement.textContent = recipe.cookingTime;
    }
}

// 页面加载完成后更新内容
document.addEventListener('DOMContentLoaded', () => {
    updateRecipeContent();
});

// 原有的GSAP动画
ScrollTrigger.create({
    trigger: '.screen1',
    start: 'top top',
    end: '+=2000px',
    scrub: true,
    pin:true, 
    animation:
gsap.timeline()
            // 左侧图片展开（从大到小：pic3 -> pic2 -> pic1）
            .fromTo('.pic3', {left: '55.125em'}, {left: '35em'}, 0)    /* 最大的，离中心最近 */
            .fromTo('.pic2', {left: '55.125em'}, {left: '17em'}, 0)    /* 中等的，中间位置 */
            .fromTo('.pic1', {left: '55.125em'}, {left: '1em'}, 0)     /* 最小的，离中心最远 */
            // 中心pic4收缩但保持位置
            .fromTo('.pic4', {width: '22.5em'}, {width: '19.71em'}, 0)
            // 右侧图片展开（从大到小：pic5 -> pic6 -> pic7）
            .fromTo('.pic5', {left: '55.125em'}, {left: '76.85em'}, 0) /* 最大的，离中心最近 */
            .fromTo('.pic6', {left: '55.125em'}, {left: '96.25em'}, 0) /* 中等的，中间位置 */
            .fromTo('.pic7', {left: '55.125em'}, {left: '113.25em'}, 0) /* 最小的，离中心最远 */
});

