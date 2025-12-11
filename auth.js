class Auth {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('batteryProject_currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
    }

    async login(username, password) {
        try {
            const user = db.getUserByUsername(username);
            
            if (!user) {
                throw new Error('User not found');
            }
            
            if (!user.isActive) {
                throw new Error('Account is disabled');
            }
            
            // Simple password check (in real app, use proper hashing)
            if (user.password !== password) {
                throw new Error('Invalid password');
            }
            
            this.currentUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                group: user.group
            };
            
            // Save to localStorage
            localStorage.setItem('batteryProject_currentUser', JSON.stringify(this.currentUser));
            
            // Add activity
            db.addActivity({
                type: 'user_login',
                title: 'User logged in',
                description: `${user.fullName} logged into the system`,
                userId: user.id
            });
            
            // Update last login
            db.updateUser(user.id, { lastLogin: new Date().toISOString() });
            
            this.updateUI();
            return { success: true, user: this.currentUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async register(userData) {
        try {
            // Check if user already exists
            const existingUser = db.getUserByUsername(userData.username) || 
                               db.getUserByUsername(userData.email);
            
            if (existingUser) {
                throw new Error('Username or email already exists');
            }
            
            // Validate password
            if (userData.password !== userData.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            
            if (userData.password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }
            
            // Create user
            const newUser = db.createUser({
                username: userData.username,
                email: userData.email,
                password: userData.password,
                fullName: userData.fullName,
                role: userData.role,
                group: userData.group
            });
            
            // Add activity
            db.addActivity({
                type: 'user_registered',
                title: 'New user registered',
                description: `${userData.fullName} joined the project as ${userData.role}`,
                userId: newUser.id
            });
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    logout() {
        // Add activity before logout
        if (this.currentUser) {
            db.addActivity({
                type: 'user_logout',
                title: 'User logged out',
                description: `${this.currentUser.fullName} logged out`,
                userId: this.currentUser.id
            });
        }
        
        this.currentUser = null;
        localStorage.removeItem('batteryProject_currentUser');
        
        // Redirect to login page
        window.location.href = 'index.html';
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    isTeacher() {
        return this.currentUser && (this.currentUser.role === 'teacher' || this.currentUser.role === 'admin');
    }

    updateUI() {
        // Update UI elements based on authentication state
        const currentUserElement = document.getElementById('currentUser');
        const adminLink = document.getElementById('adminLink');
        
        if (currentUserElement && this.currentUser) {
            currentUserElement.textContent = this.currentUser.fullName;
        }
        
        if (adminLink) {
            adminLink.style.display = this.isAdmin() ? 'flex' : 'none';
        }
        
        // Protect admin pages
        if (window.location.pathname.includes('admin.html') && !this.isAdmin()) {
            window.location.href = 'dashboard.html';
        }
        
        // Redirect to dashboard if logged in and on login page
        if (window.location.pathname.includes('index.html') && this.isLoggedIn()) {
            window.location.href = 'dashboard.html';
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Create global auth instance
const auth = new Auth();
