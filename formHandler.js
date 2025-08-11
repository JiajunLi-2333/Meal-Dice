// 表单提交处理
class RecipeSubmission {
    constructor() {
        this.form = document.querySelector('.share-form');
        this.submitButton = document.querySelector('.share-button');
        this.apiBaseUrl = 'http://localhost:3001/api';
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            console.log('📝 Form handler initialized');
            
            // 测试服务器连接
            this.testServerConnection();
        }
    }

    async testServerConnection() {
        try {
            console.log('🔌 Testing server connection...');
            const response = await fetch(`${this.apiBaseUrl}/health`);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Server connection successful:', data);
            } else {
                console.warn('⚠️ Server responded with error:', response.status);
            }
        } catch (error) {
            console.error('❌ Server connection failed:', error);
            this.showMessage('⚠️ Backend server is not running. Please start the server first.', 'warning');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        console.log('📤 Form submission started');
        
        // 获取表单数据
        const formData = new FormData();
        const nameInput = this.form.querySelector('.name-input');
        const ingredientsInput = this.form.querySelector('.ingredients-input');
        const stepsInput = this.form.querySelector('.steps-input');
        const cookingTimeInput = this.form.querySelector('.cooking-time-input');
        const imageInput = this.form.querySelector('#photo-upload');

        // 验证必填字段
        if (!nameInput.value.trim() || !ingredientsInput.value.trim() || 
            !stepsInput.value.trim() || !cookingTimeInput.value.trim()) {
            this.showMessage('Please fill in all required fields!', 'error');
            return;
        }

        // 添加数据到FormData
        formData.append('name', nameInput.value.trim());
        formData.append('ingredients', ingredientsInput.value.trim());
        formData.append('steps', stepsInput.value.trim());
        formData.append('cooking_time', cookingTimeInput.value.trim());
        
        // 如果有图片，添加到FormData
        if (imageInput.files[0]) {
            formData.append('image', imageInput.files[0]);
            console.log('📷 Image file selected:', imageInput.files[0].name);
        }

        // 打印表单数据进行调试
        console.log('📋 Form data to submit:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value);
        }

        // 显示加载状态
        this.setLoadingState(true);

        try {
            console.log('🚀 Sending request to:', `${this.apiBaseUrl}/recipes`);
            
            const response = await fetch(`${this.apiBaseUrl}/recipes`, {
                method: 'POST',
                body: formData,
                // 不设置Content-Type，让浏览器自动设置multipart/form-data
            });

            console.log('📥 Response received:', response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Server response:', result);

            if (result.success) {
                this.showMessage('Recipe shared successfully! 🎉', 'success');
                this.resetForm();
            } else {
                this.showMessage(result.error || 'Failed to share recipe', 'error');
            }
        } catch (error) {
            console.error('❌ Error submitting recipe:', error);
            
            // 更详细的错误信息
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.showMessage('❌ Cannot connect to server. Please make sure the backend server is running on port 3001.', 'error');
            } else if (error.message.includes('HTTP error')) {
                this.showMessage(`❌ Server error: ${error.message}`, 'error');
            } else {
                this.showMessage('❌ Network error. Please try again.', 'error');
            }
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.textContent = 'Sharing...';
            this.submitButton.style.opacity = '0.6';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Share';
            this.submitButton.style.opacity = '1';
        }
    }

    showMessage(message, type) {
        // 移除已存在的消息
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 创建新消息
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;

        // 样式
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b'
        };

        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 350px;
            word-wrap: break-word;
            background-color: ${colors[type] || colors.error};
        `;

        document.body.appendChild(messageDiv);

        // 根据消息类型设置自动移除时间
        const removeTime = type === 'warning' ? 5000 : 3000;
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, removeTime);
    }

    resetForm() {
        this.form.reset();
        
        // 重置文件上传标签
        const uploadLabel = this.form.querySelector('.upload-label span');
        if (uploadLabel) {
            uploadLabel.textContent = 'Upload Photo (Optional)';
        }
    }
}

// 文件上传预览功能
function initFileUpload() {
    const fileInput = document.querySelector('#photo-upload');
    const uploadLabel = document.querySelector('.upload-label span');

    if (fileInput && uploadLabel) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // 验证文件类型
                if (!file.type.startsWith('image/')) {
                    alert('Please select an image file!');
                    this.value = '';
                    uploadLabel.textContent = 'Upload Photo (Optional)';
                    return;
                }

                // 验证文件大小 (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB!');
                    this.value = '';
                    uploadLabel.textContent = 'Upload Photo (Optional)';
                    return;
                }

                uploadLabel.textContent = `Selected: ${file.name}`;
                console.log('📷 File selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
            } else {
                uploadLabel.textContent = 'Upload Photo (Optional)';
            }
        });
    }
}

// 添加CSS动画
const animationCSS = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .share-button:disabled {
        cursor: not-allowed !important;
    }

    .upload-label {
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .upload-label:hover {
        background-color: #f3f4f6;
    }
`;

// 添加样式到页面
const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

// 导出类以便在main.js中使用
export { RecipeSubmission, initFileUpload };