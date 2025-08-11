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
        console.log('🔍 Search functionality initialized');
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

            .search-results-header {
                margin-bottom: 2rem;
                font-size: 1.4rem;
                font-weight: 600;
                color: #374151;
                text-align: center;
                padding: 1.5rem;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 12px;
                border: 1px solid #e5e7eb;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
}

// 导出搜索功能类
export { SearchPage };