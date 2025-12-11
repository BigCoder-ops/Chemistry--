// Global variables
let currentModal = null;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Initialize current date
    updateCurrentDate();
    
    // Setup event listeners based on current page
    const path = window.location.pathname;
    
    if (path.includes('index.html')) {
        setupLoginPage();
    } else if (path.includes('dashboard.html')) {
        setupDashboard();
    } else if (path.includes('tasks.html')) {
        setupTasksPage();
    } else if (path.includes('reports.html')) {
        setupReportsPage();
    } else if (path.includes('admin.html')) {
        setupAdminPage();
    }
    
    // Common setup
    setupCommonListeners();
}

function setupCommonListeners() {
    // Logout button
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Modal close buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close-modal') || 
            e.target.classList.contains('modal') && e.target.id) {
            closeModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentModal) {
            closeModal();
        }
    });
}

function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    
    // Switch between login and register forms
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function() {
            document.getElementById('loginContainer').classList.remove('active');
            document.getElementById('registerContainer').classList.add('active');
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function() {
            document.getElementById('registerContainer').classList.remove('active');
            document.getElementById('loginContainer').classList.add('active');
        });
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = await auth.login(username, password);
            
            if (result.success) {
                showToast('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showToast(result.error, 'error');
            }
        });
    }
    
    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const userData = {
                username: document.getElementById('regUsername').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value,
                confirmPassword: document.getElementById('regConfirmPassword').value,
                fullName: document.getElementById('regFullName').value,
                role: document.getElementById('regRole').value,
                group: document.getElementById('regGroup').value
            };
            
            const result = await auth.register(userData);
            
            if (result.success) {
                showToast('Registration successful! Please login.', 'success');
                document.getElementById('registerContainer').classList.remove('active');
                document.getElementById('loginContainer').classList.add('active');
                registerForm.reset();
            } else {
                showToast(result.error, 'error');
            }
        });
    }
}

function setupDashboard() {
    if (!auth.isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update dashboard data
    updateDashboardStats();
    loadUpcomingTasks();
    loadRecentActivity();
    updateProgressBar();
    
    // Update user display
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        document.getElementById('currentUser').textContent = currentUser.fullName;
    }
}

function updateDashboardStats() {
    const stats = db.getStatistics();
    
    document.getElementById('totalTasks').textContent = stats.totalTasks;
    document.getElementById('completedTasks').textContent = stats.completedTasks;
    document.getElementById('pendingTasks').textContent = stats.pendingTasks;
    document.getElementById('totalReports').textContent = stats.totalReports;
}

function loadUpcomingTasks() {
    const tasks = db.getTasks();
    const upcomingTasksContainer = document.getElementById('upcomingTasks');
    
    if (!upcomingTasksContainer) return;
    
    // Sort by due date and get upcoming tasks (next 7 days)
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingTasks = tasks
        .filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate > now && dueDate <= nextWeek;
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);
    
    if (upcomingTasks.length === 0) {
        upcomingTasksContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <p>No upcoming deadlines</p>
            </div>
        `;
        return;
    }
    
    upcomingTasksContainer.innerHTML = upcomingTasks.map(task => `
        <div class="task-item ${task.priority === 'urgent' ? 'urgent' : task.status === 'pending' ? 'pending' : ''}">
            <div class="task-header">
                <span class="task-title">${task.title}</span>
                <span class="task-date">Due: ${formatDate(task.dueDate)}</span>
            </div>
            <div class="task-progress">
                <div class="progress-bar small">
                    <div class="progress-fill" style="width: ${task.progress}%"></div>
                </div>
                <span class="progress-text">${task.progress}%</span>
                <span class="badge badge-${getPriorityClass(task.priority)}">${task.priority}</span>
            </div>
        </div>
    `).join('');
}

function loadRecentActivity() {
    const activities = db.getActivities(5);
    const activityContainer = document.getElementById('recentActivity');
    
    if (!activityContainer) return;
    
    if (activities.length === 0) {
        activityContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <p>No recent activity</p>
            </div>
        `;
        return;
    }
    
    activityContainer.innerHTML = activities.map(activity => {
        const user = db.getUser(activity.userId);
        const icon = getActivityIcon(activity.type);
        
        return `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${formatTime(activity.timestamp)} • By ${user?.fullName || 'System'}</div>
                </div>
            </div>
        `;
    }).join('');
}

function updateProgressBar() {
    const stats = db.getStatistics();
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    
    if (progressFill) {
        progressFill.style.width = `${stats.totalProgress}%`;
    }
    
    if (progressPercent) {
        progressPercent.textContent = `${stats.totalProgress}%`;
    }
}

function setupTasksPage() {
    if (!auth.isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }
    
    loadTasks();
    setupTaskListeners();
}

function loadTasks(filter = 'all') {
    const tasks = db.getTasks();
    const currentUser = auth.getCurrentUser();
    
    let filteredTasks = tasks;
    
    if (filter === 'my-tasks' && currentUser) {
        filteredTasks = tasks.filter(task => 
            task.assignedTo && task.assignedTo.includes(currentUser.id)
        );
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => task.status === 'pending');
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.status === 'completed');
    } else if (filter === 'urgent') {
        filteredTasks = tasks.filter(task => task.priority === 'urgent');
    }
    
    displayTasks(filteredTasks);
}

function displayTasks(tasks) {
    const tasksContainer = document.getElementById('tasksContainer');
    if (!tasksContainer) return;
    
    if (tasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <p>No tasks found</p>
            </div>
        `;
        return;
    }
    
    tasksContainer.innerHTML = tasks.map(task => {
        const assignedUsers = task.assignedTo?.map(id => {
            const user = db.getUser(id);
            return user?.fullName;
        }).filter(Boolean).join(', ') || 'Unassigned';
        
        return `
            <div class="task-card">
                <div class="task-card-header">
                    <h3>${task.title}</h3>
                    <div class="task-actions">
                        <button class="btn-sm btn-edit" onclick="editTask(${task.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${auth.isTeacher() ? `
                            <button class="btn-sm btn-delete" onclick="deleteTask(${task.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                <p class="task-description">${task.description}</p>
                <div class="task-details">
                    <span class="task-category">${task.category}</span>
                    <span class="task-battery">${task.batteryType || 'General'}</span>
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                    <span class="task-status ${task.status}">${task.status}</span>
                </div>
                <div class="task-footer">
                    <div class="task-assigned">
                        <i class="fas fa-user"></i>
                        ${assignedUsers}
                    </div>
                    <div class="task-due">
                        <i class="fas fa-calendar"></i>
                        Due: ${formatDate(task.dueDate)}
                    </div>
                    <div class="task-progress-display">
                        <div class="progress-bar small">
                            <div class="progress-fill" style="width: ${task.progress}%"></div>
                        </div>
                        <span>${task.progress}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setupTaskListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            loadTasks(filter);
            
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add task button
    const addTaskBtn = document.getElementById('addTaskBtn');
    if (addTaskBtn && auth.isTeacher()) {
        addTaskBtn.addEventListener('click', showAddTaskModal);
    }
}

function showAddTaskModal() {
    const modalContent = `
        <div class="modal-header">
            <h3><i class="fas fa-plus-circle"></i> Add New Task</h3>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <form id="addTaskForm">
                <div class="input-group">
                    <label>Task Title</label>
                    <input type="text" id="taskTitle" required>
                </div>
                <div class="input-group">
                    <label>Description</label>
                    <textarea id="taskDescription" rows="3" required></textarea>
                </div>
                <div class="form-row">
                    <div class="input-group">
                        <label>Category</label>
                        <select id="taskCategory" required>
                            <option value="">Select Category</option>
                            <option value="research">Research</option>
                            <option value="experiment">Experiment</option>
                            <option value="analysis">Analysis</option>
                            <option value="documentation">Documentation</option>
                            <option value="presentation">Presentation</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Battery Type</label>
                        <select id="taskBatteryType">
                            <option value="">Any</option>
                            <option value="lithium-ion">Lithium Ion</option>
                            <option value="lead-acid">Lead Acid</option>
                            <option value="nickel-cadmium">Nickel Cadmium</option>
                            <option value="alkaline">Alkaline</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="input-group">
                        <label>Priority</label>
                        <select id="taskPriority" required>
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Due Date</label>
                        <input type="date" id="taskDueDate" required>
                    </div>
                </div>
                <div class="input-group">
                    <label>Assign To</label>
                    <select id="taskAssignTo" multiple>
                        ${db.getUsers()
                            .filter(u => u.role === 'student' && u.isActive)
                            .map(u => `<option value="${u.id}">${u.fullName} (${u.group})</option>`)
                            .join('')}
                    </select>
                    <small class="helper-text">Hold Ctrl/Cmd to select multiple users</small>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="saveTask()">Save Task</button>
        </div>
    `;
    
    showModal('addTaskModal', modalContent);
    
    // Set default due date to 7 days from now
    const dueDateInput = document.getElementById('taskDueDate');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    dueDateInput.value = nextWeek.toISOString().split('T')[0];
}

function saveTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const category = document.getElementById('taskCategory').value;
    const batteryType = document.getElementById('taskBatteryType').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const assignTo = Array.from(document.getElementById('taskAssignTo').selectedOptions)
        .map(option => parseInt(option.value));
    
    const currentUser = auth.getCurrentUser();
    
    if (!currentUser) {
        showToast('You must be logged in to create tasks', 'error');
        return;
    }
    
    const taskData = {
        title,
        description,
        category,
        batteryType: batteryType || undefined,
        priority,
        dueDate,
        assignedTo: assignTo,
        createdBy: currentUser.id,
        status: 'pending',
        progress: 0
    };
    
    const newTask = db.createTask(taskData);
    
    // Add activity
    db.addActivity({
        type: 'task_created',
        title: 'New task created',
        description: `${currentUser.fullName} created task: ${title}`,
        userId: currentUser.id
    });
    
    showToast('Task created successfully!', 'success');
    closeModal();
    loadTasks();
    
    // Update dashboard if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        updateDashboardStats();
        loadUpcomingTasks();
        updateProgressBar();
    }
}

function editTask(taskId) {
    const task = db.getTask(taskId);
    if (!task) return;
    
    const modalContent = `
        <div class="modal-header">
            <h3><i class="fas fa-edit"></i> Edit Task</h3>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <form id="editTaskForm">
                <div class="input-group">
                    <label>Task Title</label>
                    <input type="text" id="editTaskTitle" value="${task.title}" required>
                </div>
                <div class="input-group">
                    <label>Description</label>
                    <textarea id="editTaskDescription" rows="3" required>${task.description}</textarea>
                </div>
                <div class="form-row">
                    <div class="input-group">
                        <label>Status</label>
                        <select id="editTaskStatus">
                            <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="review" ${task.status === 'review' ? 'selected' : ''}>Review</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Progress</label>
                        <input type="range" id="editTaskProgress" min="0" max="100" value="${task.progress}">
                        <span id="progressValue">${task.progress}%</span>
                    </div>
                </div>
                <div class="form-row">
                    <div class="input-group">
                        <label>Priority</label>
                        <select id="editTaskPriority">
                            <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                            <option value="urgent" ${task.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Due Date</label>
                        <input type="date" id="editTaskDueDate" value="${task.dueDate}">
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="updateTask(${taskId})">Update Task</button>
        </div>
    `;
    
    showModal('editTaskModal', modalContent);
    
    // Update progress value display
    const progressInput = document.getElementById('editTaskProgress');
    const progressValue = document.getElementById('progressValue');
    
    progressInput.addEventListener('input', function() {
        progressValue.textContent = `${this.value}%`;
    });
}

function updateTask(taskId) {
    const task = db.getTask(taskId);
    if (!task) return;
    
    const updates = {
        title: document.getElementById('editTaskTitle').value,
        description: document.getElementById('editTaskDescription').value,
        status: document.getElementById('editTaskStatus').value,
        progress: parseInt(document.getElementById('editTaskProgress').value),
        priority: document.getElementById('editTaskPriority').value,
        dueDate: document.getElementById('editTaskDueDate').value
    };
    
    db.updateTask(taskId, updates);
    
    // Add activity
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        db.addActivity({
            type: 'task_updated',
            title: 'Task updated',
            description: `${currentUser.fullName} updated task: ${updates.title}`,
            userId: currentUser.id
        });
    }
    
    showToast('Task updated successfully!', 'success');
    closeModal();
    loadTasks();
    
    // Update dashboard if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        updateDashboardStats();
        loadUpcomingTasks();
        updateProgressBar();
    }
}

function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    const task = db.getTask(taskId);
    if (!task) return;
    
    db.deleteTask(taskId);
    
    // Add activity
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        db.addActivity({
            type: 'task_deleted',
            title: 'Task deleted',
            description: `${currentUser.fullName} deleted task: ${task.title}`,
            userId: currentUser.id
        });
    }
    
    showToast('Task deleted successfully!', 'success');
    loadTasks();
    
    // Update dashboard if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        updateDashboardStats();
        loadUpcomingTasks();
        updateProgressBar();
    }
}

function setupReportsPage() {
    if (!auth.isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }
    
    loadReports();
    setupReportListeners();
}

function loadReports() {
    const reports = db.getReports();
    const currentUser = auth.getCurrentUser();
    
    let filteredReports = reports;
    
    // If not admin/teacher, only show own reports
    if (!auth.isTeacher()) {
        filteredReports = reports.filter(report => report.createdBy === currentUser.id);
    }
    
    displayReports(filteredReports);
}

function displayReports(reports) {
    const reportsContainer = document.getElementById('reportsContainer');
    if (!reportsContainer) return;
    
    if (reports.length === 0) {
        reportsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <p>No reports found</p>
                ${auth.isTeacher() ? `
                    <button class="btn btn-primary" onclick="showAddReportModal()">
                        <i class="fas fa-plus"></i> Create First Report
                    </button>
                ` : ''}
            </div>
        `;
        return;
    }
    
    reportsContainer.innerHTML = reports.map(report => {
        const author = db.getUser(report.createdBy);
        const reviewer = report.reviewedBy ? db.getUser(report.reviewedBy) : null;
        
        return `
            <div class="report-card">
                <div class="report-card-header">
                    <h3>${report.title}</h3>
                    <span class="report-type ${report.type}">${report.type}</span>
                </div>
                <p class="report-preview">${report.content.substring(0, 150)}...</p>
                <div class="report-details">
                    <div class="report-meta">
                        <span><i class="fas fa-user"></i> ${author?.fullName || 'Unknown'}</span>
                        <span><i class="fas fa-users"></i> ${report.group}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(report.createdAt)}</span>
                    </div>
                    <div class="report-status">
                        <span class="status-badge ${report.status}">${report.status}</span>
                        ${reviewer ? `<span><i class="fas fa-user-check"></i> ${reviewer.fullName}</span>` : ''}
                    </div>
                </div>
                <div class="report-actions">
                    <button class="btn-sm btn-info" onclick="viewReport(${report.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${(auth.isTeacher() || report.createdBy === currentUser.id) ? `
                        <button class="btn-sm btn-edit" onclick="editReport(${report.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    ` : ''}
                    ${auth.isTeacher() ? `
                        <button class="btn-sm btn-success" onclick="reviewReport(${report.id})">
                            <i class="fas fa-check"></i> Review
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function showAddReportModal() {
    const currentUser = auth.getCurrentUser();
    
    const modalContent = `
        <div class="modal-header">
            <h3><i class="fas fa-file-medical"></i> Create New Report</h3>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <form id="addReportForm">
                <div class="input-group">
                    <label>Report Title</label>
                    <input type="text" id="reportTitle" required>
                </div>
                <div class="input-group">
                    <label>Report Type</label>
                    <select id="reportType" required>
                        <option value="">Select Type</option>
                        <option value="weekly">Weekly Progress</option>
                        <option value="experiment">Experiment Report</option>
                        <option value="analysis">Data Analysis</option>
                        <option value="final">Final Report</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Content</label>
                    <textarea id="reportContent" rows="6" required placeholder="Enter your report content here..."></textarea>
                </div>
                <div class="form-row">
                    <div class="input-group">
                        <label>Group</label>
                        <input type="text" id="reportGroup" value="${currentUser?.group || ''}" required>
                    </div>
                    <div class="input-group">
                        <label>Experiment Date</label>
                        <input type="date" id="reportExperimentDate">
                    </div>
                </div>
                <div class="input-group">
                    <label>Battery Data (Optional)</label>
                    <div class="form-row">
                        <input type="number" placeholder="Voltage (V)" id="reportVoltage">
                        <input type="number" placeholder="Capacity (mAh)" id="reportCapacity">
                        <input type="number" placeholder="Temperature (°C)" id="reportTemperature">
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="saveReport()">Save Report</button>
        </div>
    `;
    
    showModal('addReportModal', modalContent);
}

function saveReport() {
    const currentUser = auth.getCurrentUser();
    
    if (!currentUser) {
        showToast('You must be logged in to create reports', 'error');
        return;
    }
    
    const reportData = {
        title: document.getElementById('reportTitle').value,
        type: document.getElementById('reportType').value,
        content: document.getElementById('reportContent').value,
        group: document.getElementById('reportGroup').value,
        experimentDate: document.getElementById('reportExperimentDate').value || undefined,
        batteryData: {
            voltage: document.getElementById('reportVoltage').value || undefined,
            capacity: document.getElementById('reportCapacity').value || undefined,
            temperature: document.getElementById('reportTemperature').value || undefined
        },
        createdBy: currentUser.id
    };
    
    const newReport = db.createReport(reportData);
    
    // Add activity
    db.addActivity({
        type: 'report_created',
        title: 'New report created',
        description: `${currentUser.fullName} created report: ${reportData.title}`,
        userId: currentUser.id
    });
    
    showToast('Report created successfully!', 'success');
    closeModal();
    loadReports();
}

function setupAdminPage() {
    if (!auth.isAdmin()) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    loadAdminData();
    setupAdminListeners();
}

function loadAdminData() {
    loadUsersTable();
    loadAdminStats();
}

function loadUsersTable() {
    const users = db.getUsers();
    const usersTable = document.getElementById('usersTable');
    
    if (!usersTable) return;
    
    usersTable.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>
                <strong>${user.fullName}</strong><br>
                <small>${user.username}</small>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="badge badge-${user.role === 'admin' ? 'danger' : user.role === 'teacher' ? 'info' : 'success'}">
                    ${user.role}
                </span>
            </td>
            <td>${user.group}</td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <span class="badge ${user.isActive ? 'badge-success' : 'badge-danger'}">
                    ${user.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <button class="btn-sm btn-edit" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-sm ${user.isActive ? 'btn-disable' : 'btn-success'}" 
                        onclick="toggleUserStatus(${user.id})">
                    <i class="fas fa-${user.isActive ? 'ban' : 'check'}"></i>
                </button>
                ${user.role !== 'admin' ? `
                    <button class="btn-sm btn-delete" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function loadAdminStats() {
    const stats = db.getStatistics();
    
    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('activeUsers').textContent = stats.activeUsers;
    document.getElementById('adminTasks').textContent = stats.totalTasks;
    document.getElementById('adminReports').textContent = stats.totalReports;
}

function toggleUserStatus(userId) {
    const user = db.getUser(userId);
    if (!user) return;
    
    const newStatus = !user.isActive;
    
    if (confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} ${user.fullName}?`)) {
        db.updateUser(userId, { isActive: newStatus });
        
        // Add activity
        const currentUser = auth.getCurrentUser();
        if (currentUser) {
            db.addActivity({
                type: 'user_status_changed',
                title: 'User status changed',
                description: `${currentUser.fullName} ${newStatus ? 'activated' : 'deactivated'} ${user.fullName}`,
                userId: currentUser.id
            });
        }
        
        showToast(`User ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'success');
        loadUsersTable();
        loadAdminStats();
    }
}

function deleteUser(userId) {
    const user = db.getUser(userId);
    if (!user) return;
    
    if (confirm(`Are you sure you want to delete ${user.fullName}? This action cannot be undone.`)) {
        db.deleteUser(userId);
        
        // Add activity
        const currentUser = auth.getCurrentUser();
        if (currentUser) {
            db.addActivity({
                type: 'user_deleted',
                title: 'User deleted',
                description: `${currentUser.fullName} deleted user: ${user.fullName}`,
                userId: currentUser.id
            });
        }
        
        showToast('User deleted successfully!', 'success');
        loadUsersTable();
        loadAdminStats();
    }
}

// Utility Functions
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        dateElement.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling?.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        if (icon) icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function formatTime(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
        return `${diffMins}m ago`;
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else if (diffDays < 7) {
        return `${diffDays}d ago`;
    } else {
        return formatDate(dateString);
    }
}

function getPriorityClass(priority) {
    switch(priority) {
        case 'low': return 'info';
        case 'medium': return 'success';
        case 'high': return 'warning';
        case 'urgent': return 'danger';
        default: return 'info';
    }
}

function getActivityIcon(type) {
    switch(type) {
        case 'user_login': return 'fas fa-sign-in-alt';
        case 'user_logout': return 'fas fa-sign-out-alt';
        case 'user_registered': return 'fas fa-user-plus';
        case 'task_created': return 'fas fa-tasks';
        case 'task_updated': return 'fas fa-edit';
        case 'task_deleted': return 'fas fa-trash';
        case 'report_created': return 'fas fa-file-alt';
        default: return 'fas fa-bell';
    }
}

function showModal(modalId, content) {
    // Remove existing modal
    const existingModal = document.getElementById('globalModal');
    if (existingModal) existingModal.remove();
    
    // Create new modal
    const modal = document.createElement('div');
    modal.id = 'globalModal';
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    currentModal = modalId;
}

function closeModal() {
    const modal = document.getElementById('globalModal');
    if (modal) {
        modal.remove();
        currentModal = null;
    }
}

function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function logout() {
    auth.logout();
}

// Global functions for HTML onclick handlers
window.togglePassword = togglePassword;
window.logout = logout;
window.showAddTaskModal = showAddTaskModal;
window.editTask = editTask;
window.deleteTask = deleteTask;
window.updateTask = updateTask;
window.showAddReportModal = showAddReportModal;
window.viewReport = viewReport;
window.editReport = editReport;
window.reviewReport = reviewReport;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
window.closeModal = closeModal;
window.saveTask = saveTask;
window.saveReport = saveReport;

// Export database and auth for debugging
window.db = db;
window.auth = auth;
