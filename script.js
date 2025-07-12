// Password Complexity Checker
class PasswordChecker {
    constructor() {
        this.passwordInput = document.getElementById('password');
        this.togglePassword = document.getElementById('togglePassword');
        this.strengthText = document.getElementById('strengthText');
        this.strengthBar = document.getElementById('strengthBar');
        this.scoreValue = document.getElementById('scoreValue');
        this.lengthScore = document.getElementById('lengthScore');
        this.varietyScore = document.getElementById('varietyScore');
        this.complexityScore = document.getElementById('complexityScore');
        this.feedbackList = document.getElementById('feedbackList');
        this.generatePasswordBtn = document.getElementById('generatePassword');
        this.clearPasswordBtn = document.getElementById('clearPassword');
        
        this.criteriaElements = {
            length: document.getElementById('lengthCriterion'),
            uppercase: document.getElementById('uppercaseCriterion'),
            lowercase: document.getElementById('lowercaseCriterion'),
            number: document.getElementById('numberCriterion'),
            special: document.getElementById('specialCriterion'),
            unique: document.getElementById('uniqueCriterion')
        };
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Real-time password checking
        this.passwordInput.addEventListener('input', () => {
            this.checkPassword();
        });
        
        // Toggle password visibility
        this.togglePassword.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
        
        // Generate password
        this.generatePasswordBtn.addEventListener('click', () => {
            this.generateStrongPassword();
        });
        
        // Clear password
        this.clearPasswordBtn.addEventListener('click', () => {
            this.clearPassword();
        });
        
        // Enter key to generate password
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateStrongPassword();
            }
        });
    }
    
    checkPassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.resetDisplay();
            return;
        }
        
        const criteria = this.checkCriteria(password);
        const score = this.calculateScore(password, criteria);
        const strength = this.determineStrength(score);
        
        this.updateDisplay(criteria, score, strength);
        this.updateFeedback(password, criteria, score);
    }
    
    checkCriteria(password) {
        const criteria = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            unique: new Set(password).size === password.length
        };
        
        return criteria;
    }
    
    calculateScore(password, criteria) {
        let score = 0;
        let lengthBonus = 0;
        let varietyScore = 0;
        let complexityScore = 0;
        
        // Length bonus (up to 25 points)
        if (password.length >= 8) {
            lengthBonus = Math.min(25, (password.length - 8) * 2 + 10);
        }
        
        // Character variety (up to 30 points)
        let varietyCount = 0;
        if (criteria.uppercase) varietyCount++;
        if (criteria.lowercase) varietyCount++;
        if (criteria.number) varietyCount++;
        if (criteria.special) varietyCount++;
        varietyScore = varietyCount * 7.5;
        
        // Complexity bonus (up to 45 points)
        if (criteria.unique) complexityScore += 15;
        if (password.length >= 12) complexityScore += 10;
        if (password.length >= 16) complexityScore += 10;
        if (password.length >= 20) complexityScore += 10;
        
        // Additional complexity for mixed character types
        if (criteria.uppercase && criteria.lowercase && criteria.number && criteria.special) {
            complexityScore += 20;
        } else if ((criteria.uppercase && criteria.lowercase && criteria.number) || 
                   (criteria.uppercase && criteria.lowercase && criteria.special) ||
                   (criteria.uppercase && criteria.number && criteria.special) ||
                   (criteria.lowercase && criteria.number && criteria.special)) {
            complexityScore += 15;
        }
        
        score = Math.min(100, lengthBonus + varietyScore + complexityScore);
        
        return {
            total: Math.round(score),
            length: Math.round(lengthBonus),
            variety: Math.round(varietyScore),
            complexity: Math.round(complexityScore)
        };
    }
    
    determineStrength(score) {
        if (score.total >= 80) return 'very-strong';
        if (score.total >= 60) return 'strong';
        if (score.total >= 40) return 'medium';
        if (score.total >= 20) return 'weak';
        return 'very-weak';
    }
    
    updateDisplay(criteria, score, strength) {
        // Update criteria indicators
        Object.keys(criteria).forEach(key => {
            const element = this.criteriaElements[key];
            if (element) {
                element.classList.remove('valid', 'invalid');
                element.classList.add(criteria[key] ? 'valid' : 'invalid');
            }
        });
        
        // Update strength meter
        const strengthLabels = {
            'very-weak': 'Very Weak',
            'weak': 'Weak',
            'medium': 'Medium',
            'strong': 'Strong',
            'very-strong': 'Very Strong'
        };
        
        const strengthPercentages = {
            'very-weak': 20,
            'weak': 40,
            'medium': 60,
            'strong': 80,
            'very-strong': 100
        };
        
        this.strengthText.textContent = strengthLabels[strength];
        this.strengthText.className = `strength-text ${strength}`;
        this.strengthBar.className = `strength-progress ${strength}`;
        this.strengthBar.style.width = `${strengthPercentages[strength]}%`;
        
        // Update score display
        this.scoreValue.textContent = score.total;
        this.lengthScore.textContent = score.length;
        this.varietyScore.textContent = score.variety;
        this.complexityScore.textContent = score.complexity;
    }
    
    updateFeedback(password, criteria, score) {
        this.feedbackList.innerHTML = '';
        
        const feedback = [];
        
        // Positive feedback
        if (score.total >= 80) {
            feedback.push({
                type: 'positive',
                icon: 'fas fa-check-circle',
                message: 'Excellent! This is a very strong password.'
            });
        } else if (score.total >= 60) {
            feedback.push({
                type: 'positive',
                icon: 'fas fa-thumbs-up',
                message: 'Good password strength. Consider adding more complexity for better security.'
            });
        }
        
        if (password.length >= 12) {
            feedback.push({
                type: 'positive',
                icon: 'fas fa-ruler-horizontal',
                message: 'Great length! Longer passwords are harder to crack.'
            });
        }
        
        if (criteria.unique) {
            feedback.push({
                type: 'positive',
                icon: 'fas fa-fingerprint',
                message: 'No repeated characters - excellent for security!'
            });
        }
        
        // Suggestions for improvement
        if (!criteria.length) {
            feedback.push({
                type: 'negative',
                icon: 'fas fa-exclamation-triangle',
                message: 'Password should be at least 8 characters long.'
            });
        }
        
        if (!criteria.uppercase) {
            feedback.push({
                type: 'negative',
                icon: 'fas fa-font',
                message: 'Add uppercase letters (A-Z) to increase complexity.'
            });
        }
        
        if (!criteria.lowercase) {
            feedback.push({
                type: 'negative',
                icon: 'fas fa-font',
                message: 'Add lowercase letters (a-z) to increase complexity.'
            });
        }
        
        if (!criteria.number) {
            feedback.push({
                type: 'negative',
                icon: 'fas fa-hashtag',
                message: 'Add numbers (0-9) to increase complexity.'
            });
        }
        
        if (!criteria.special) {
            feedback.push({
                type: 'negative',
                icon: 'fas fa-exclamation-triangle',
                message: 'Add special characters (!@#$%^&*) to increase complexity.'
            });
        }
        
        if (!criteria.unique) {
            feedback.push({
                type: 'neutral',
                icon: 'fas fa-info-circle',
                message: 'Consider using unique characters to avoid patterns.'
            });
        }
        
        if (password.length < 12) {
            feedback.push({
                type: 'neutral',
                icon: 'fas fa-arrow-up',
                message: 'Consider making your password longer (12+ characters) for better security.'
            });
        }
        
        // Security tips
        if (score.total < 60) {
            feedback.push({
                type: 'neutral',
                icon: 'fas fa-lightbulb',
                message: 'Tip: Use a mix of letters, numbers, and symbols for maximum security.'
            });
        }
        
        // Render feedback
        feedback.forEach(item => {
            const feedbackItem = document.createElement('div');
            feedbackItem.className = `feedback-item ${item.type}`;
            feedbackItem.innerHTML = `
                <i class="${item.icon}"></i>
                <span>${item.message}</span>
            `;
            this.feedbackList.appendChild(feedbackItem);
        });
    }
    
    resetDisplay() {
        // Reset strength meter
        this.strengthText.textContent = 'Enter a password';
        this.strengthText.className = 'strength-text';
        this.strengthBar.className = 'strength-progress';
        this.strengthBar.style.width = '0%';
        
        // Reset criteria
        Object.values(this.criteriaElements).forEach(element => {
            if (element) {
                element.classList.remove('valid', 'invalid');
            }
        });
        
        // Reset scores
        this.scoreValue.textContent = '0';
        this.lengthScore.textContent = '0';
        this.varietyScore.textContent = '0';
        this.complexityScore.textContent = '0';
        
        // Reset feedback
        this.feedbackList.innerHTML = '<p class="placeholder-text">Enter a password to see recommendations</p>';
    }
    
    togglePasswordVisibility() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        
        const icon = this.togglePassword.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    }
    
    generateStrongPassword() {
        const length = 16;
        const charset = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
        
        let password = '';
        
        // Ensure at least one character from each category
        password += this.getRandomChar(charset.uppercase);
        password += this.getRandomChar(charset.lowercase);
        password += this.getRandomChar(charset.numbers);
        password += this.getRandomChar(charset.symbols);
        
        // Fill the rest with random characters
        const allChars = charset.uppercase + charset.lowercase + charset.numbers + charset.symbols;
        for (let i = 4; i < length; i++) {
            password += this.getRandomChar(allChars);
        }
        
        // Shuffle the password
        password = this.shuffleString(password);
        
        this.passwordInput.value = password;
        this.passwordInput.type = 'text';
        this.togglePassword.querySelector('i').className = 'fas fa-eye-slash';
        this.checkPassword();
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.passwordInput.type = 'password';
            this.togglePassword.querySelector('i').className = 'fas fa-eye';
        }, 3000);
    }
    
    getRandomChar(str) {
        return str.charAt(Math.floor(Math.random() * str.length));
    }
    
    shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }
    
    clearPassword() {
        this.passwordInput.value = '';
        this.passwordInput.type = 'password';
        this.togglePassword.querySelector('i').className = 'fas fa-eye';
        this.resetDisplay();
        this.passwordInput.focus();
    }
}

// Initialize the password checker when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordChecker();
});

// Add some nice animations and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to strength bar
    const strengthBar = document.getElementById('strengthBar');
    strengthBar.classList.add('loading');
    
    setTimeout(() => {
        strengthBar.classList.remove('loading');
    }, 1000);
    
    // Add focus effects
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('focus', () => {
        passwordInput.parentElement.style.transform = 'scale(1.02)';
    });
    
    passwordInput.addEventListener('blur', () => {
        passwordInput.parentElement.style.transform = 'scale(1)';
    });
}); 