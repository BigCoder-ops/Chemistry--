class Database {
    constructor() {
        this.users = [];
        this.tasks = [];
        this.reports = [];
        this.activities = [];
        this.initDatabase();
    }

    async initDatabase() {
        try {
            // Try to load from localStorage first
            const savedUsers = localStorage.getItem('batteryProject_users');
            const savedTasks = localStorage.getItem('batteryProject_tasks');
            const savedReports = localStorage.getItem('batteryProject_reports');
            const savedActivities = localStorage.getItem('batteryProject_activities');
            
            if (savedUsers && savedTasks && savedReports && savedActivities) {
                this.users = JSON.parse(savedUsers);
                this.tasks = JSON.parse(savedTasks);
                this.reports = JSON.parse(savedReports);
                this.activities = JSON.parse(savedActivities);
            } else {
                // Load from JSON files (for initial setup)
                await this.loadJSONData();
                this.saveToLocalStorage();
            }
        } catch (error) {
            console.error('Error initializing database:', error);
            // Create default data
            this.createDefaultData();
            this.saveToLocalStorage();
        }
    }

    async loadJSONData() {
        try {
            // In a real implementation with a backend, you would fetch these files
            // Since we're static, we'll use the default data
            this.createDefaultData();
        } catch (error) {
            console.error('Error loading JSON data:', error);
            this.createDefaultData();
        }
    }

    createDefaultData() {
        // Use the data from the JSON files above
        this.users = [
            {
                "id": 1,
                "username": "admin",
                "email": "admin@batteryproject.com",
                "password": "admin123",
                "fullName": "System Administrator",
                "role": "admin",
                "group": "Administration",
                "createdAt": "2024-01-01T10:00:00.000Z",
                "lastLogin": new Date().toISOString(),
                "isActive": true
            },
            {
                "id": 2,
                "username": "teacher",
                "email": "teacher@chemistry.edu",
                "password": "teacher123",
                "fullName": "Dr. Sarah Johnson",
                "role": "teacher",
                "group": "Faculty",
                "createdAt": "2024-01-01T10:00:00.000Z",
                "lastLogin": new Date().toISOString(),
                "isActive": true
            },
            {
                "id": 3,
                "username": "student1",
                "email": "alex@student.edu",
                "password": "student123",
                "fullName": "Alex Chen",
                "role": "student",
                "group": "Group A - Lithium Ion",
                "createdAt": "2024-01-01T10:00:00.000Z",
                "lastLogin": new Date().toISOString(),
                "isActive": true
            },
            {
                "id": 4,
                "username": "student2",
                "email": "maya@student.edu",
                "password": "student123",
                "fullName": "Maya Rodriguez",
                "role": "student",
                "group": "Group B - Lead Acid",
                "createdAt": "2024-01-01T10:00:00.000Z",
                "lastLogin": new Date().toISOString(),
                "isActive": true
            },
            {
                "id": 5,
                "username": "student3",
                "email": "james@student.edu",
                "password": "student123",
                "fullName": "James Wilson",
                "role": "student",
                "group": "Group C - Nickel Cadmium",
                "createdAt": "2024-01-01T10:00:00.000Z",
                "lastLogin": new Date().toISOString(),
                "isActive": true
            },
            {
                "id": 6,
                "username": "student4",
                "email": "sophia@student.edu",
                "password": "student123",
                "fullName": "Sophia Kim",
                "role": "student",
                "group": "Group D - Alkaline",
                "createdAt": "2024-01-01T10:00:00.000Z",
                "lastLogin": new Date().toISOString(),
                "isActive": true
            }
        ];

        this.tasks = [
            {
                "id": 1,
                "title": "Research lithium-ion battery chemistry",
                "description": "Conduct literature review on lithium-ion battery technology, focusing on cathode materials (LCO, NMC, LFP) and anode materials (graphite, silicon). Document energy density, cycle life, and safety characteristics.",
                "assignedTo": [3],
                "createdBy": 2,
                "status": "in-progress",
                "priority": "high",
                "category": "research",
                "batteryType": "lithium-ion",
                "experimentPhase": "planning",
                "dueDate": "2024-01-10",
                "createdAt": "2024-01-01T09:00:00.000Z",
                "progress": 75,
                "comments": [
                    {
                        "userId": 3,
                        "text": "Found excellent review paper on NMC cathode stability",
                        "createdAt": "2024-01-02T14:30:00.000Z"
                    }
                ],
                "attachments": []
            },
            {
                "id": 2,
                "title": "Test battery capacity and discharge rates",
                "description": "Perform capacity testing on different battery types using multimeter and discharge tester. Measure voltage drop over time under different load conditions.",
                "assignedTo": [3, 4],
                "createdBy": 2,
                "status": "pending",
                "priority": "medium",
                "category": "experiment",
                "batteryType": "lead-acid",
                "experimentPhase": "testing",
                "dueDate": "2024-01-15",
                "createdAt": "2024-01-01T10:00:00.000Z",
                "progress": 30,
                "comments": [],
                "attachments": []
            },
            {
                "id": 3,
                "title": "Prepare final presentation slides",
                "description": "Create presentation slides for final project defense. Include introduction, methodology, results, analysis, and conclusion sections.",
                "assignedTo": [5, 6],
                "createdBy": 2,
                "status": "pending",
                "priority": "high",
                "category": "presentation",
                "experimentPhase": "conclusion",
                "dueDate": "2024-01-22",
                "createdAt": "2024-01-01T11:00:00.000Z",
                "progress": 20,
                "comments": [],
                "attachments": []
            },
            {
                "id": 4,
                "title": "Analyze battery efficiency data",
                "description": "Process collected data from battery tests. Calculate efficiency, internal resistance, and compare performance across battery types.",
                "assignedTo": [4],
                "createdBy": 2,
                "status": "in-progress",
                "priority": "medium",
                "category": "analysis",
                "batteryType": "all",
                "experimentPhase": "analysis",
                "dueDate": "2024-01-12",
                "createdAt": "2024-01-02T09:00:00.000Z",
                "progress": 50,
                "comments": [],
                "attachments": []
            },
            {
                "id": 5,
                "title": "Document safety procedures",
                "description": "Create safety documentation for handling different battery types. Include procedures for charging, discharging, and emergency protocols.",
                "assignedTo": [5],
                "createdBy": 2,
                "status": "completed",
                "priority": "low",
                "category": "documentation",
                "dueDate": "2024-01-05",
                "createdAt": "2024-01-02T10:00:00.000Z",
                "completedDate": "2024-01-05T16:00:00.000Z",
                "progress": 100,
                "comments": [
                    {
                        "userId": 2,
                        "text": "Excellent work! Safety procedures approved.",
                        "createdAt": "2024-01-05T17:00:00.000Z"
                    }
                ],
                "attachments": [
                    {
                        "filename": "safety_procedures.pdf",
                        "url": "#",
                        "uploadedAt": "2024-01-05T15:30:00.000Z"
                    }
                ]
            },
            {
                "id": 6,
                "title": "Compare environmental impact",
                "description": "Research and compare environmental impact of different battery chemistries. Consider recycling potential, toxicity, and carbon footprint.",
                "assignedTo": [6],
                "createdBy": 2,
                "status": "in-progress",
                "priority": "medium",
                "category": "research",
                "experimentPhase": "analysis",
                "dueDate": "2024-01-18",
                "createdAt": "2024-01-03T09:00:00.000Z",
                "progress": 60,
                "comments": [],
                "attachments": []
            }
        ];

        this.reports = [
            {
                "id": 1,
                "title": "Weekly Progress Report - Week 1",
                "type": "weekly",
                "content": "This week, we focused on literature review and project planning. We identified key areas for research: lithium-ion vs lead-acid batteries comparison. Initial research indicates lithium-ion batteries have higher energy density but lead-acid is more cost-effective for certain applications.\n\nTasks completed:\n1. Project timeline established\n2. Literature review started\n3. Safety procedures documented\n\nNext week: Begin experimental setup and initial testing.",
                "createdBy": 3,
                "group": "Group A - Lithium Ion",
                "experimentDate": "2024-01-05",
                "batteryData": {
                    "voltage": 3.7,
                    "capacity": 2500,
                    "temperature": 25,
                    "efficiency": 95,
                    "notes": "Initial measurements on standard lithium-ion cell"
                },
                "attachments": [],
                "status": "approved",
                "reviewerComments": "Good progress. Make sure to include more quantitative data in next report.",
                "reviewedBy": 2,
                "createdAt": "2024-01-05T16:00:00.000Z",
                "updatedAt": "2024-01-06T10:00:00.000Z"
            },
            {
                "id": 2,
                "title": "Lead Acid Battery Test Results",
                "type": "experiment",
                "content": "Experiment conducted on 12V lead-acid battery:\n\nProcedure:\n1. Fully charged battery using standard charger\n2. Applied constant 5A load using resistor bank\n3. Measured voltage every 15 minutes\n4. Recorded until voltage dropped to 10.5V\n\nResults:\n- Initial voltage: 12.8V\n- Final voltage: 10.5V\n- Discharge time: 2 hours 15 minutes\n- Calculated capacity: 11.25Ah\n- Temperature increase: 8°C\n\nConclusion: Battery performed within expected parameters. Some voltage sag observed under load.",
                "createdBy": 4,
                "group": "Group B - Lead Acid",
                "experimentDate": "2024-01-08",
                "batteryData": {
                    "voltage": 12.8,
                    "capacity": 11.25,
                    "temperature": 33,
                    "efficiency": 85,
                    "notes": "Temperature rose significantly during discharge"
                },
                "attachments": [],
                "status": "submitted",
                "reviewerComments": "",
                "reviewedBy": null,
                "createdAt": "2024-01-08T14:30:00.000Z",
                "updatedAt": "2024-01-08T14:30:00.000Z"
            },
            {
                "id": 3,
                "title": "Cost Analysis Comparison",
                "type": "analysis",
                "content": "Comparative analysis of battery costs:\n\n1. Lithium-ion (18650 cell):\n   - Unit cost: $5.50\n   - Energy density: 250 Wh/kg\n   - Cycle life: 500 cycles\n   - Cost per cycle: $0.011\n\n2. Lead-acid (12V 7Ah):\n   - Unit cost: $25.00\n   - Energy density: 30 Wh/kg\n   - Cycle life: 300 cycles\n   - Cost per cycle: $0.083\n\n3. Nickel-cadmium (AA size):\n   - Unit cost: $3.00\n   - Energy density: 60 Wh/kg\n   - Cycle life: 1000 cycles\n   - Cost per cycle: $0.003\n\nConclusion: Nickel-cadmium has lowest cost per cycle but environmental concerns exist.",
                "createdBy": 5,
                "group": "Group C - Nickel Cadmium",
                "experimentDate": null,
                "batteryData": {
                    "notes": "Theoretical analysis based on market prices"
                },
                "attachments": [],
                "status": "draft",
                "reviewerComments": "",
                "reviewedBy": null,
                "createdAt": "2024-01-09T11:00:00.000Z",
                "updatedAt": "2024-01-09T11:00:00.000Z"
            }
        ];

        this.activities = [
            {
                "id": 1,
                "type": "user_login",
                "title": "User logged in",
                "description": "Dr. Sarah Johnson logged into the system",
                "userId": 2,
                "timestamp": "2024-01-09T09:15:00.000Z"
            },
            {
                "id": 2,
                "type": "task_created",
                "title": "New task created",
                "description": "Dr. Sarah Johnson created task: Compare environmental impact",
                "userId": 2,
                "timestamp": "2024-01-09T09:30:00.000Z"
            },
            {
                "id": 3,
                "type": "task_updated",
                "title": "Task updated",
                "description": "Alex Chen updated task: Research lithium-ion battery chemistry (Progress: 50% → 75%)",
                "userId": 3,
                "timestamp": "2024-01-09T10:45:00.000Z"
            },
            {
                "id": 4,
                "type": "report_submitted",
                "title": "Report submitted",
                "description": "Maya Rodriguez submitted report: Lead Acid Battery Test Results",
                "userId": 4,
                "timestamp": "2024-01-09T14:30:00.000Z"
            },
            {
                "id": 5,
                "type": "task_completed",
                "title": "Task completed",
                "description": "James Wilson completed task: Document safety procedures",
                "userId": 5,
                "timestamp": "2024-01-09T16:00:00.000Z"
            },
            {
                "id": 6,
                "type": "user_registered",
                "title": "New user registered",
                "description": "New student joined the project",
                "userId": 6,
                "timestamp": "2024-01-08T11:00:00.000Z"
            },
            {
                "id": 7,
                "type": "project_updated",
                "title": "Project milestone reached",
                "description": "Overall project progress: 45% complete",
                "userId": 1,
                "timestamp": "2024-01-08T17:00:00.000Z"
            },
            {
                "id": 8,
                "type": "report_reviewed",
                "title": "Report reviewed",
                "description": "Dr. Sarah Johnson reviewed and approved weekly progress report",
                "userId": 2,
                "timestamp": "2024-01-07T10:00:00.000Z"
            }
        ];
    }

    saveToLocalStorage() {
        localStorage.setItem('batteryProject_users', JSON.stringify(this.users));
        localStorage.setItem('batteryProject_tasks', JSON.stringify(this.tasks));
        localStorage.setItem('batteryProject_reports', JSON.stringify(this.reports));
        localStorage.setItem('batteryProject_activities', JSON.stringify(this.activities));
    }

    // User methods
    getUsers() {
        return this.users;
    }

    getUser(id) {
        return this.users.find(user => user.id === id);
    }

    getUserByUsername(username) {
        return this.users.find(user => 
            user.username === username || user.email === username
        );
    }

    createUser(userData) {
        const newId = this.users.length > 0 
            ? Math.max(...this.users.map(u => u.id)) + 1 
            : 1;
        
        const newUser = {
            id: newId,
            ...userData,
            createdAt: new Date().toISOString(),
            isActive: true,
            lastLogin: null
        };
        
        this.users.push(newUser);
        this.saveToLocalStorage();
        return newUser;
    }

    updateUser(id, updates) {
        const index = this.users.findIndex(user => user.id === id);
        
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updates };
            this.saveToLocalStorage();
            return this.users[index];
        }
        return null;
    }

    deleteUser(id) {
        const initialLength = this.users.length;
        this.users = this.users.filter(user => user.id !== id);
        
        if (this.users.length < initialLength) {
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Task methods (same as before, but using this.tasks)
    getTasks() {
        return this.tasks;
    }

    getTask(id) {
        return this.tasks.find(task => task.id === id);
    }

    createTask(taskData) {
        const newId = this.tasks.length > 0 
            ? Math.max(...this.tasks.map(t => t.id)) + 1 
            : 1;
        
        const newTask = {
            id: newId,
            ...taskData,
            createdAt: new Date().toISOString(),
            progress: taskData.progress || 0,
            comments: taskData.comments || [],
            attachments: taskData.attachments || []
        };
        
        this.tasks.push(newTask);
        this.saveToLocalStorage();
        return newTask;
    }

    updateTask(id, updates) {
        const index = this.tasks.findIndex(task => task.id === id);
        
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updates };
            this.saveToLocalStorage();
            return this.tasks[index];
        }
        return null;
    }

    deleteTask(id) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== id);
        
        if (this.tasks.length < initialLength) {
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Report methods
    getReports() {
        return this.reports;
    }

    createReport(reportData) {
        const newId = this.reports.length > 0 
            ? Math.max(...this.reports.map(r => r.id)) + 1 
            : 1;
        
        const newReport = {
            id: newId,
            ...reportData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: reportData.status || 'draft',
            reviewerComments: reportData.reviewerComments || '',
            reviewedBy: reportData.reviewedBy || null
        };
        
        this.reports.push(newReport);
        this.saveToLocalStorage();
        return newReport;
    }

    updateReport(id, updates) {
        const index = this.reports.findIndex(report => report.id === id);
        
        if (index !== -1) {
            this.reports[index] = { 
                ...this.reports[index], 
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveToLocalStorage();
            return this.reports[index];
        }
        return null;
    }

    deleteReport(id) {
        const initialLength = this.reports.length;
        this.reports = this.reports.filter(report => report.id !== id);
        
        if (this.reports.length < initialLength) {
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Activity methods
    getActivities(limit = 10) {
        const sortedActivities = [...this.activities].sort((a, b)
