
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
                    title:
