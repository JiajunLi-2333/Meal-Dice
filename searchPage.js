// 搜索页面功能类
class SearchPage {
    constructor() {
        this.searchContainer = null;
        this.apiBaseUrl = 'http://localhost:3001/api';
        this.isSearchPageActive = false;
        this.init();
    }

    init() {
        this.createSearchPage();
        this.bindSearchButton();
        // 立即创建并显示AI助手，让它一直可见
        this.createAIAssistant();
        console.log('🔍 Search functionality initialized');
        console.log('🐷 AI Assistant is now always visible');
    }

    createSearchPage() {
        // 创建搜索页面HTML结构
        const searchHTML = `
            <div id="search-page" class="search-page hidden">
                <div class="search-header">
                    <button class="back-button" id="back-to-home">
                        <span>←</span> Back
                    </button>
                </div>
                
                <div class="search-content">
                    <h1 class="search-title">Search</h1>
                    <div class="search-input-container">
                        <input 
                            type="text" 
                            id="ingredient-search" 
                            class="search-input" 
                            placeholder="Enter an ingredient (e.g., chicken, tomato, garlic...)"
                            autocomplete="off"
                        >
                        <button class="search-submit-btn" id="search-btn">Search</button>
                    </div>
                    
                    <div class="search-results" id="search-results">
                        <!-- 搜索结果将在这里显示 -->
                    </div>
                </div>
            </div>
        `;

        // 添加搜索页面样式
        const searchCSS = `
            .search-page {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background-color: #fffef7;
                z-index: 9999;
                overflow-y: auto;
                transition: all 0.3s ease;
            }

            .search-page.hidden {
                transform: translateX(100%);
                opacity: 0;
                pointer-events: none;
            }

            .search-page.active {
                transform: translateX(0);
                opacity: 1;
                pointer-events: all;
            }

            .search-header {
                position: absolute;
                top: 1rem;
                left: 1rem;
                z-index: 10;
            }

            .back-button {
                background: rgba(255, 255, 255, 0.9);
                border: 1px solid #e5e7eb;
                color: #6b7280;
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.875rem;
                font-weight: 500;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.25rem;
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .back-button:hover {
                background: rgba(255, 255, 255, 1);
                color: #374151;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }

            .back-button span {
                font-size: 1rem;
                font-weight: bold;
            }

            .search-content {
                max-width: 800px;
                margin: 0 auto;
                padding: 4rem 2rem 2rem 2rem;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .search-title {
                font-size: 4rem;
                font-weight: bold;
                text-align: center;
                margin-bottom: 3rem;
                color: #1f2937;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .search-input-container {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                margin-bottom: 4rem;
                width: 100%;
                max-width: 500px;
                align-items: center;
            }

            .search-input {
                width: 100%;
                padding: 1.2rem 1.5rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 1.1rem;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                text-align: center;
            }

            .search-input:focus {
                outline: none;
                border-color: #6366f1;
                box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1);
                transform: translateY(-2px);
            }

            .search-submit-btn {
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                color: white;
                border: none;
                padding: 1.2rem 3rem;
                border-radius: 12px;
                cursor: pointer;
                font-size: 1.1rem;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 4px 6px rgba(99, 102, 241, 0.25);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                min-width: 150px;
            }

            .search-submit-btn:hover {
                background: linear-gradient(135deg, #5338f5 0%, #7c3aed 100%);
                transform: translateY(-3px);
                box-shadow: 0 6px 12px rgba(99, 102, 241, 0.4);
            }

            .search-submit-btn:disabled {
                background-color: #9ca3af;
                cursor: not-allowed;
                transform: none;
            }

            .search-results {
                margin-top: 2rem;
                width: 100%;
                max-width: 1200px;
            }

            /* 右下角AI助手 - 一直显示 */
            .ai-assistant {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                border-radius: 50%;
                border: none;
                cursor: pointer;
                box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
                transition: all 0.3s ease;
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            
            .ai-assistant.show {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            
            .ai-assistant:hover {
                background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
                transform: translateY(-3px) scale(1.1);
                box-shadow: 0 12px 24px rgba(245, 158, 11, 0.5);
            }
            
            .ai-assistant:active {
                transform: translateY(-1px) scale(1.05);
            }
            
            .ai-assistant.thinking {
                animation: pulse 1.5s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: translateY(-3px) scale(1.1); }
                50% { transform: translateY(-6px) scale(1.2); }
            }
            
            /* AI 对话框样式 */
            .ai-dialog {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .ai-dialog.show {
                opacity: 1;
                visibility: visible;
            }
            
            .ai-dialog-content {
                background: white;
                border-radius: 16px;
                max-width: 900px; /* 从600px增加到900px */
                width: 95%;
                max-height: 85vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                transform: translateY(30px) scale(0.95);
                transition: all 0.3s ease;
            }
            
            .ai-dialog.show .ai-dialog-content {
                transform: translateY(0) scale(1);
            }
            
            .ai-dialog-header {
                padding: 2rem 2rem 1rem 2rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .ai-dialog-title {
                font-size: 1.8rem; /* 从1.5rem增加到1.8rem */
                font-weight: 700;
                color: #1f2937;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .ai-dialog-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #6b7280;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 8px;
                transition: all 0.2s ease;
            }
            
            .ai-dialog-close:hover {
                background: #f3f4f6;
                color: #374151;
            }
            
            .ai-dialog-body {
                padding: 2.5rem; /* 从2rem增加到2.5rem */
            }
            
            .ai-suggestion-card {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-radius: 12px;
                padding: 2.5rem; /* 从2rem增加到2.5rem */
                border: 1px solid #f59e0b;
                display: flex;
                flex-direction: column;
                gap: 2rem; /* 增加段落间距 */
            }
            
            .ai-recipe-title {
                font-size: 2.2rem; /* 从2rem增加到2.2rem */
                font-weight: 700;
                color: #92400e;
                margin-bottom: 0; /* 移除margin，用gap控制间距 */
                text-align: center;
                border-bottom: 2px solid #d97706;
                padding-bottom: 1.5rem; /* 从1rem增加到1.5rem */
            }
            
            .ai-recipe-section {
                margin-bottom: 0; /* 移除margin，用gap控制间距 */
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .ai-recipe-section h4 {
                font-size: 1.5rem; /* 从1.4rem增加到1.5rem */
                font-weight: 600;
                color: #92400e;
                margin-bottom: 0; /* 移除margin，用gap控制间距 */
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .ai-recipe-content {
                color: #451a03;
                line-height: 1.8; /* 从1.8保持不变 */
                font-size: 1.1rem; /* 从1.1rem保持不变 */
                margin-bottom: 0; /* 移除margin，用gap控制间距 */
                white-space: pre-line; /* 保持换行格式 */
            }
            
            .ai-ingredients-text {
                color: #451a03;
                line-height: 1.7; /* 从1.7保持不变 */
                font-size: 1.1rem; /* 从1.1rem保持不变 */
                font-weight: 500;
                margin-bottom: 0; /* 移除margin */
            }
            
            .ai-cooking-time {
                color: #92400e;
                font-weight: 600;
                font-size: 1.2rem; /* 从1.2rem保持不变 */
                background: rgba(146, 64, 14, 0.1);
                padding: 1rem 1.5rem; /* 从0.75rem 1.25rem增加到1rem 1.5rem */
                border-radius: 8px;
                display: inline-block;
                text-align: center;
                align-self: flex-start; /* 左对齐 */
            }
            
            .ai-loading {
                text-align: center;
                padding: 3rem 2rem;
                color: #6b7280;
            }
            
            .ai-loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f4f6;
                border-top: 4px solid #f59e0b;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem auto;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .ai-error {
                background: #fef2f2;
                border: 1px solid #fecaca;
                color: #dc2626;
                padding: 1rem;
                border-radius: 8px;
                text-align: center;
            }

            .recipes-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                border: 1px solid #e5e7eb;
            }

            .recipes-table th {
                background-color: #f8fafc;
                color: #374151;
                padding: 1.2rem 1rem;
                text-align: left;
                font-weight: 600;
                font-size: 0.95rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 2px solid #e2e8f0;
                position: sticky;
                top: 0;
                z-index: 2;
            }

            .recipes-table th:first-child {
                width: 15%;
                min-width: 120px;
            }

            .recipes-table th:nth-child(2) {
                width: 25%;
                min-width: 200px;
            }

            .recipes-table th:nth-child(3) {
                width: 35%;
                min-width: 250px;
            }

            .recipes-table th:nth-child(4) {
                width: 12%;
                min-width: 100px;
            }

            .recipes-table th:nth-child(5) {
                width: 18%;
                min-width: 220px;
            }

            .recipes-table td {
                padding: 1rem;
                border-bottom: 1px solid #f1f5f9;
                vertical-align: top;
                position: relative;
            }

            .recipes-table tbody tr {
                transition: all 0.2s ease;
            }

            .recipes-table tbody tr:hover {
                background-color: #f8fafc;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .recipes-table tbody tr:last-child td {
                border-bottom: none;
            }

            .recipe-name {
                font-weight: 600;
                color: #1f2937;
                font-size: 1.05rem;
            }

            .recipe-ingredients {
                max-width: 300px;
                max-height: 120px;
                overflow-y: auto;
                word-break: break-word;
                line-height: 1.5;
                color: #4b5563;
                padding-right: 0.5rem;
                scrollbar-width: thin;
                scrollbar-color: #cbd5e1 #f1f5f9;
            }

            .recipe-ingredients::-webkit-scrollbar {
                width: 6px;
            }

            .recipe-ingredients::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 3px;
            }

            .recipe-ingredients::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 3px;
            }

            .recipe-ingredients::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }

            .recipe-steps {
                max-width: 400px;
                max-height: 120px;
                overflow-y: auto;
                word-break: break-word;
                line-height: 1.5;
                color: #4b5563;
                padding-right: 0.5rem;
                scrollbar-width: thin;
                scrollbar-color: #cbd5e1 #f1f5f9;
            }

            .recipe-steps::-webkit-scrollbar {
                width: 6px;
            }

            .recipe-steps::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 3px;
            }

            .recipe-steps::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 3px;
            }

            .recipe-steps::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }

            .recipe-time {
                white-space: nowrap;
                font-weight: 600;
                color: #059669;
                background-color: #d1fae5;
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                text-align: center;
                font-size: 0.9rem;
            }

            .recipe-image {
                width: 200px;
                height: 160px;
                object-fit: cover;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s ease;
                display: block;
            }

            .recipe-image:hover {
                transform: scale(1.05);
            }

            .recipe-image-cell {
                text-align: center;
                vertical-align: middle;
            }

            .no-image-placeholder {
                width: 200px;
                height: 160px;
                background-color: #f3f4f6;
                border: 2px dashed #d1d5db;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #9ca3af;
                font-size: 0.875rem;
                font-style: italic;
            }

            .no-results {
                text-align: center;
                padding: 4rem 2rem;
                color: #6b7280;
                font-size: 1.1rem;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 16px;
                border: 2px dashed #cbd5e1;
            }

            .no-results h3 {
                color: #374151;
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }

            .loading {
                text-align: center;
                padding: 3rem;
                color: #6b7280;
                font-size: 1.2rem;
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border-radius: 16px;
                border: 2px solid #bae6fd;
            }

            @media (max-width: 768px) {
                .search-header {
                    top: 0.75rem;
                    left: 0.75rem;
                }

                .back-button {
                    padding: 0.4rem 0.6rem;
                    font-size: 0.8rem;
                }

                .back-button span {
                    font-size: 0.9rem;
                }

                .search-content {
                    padding: 3rem 1rem 1.5rem 1rem;
                }

                .search-title {
                    font-size: 2.5rem;
                    margin-bottom: 2rem;
                }

                .search-input-container {
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .search-input {
                    padding: 1rem;
                    font-size: 1rem;
                }

                .search-submit-btn {
                    padding: 1rem 2rem;
                    font-size: 1rem;
                }
                
                .ai-assistant {
                    width: 60px;
                    height: 60px;
                    bottom: 1.5rem;
                    right: 1.5rem;
                    font-size: 1.8rem;
                }

                .recipes-table {
                    font-size: 0.875rem;
                    display: block;
                    overflow-x: auto;
                    white-space: nowrap;
                }

                .recipes-table thead,
                .recipes-table tbody,
                .recipes-table th,
                .recipes-table td,
                .recipes-table tr {
                    display: block;
                }

                .recipes-table thead tr {
                    position: absolute;
                    top: -9999px;
                    left: -9999px;
                }

                .recipes-table tr {
                    border: 1px solid #e5e7eb;
                    margin-bottom: 1rem;
                    border-radius: 8px;
                    background: white;
                    padding: 1rem;
                }

                .recipes-table td {
                    position: relative;
                    padding: 0.75rem 0 0.75rem 30%;
                    border: none;
                    white-space: normal;
                }

                .recipes-table td:before {
                    content: attr(data-label);
                    position: absolute;
                    left: 0;
                    width: 25%;
                    padding-right: 10px;
                    white-space: nowrap;
                    font-weight: 600;
                    color: #374151;
                }

                .recipe-ingredients,
                .recipe-steps {
                    max-width: 200px;
                }

                .no-results {
                    padding: 2rem 1rem;
                }

                .loading {
                    padding: 2rem 1rem;
                }
            }
        `;

        // 添加样式到页面
        const style = document.createElement('style');
        style.textContent = searchCSS;
        document.head.appendChild(style);

        // 添加HTML到页面
        document.body.insertAdjacentHTML('beforeend', searchHTML);

        // 绑定事件
        this.bindSearchPageEvents();
    }

    bindSearchButton() {
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSearchPage();
            });
        }
    }

    bindSearchPageEvents() {
        // 返回按钮
        const backBtn = document.getElementById('back-to-home');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.hideSearchPage();
            });
        }

        // 搜索输入框和按钮
        const searchInput = document.getElementById('ingredient-search');
        const searchBtn = document.getElementById('search-btn');

        if (searchInput && searchBtn) {
            // 点击搜索按钮
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });

            // 回车键搜索
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });

            // 输入时的实时验证
            searchInput.addEventListener('input', (e) => {
                const value = e.target.value.trim();
                searchBtn.disabled = value.length === 0;
            });
        }
    }

    showSearchPage() {
        const searchPage = document.getElementById('search-page');
        if (searchPage) {
            searchPage.classList.remove('hidden');
            searchPage.classList.add('active');
            this.isSearchPageActive = true;
            
            // 聚焦搜索输入框
            setTimeout(() => {
                const searchInput = document.getElementById('ingredient-search');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 300);
        }
    }

    hideSearchPage() {
        const searchPage = document.getElementById('search-page');
        if (searchPage) {
            searchPage.classList.remove('active');
            searchPage.classList.add('hidden');
            this.isSearchPageActive = false;

            // 清空搜索结果
            this.clearSearchResults();
        }
    }

    async performSearch() {
        const searchInput = document.getElementById('ingredient-search');
        const ingredient = searchInput.value.trim();

        if (!ingredient) {
            alert('Please enter an ingredient to search for');
            return;
        }

        console.log('🔍 Searching for:', ingredient);
        this.showLoading();

        try {
            const response = await fetch(`${this.apiBaseUrl}/recipes/search?ingredient=${encodeURIComponent(ingredient)}`);
            const result = await response.json();

            if (result.success) {
                this.displaySearchResults(result.recipes, result.searchTerm, result.count);
            } else {
                this.showError(result.error || 'Search failed');
            }
        } catch (error) {
            console.error('❌ Search error:', error);
            this.showError('Failed to connect to server. Please try again.');
        }
    }

    displaySearchResults(recipes, searchTerm, count) {
        const resultsContainer = document.getElementById('search-results');
        
        if (recipes.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No recipes found</h3>
                    <p>No recipes contain "${searchTerm}" as an ingredient.</p>
                    <p>Try searching for a different ingredient!</p>
                </div>
            `;
            return;
        }

        const tableHTML = `
            <table class="recipes-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Ingredients</th>
                        <th>Steps</th>
                        <th>Cooking Time</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    ${recipes.map(recipe => `
                        <tr>
                            <td class="recipe-name" data-label="Name">${this.escapeHtml(recipe.name)}</td>
                            <td class="recipe-ingredients" data-label="Ingredients">${this.escapeHtml(recipe.ingredients)}</td>
                            <td class="recipe-steps" data-label="Steps">${this.escapeHtml(recipe.steps)}</td>
                            <td class="recipe-time" data-label="Cooking Time">${this.escapeHtml(recipe.cooking_time)}</td>
                            <td class="recipe-image-cell" data-label="Image">
                                ${recipe.image_url ? 
                                    `<img src="${recipe.image_url}" alt="${this.escapeHtml(recipe.name)}" class="recipe-image">` : 
                                    '<div class="no-image-placeholder">No image</div>'
                                }
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        resultsContainer.innerHTML = tableHTML;
        
        // 保存当前搜索的食材，供 AI 建议使用
        this.currentSearchIngredient = searchTerm;
    }

    showLoading() {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = `
            <div class="loading">
                <p>🔍 Searching for recipes...</p>
            </div>
        `;
    }

    showError(message) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>Search Error</h3>
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
    }

    clearSearchResults() {
        const resultsContainer = document.getElementById('search-results');
        const searchInput = document.getElementById('ingredient-search');
        
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
        
        if (searchInput) {
            searchInput.value = '';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // AI 助手功能 - 一直显示在右下角
    createAIAssistant() {
        console.log('🐷 Creating permanent AI Assistant...');
        
        // 检查是否已存在AI助手
        let assistant = document.getElementById('ai-assistant');
        if (!assistant) {
            // 创建AI助手按钮
            const assistantHTML = `
                <button id="ai-assistant" class="ai-assistant" title="Get AI recipe suggestion">
                    🐷
                </button>
            `;
            
            document.body.insertAdjacentHTML('beforeend', assistantHTML);
            assistant = document.getElementById('ai-assistant');
            
            // 绑定点击事件
            assistant.addEventListener('click', () => {
                console.log('🐷 AI Assistant clicked!');
                this.getAISuggestion();
            });
            
            console.log('🐷 AI Assistant created and always visible');
        }
    }
    
    async getAISuggestion() {
        const assistant = document.getElementById('ai-assistant');
        
        // AI助手思考动画
        assistant.classList.add('thinking');
        assistant.disabled = true;
        
        // 显示对话框
        this.showAIDialog();
        
        try {
            // 构建请求数据 - 如果没有搜索的食材，就让AI随机推荐
            let ingredients = [];
            if (this.currentSearchIngredient) {
                ingredients = [this.currentSearchIngredient];
                console.log('🤖 Requesting AI suggestion for searched ingredient:', ingredients);
            } else {
                // 没有搜索的食材，让AI随机推荐
                ingredients = ['surprise me'];
                console.log('🤖 Requesting random AI recipe suggestion');
            }
            
            const response = await fetch(`${this.apiBaseUrl}/suggest-recipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ingredients })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.displayAISuggestion(result.suggestion);
            } else {
                this.showAIError(result.error || 'Failed to get AI suggestion');
            }
            
        } catch (error) {
            console.error('❌ AI suggestion error:', error);
            this.showAIError('Failed to connect to AI service. Please try again.');
        } finally {
            // 移除AI助手思考动画
            assistant.classList.remove('thinking');
            assistant.disabled = false;
        }
    }
    
    showAIDialog() {
        // 检查是否已存在对话框
        let dialog = document.getElementById('ai-dialog');
        if (!dialog) {
            // 创建对话框
            const dialogHTML = `
                <div id="ai-dialog" class="ai-dialog">
                    <div class="ai-dialog-content">
                        <div class="ai-dialog-header">
                            <h3 class="ai-dialog-title">
                                🤖 AI Recipe Suggestion
                            </h3>
                            <button class="ai-dialog-close" id="ai-dialog-close">&times;</button>
                        </div>
                        <div class="ai-dialog-body" id="ai-dialog-body">
                            <!-- AI 建议内容将在这里显示 -->
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', dialogHTML);
            dialog = document.getElementById('ai-dialog');
            
            // 绑定关闭按钮
            const closeBtn = document.getElementById('ai-dialog-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.hideAIDialog();
                });
            }
            
            // 点击背景关闭
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    this.hideAIDialog();
                }
            });
        }
        
        // 显示加载状态
        const dialogBody = document.getElementById('ai-dialog-body');
        dialogBody.innerHTML = `
            <div class="ai-loading">
                <div class="ai-loading-spinner"></div>
                <p>🤖 AI is cooking up a suggestion...</p>
                <p style="font-size: 0.9rem; color: #9ca3af;">This might take a few seconds</p>
            </div>
        `;
        
        // 显示对话框
        dialog.classList.add('show');
    }
    
    hideAIDialog() {
        const dialog = document.getElementById('ai-dialog');
        if (dialog) {
            dialog.classList.remove('show');
        }
    }
    
    displayAISuggestion(suggestion) {
        const dialogBody = document.getElementById('ai-dialog-body');
        
        const suggestionHTML = `
            <div class="ai-suggestion-card">
                <h3 class="ai-recipe-title">${this.escapeHtml(suggestion.title)}</h3>
                
                <div class="ai-recipe-section">
                    <h4>🥗 Ingredients:</h4>
                    <div class="ai-ingredients-text">
                        ${this.escapeHtml(suggestion.ingredients.join(', '))}
                    </div>
                </div>
                
                <div class="ai-recipe-section">
                    <h4>📝 Instructions:</h4>
                    <div class="ai-recipe-content">${this.escapeHtml(suggestion.instructions)}</div>
                </div>
                
                <div class="ai-recipe-section">
                    <h4>⏱️ Cooking Time:</h4>
                    <div class="ai-cooking-time">${this.escapeHtml(suggestion.cookingTime)}</div>
                </div>
                
                <div class="ai-recipe-section">
                    <h4>🌱 Waste Reduction:</h4>
                    <div class="ai-recipe-content">${this.escapeHtml(suggestion.wasteReduction)}</div>
                </div>
            </div>
        `;
        
        dialogBody.innerHTML = suggestionHTML;
    }
    
    showAIError(message) {
        const dialogBody = document.getElementById('ai-dialog-body');
        
        const errorHTML = `
            <div class="ai-error">
                <h4>❌ AI Suggestion Failed</h4>
                <p>${this.escapeHtml(message)}</p>
                <p style="margin-top: 1rem; font-size: 0.9rem;">
                    Please try again, or check if the AI service is running.
                </p>
            </div>
        `;
        
        dialogBody.innerHTML = errorHTML;
    }
}

// 导出搜索功能类
export { SearchPage };