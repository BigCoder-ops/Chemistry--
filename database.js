class Database {
    constructor() {
        this.initDatabase();
    }

    initDatabase() {
        // Initialize empty databases if they don't exist
        if (!localStorage.getItem('batteryProject_users')) {
            const defaultUsers = [
                {
                    id: 1,
                    username: 'admin',
                    email: 'admin@project.com',
                    password: 'admin123',
                    fullName: 'System Administrator',
                    role: 'admin',
                    group: 'Administration',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 2,
                    username: 'teacher',
                    email: 'teacher@project.com',
                    password: 'teacher123',
                    fullName: 'Chemistry Teacher',
                    role: 'teacher',
                    group: 'Faculty',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 3,
                    username: 'student',
                    email: 'student@project.com',
                    password: 'student123',
                    fullName: 'Chemistry Student',
                    role: 'student',
                    group: 'Group A',
                    createdAt: new Date().toISOString(),
                    isActive: true
                }
            ];
            localStorage.setItem('batteryProject_users', JSON.stringify(defaultUsers));
        }

        if (!localStorage.getItem('batteryProject_tasks')) {
            const defaultTasks = [
                {
                    id: 1,
                    title: 'Research lithium-ion battery chemistry',
                    description: 'Conduct literature review on lithium-ion battery technology',
                    assignedTo: [3],
                    createdBy: 2,
                    status: 'in-progress',
                    priority: 'high',
                    category: 'research',
                    batteryType: 'lithium-ion',
                    dueDate: '2024-01-10',
                    progress: 75,
                    comments: [],
                    attachments: []
                },
                {
                    id: 2,
                    title: 'Test battery capacity',
                    description: 'Perform capacity testing on different battery types',
                    assignedTo: [3],
                    createdBy: 2,
                    status: 'pending',
                    priority: 'medium',
                    category: 'experiment',
                    batteryType: 'lead-acid',
                    dueDate: '2024-01-15',
                    progress: 30,
                    comments: [],
                    attachments: []
                },
                {
                    id: 3,
                    title: 'Prepare final presentation',
                    description: 'Create presentation slides for final project defense',
                    assignedTo: [3],
                    createdBy: 2,
                    status: 'pending',
                    priority: 'high',
                    category: 'presentation',
                    dueDate: '2024-01-22',
                    progress: 20,
                    comments: [],
                    attachments: []
                }
            ];
            localStorage.setItem('batteryProject_tasks', JSON.stringify(defaultTasks));
        }

        if (!localStorage.getItem('batteryProject_reports')) {
            localStorage.setItem('batteryProject_reports', JSON.stringify([]));
        }

        if (!localStorage.getItem('batteryProject_activities')) {
            const defaultActivities = [
                {
                    id: 1,
                    type: 'task_created',
                    title: 'New task assigned',
                    description: 'Research task created for lithium-ion batteries',
                    userId: 2,
                    timestamp: new Date().toISOString()
                },
                {
                    id: 2,
                    type: 'user_registered',
                    title: 'New user registered',
                    description: 'Chemistry student joined the project',
                    userId: 3,
                    timestamp: new Date().toISOString()
                }
            ];
            localStorage.setItem('batteryProject_activities', JSON.stringify(defaultActivities));
        }
    }

    // User methods
    getUsers() {
        return JSON.parse(localStorage.getItem('batteryProject_users')) || [];
    }

    getUser(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(user => user.username === username || user.email === username);
    }

    createUser(userData) {
        const users = this.getUsers();
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        
        const newUser = {
            id: newId,
            ...userData,
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        users.push(newUser);
        localStorage.setItem('batteryProject_users', JSON.stringify(users));
        return newUser;
    }

    updateUser(id, updates) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === id);
        
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem('batteryProject_users', JSON.stringify(users));
            return users[index];
        }
        return null;
    }

    deleteUser(id) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== id);
        localStorage.setItem('batteryProject_users', JSON.stringify(filteredUsers));
        return true;
    }

    // Task methods
    getTasks() {
        return JSON.parse(localStorage.getItem('batteryProject_tasks')) || [];
    }

    getTask(id) {
        const tasks = this.getTasks();
        return tasks.find(task => task.id === id);
    }

    createTask(taskData) {
        const tasks = this.getTasks();
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        
        const newTask = {
            id: newId,
            ...taskData,
            createdAt: new Date().toISOString(),
            progress: 0,
            comments: [],
            attachments: []
        };
        
        tasks.push(newTask);
        localStorage.setItem('batteryProject_tasks', JSON.stringify(tasks));
        return newTask;
    }

    updateTask(id, updates) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(task => task.id === id);
        
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            localStorage.setItem('batteryProject_tasks', JSON.stringify(tasks));
            return tasks[index];
        }
        return null;
    }

    deleteTask(id) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('batteryProject_tasks', JSON.stringify(filteredTasks));
        return true;
    }

    // Report methods
    getReports() {
        return JSON.parse(localStorage.getItem('batteryProject_reports')) || [];
    }

    createReport(reportData) {
        const reports = this.getReports();
        const newId = reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1;
        
        const newReport = {
            id: newId,
            ...reportData,
            createdAt: new Date().toISOString(),
            status: 'draft'
        };
        
        reports.push(newReport);
        localStorage.setItem('batteryProject_reports', JSON.stringify(reports));
        return newReport;
    }

    // Activity methods
    getActivities(limit = 10) {
        const activities = JSON.parse(localStorage.getItem('batteryProject_activities')) || [];
        return activities.slice(0, limit);
    }

    addActivity(activityData) {
        const activities = JSON.parse(localStorage.getItem('batteryProject_activities')) || [];
        const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
        
        const newActivity = {
            id: newId,
            ...activityData,
            timestamp: new Date().toISOString()
        };
        
        activities.unshift(newActivity); // Add to beginning
        localStorage.setItem('batteryProject_activities', JSON.stringify(activities));
        return newActivity;
    }

    // Statistics
    getStatistics() {
        const users = this.getUsers();
        const tasks = this.getTasks();
        const reports = this.getReports();
        
        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.isActive).length;
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const pendingTasks = tasks.filter(t => t.status === 'pending').length;
        const totalReports = reports.length;
        
        const totalProgress = tasks.length > 0 
            ? Math.round(tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / tasks.length)
            : 0;
        
        return {
            totalUsers,
            activeUsers,
            totalTasks,
            completedTasks,
            pendingTasks,
            totalReports,
            totalProgress
        };
    }
}

// Create global database instance
const db = new Database();
