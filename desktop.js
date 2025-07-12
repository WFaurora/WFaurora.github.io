document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements with null checks
    const explorerWindow = document.getElementById('explorer-window');
    if (!explorerWindow) {
        console.error('Explorer window element not found');
        return;
    }

    const folderView = explorerWindow.querySelector('.folder-view');
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const startExplorer = document.getElementById('start-explorer');
    const startMusicPlayerItem = document.getElementById('start-music-player'); // Added this line
    const startRestart = document.getElementById('start-restart');
    const startShutdown = document.getElementById('start-shutdown');
    const explorerTaskbarItem = document.getElementById('explorer-taskbar-item');
    const fileExplorerIcon = document.getElementById('file-explorer-icon');
    const musicPlayerIcon = document.getElementById('music-player-icon');
    const musicPlayerWindow = document.getElementById('music-player-window');
    const musicPlayerTaskbarItem = document.getElementById('music-player-taskbar-item');
    const clockElement = document.getElementById('clock');

    // Check if required elements exist before proceeding
    if (!folderView || !startButton || !startMenu || !fileExplorerIcon || !clockElement) {
        console.error('One or more essential elements not found');
        return;
    }

    // Initialize windows as hidden
    explorerWindow.style.display = 'none';
    if (musicPlayerWindow) musicPlayerWindow.style.display = 'none';
    startMenu.style.display = 'none';

    // File Explorer icon click
    fileExplorerIcon.addEventListener('click', function() {
        toggleWindow(explorerWindow, true);
        showFolderContents('root');
        explorerTaskbarItem.classList.add('active');
    });

    // Music Player icon click
    if (musicPlayerIcon && musicPlayerWindow && musicPlayerTaskbarItem) {
        musicPlayerIcon.addEventListener('click', function() {
            toggleWindow(musicPlayerWindow, true);
            musicPlayerTaskbarItem.classList.add('active');
        });
    }

    // Handle folder/file clicks
    folderView.addEventListener('click', function(e) {
        const fileElement = e.target.closest('.file');
        if (!fileElement) return;
        
        const fileId = fileElement.getAttribute('data-file');
        if (fileId.startsWith('folder')) {
            showFolderContents(fileId);
        } else if (fileId === 'back') {
            navigateUp();
        } else {
            openFileWindow(fileId);
        }
    });

    // Start menu functionality
    startButton.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleStartMenu();
    });

    // Close Start menu when clicking elsewhere
    document.addEventListener('click', function() {
        startMenu.style.display = 'none';
    });

    // Prevent Start menu from closing when clicking inside it
    startMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Start menu items functionality
    if (startExplorer) {
        startExplorer.addEventListener('click', function() {
            toggleWindow(explorerWindow, true);
            showFolderContents('root');
            explorerTaskbarItem.classList.add('active');
            startMenu.style.display = 'none';
        });
    }

    // Add this block for Music Player Start Menu item
    if (startMusicPlayerItem && musicPlayerWindow && musicPlayerTaskbarItem) {
        startMusicPlayerItem.addEventListener('click', function() {
            toggleWindow(musicPlayerWindow, true);
            musicPlayerTaskbarItem.classList.add('active');
            startMenu.style.display = 'none';
        });
        
        // Add hover effect
        startMusicPlayerItem.style.cursor = 'pointer';
        startMusicPlayerItem.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#316AC5';
            this.style.color = 'white';
        });
        startMusicPlayerItem.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.color = '';
        });
    }

    if (startRestart) {
        startRestart.addEventListener('click', function() {
            if (confirm('Are you sure you want to restart?')) {
                location.reload();
            }
        });
    }

    if (startShutdown) {
        startShutdown.addEventListener('click', function() {
            if (confirm('Are you sure you want to shutdown?')) {
                document.body.innerHTML = '<div class="shutdown-screen">It is now safe to turn off your computer.</div>';
            }
        });
    }

    // Taskbar item clicks
    explorerTaskbarItem.addEventListener('click', function() {
        toggleWindow(explorerWindow);
    });

    if (musicPlayerTaskbarItem && musicPlayerWindow) {
        musicPlayerTaskbarItem.addEventListener('click', function() {
            toggleWindow(musicPlayerWindow);
        });
    }

    // Window controls for explorer
    explorerWindow.querySelector('.close').addEventListener('click', function() {
        toggleWindow(explorerWindow, false);
        explorerTaskbarItem.classList.remove('active');
    });

    // Window controls for music player
    if (musicPlayerWindow) {
        musicPlayerWindow.querySelector('.close').addEventListener('click', function() {
            toggleWindow(musicPlayerWindow, false);
            if (musicPlayerTaskbarItem) {
                musicPlayerTaskbarItem.classList.remove('active');
            }
        });
    }

    // Clock functionality - updates every second
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        
        clockElement.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
    }

    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);

    // Helper functions
    function toggleWindow(windowElement, show = null) {
        if (!windowElement) return;
        
        const shouldShow = show !== null ? show : windowElement.style.display !== 'flex';
        windowElement.style.display = shouldShow ? 'flex' : 'none';
        
        if (shouldShow) {
            // Bring window to front
            document.querySelectorAll('.popup-window').forEach(w => {
                w.style.zIndex = 1;
            });
            windowElement.style.zIndex = 10;
            
            // Make draggable when shown
            if (windowElement === explorerWindow || windowElement === musicPlayerWindow) {
                makeDraggable(windowElement);
            }
        }
        
        // Update taskbar item state
        if (windowElement === explorerWindow) {
            explorerTaskbarItem.classList.toggle('active', shouldShow);
        } else if (windowElement === musicPlayerWindow && musicPlayerTaskbarItem) {
            musicPlayerTaskbarItem.classList.toggle('active', shouldShow);
        }
    }

    function toggleStartMenu() {
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    }

    function navigateUp() {
        const currentTitle = document.querySelector('.window-title').textContent;
        if (currentTitle === 'Mira' || currentTitle === 'Emily') {
            showFolderContents('root');
        }
    }
});



function createFileElement(fileId, imgSrc, name) {
    const div = document.createElement('div');
    div.className = 'file';
    div.setAttribute('data-file', fileId);
    div.setAttribute('title', name);
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = name;
    img.loading = 'lazy';
    img.style.width = '64px';  // Ensure consistent size
    img.style.height = '64px';
    img.style.objectFit = 'contain';
    
    const span = document.createElement('span');
    span.textContent = name;
    span.style.fontSize = '12px';
    span.style.wordBreak = 'break-word';
    span.style.maxWidth = '80px';
    
    div.appendChild(img);
    div.appendChild(span);
    
    return div;
}

function showFolderContents(folderId) {
    const folderView = document.querySelector('.folder-view');
    const windowTitle = document.querySelector('.window-title');
    
    // Clear current view
    folderView.innerHTML = '';
    
    // Update window title
    windowTitle.textContent = folderId === 'root' ? 'File Explorer' : 
                            folderId === 'folder1' ? 'Mira' : 'Emily';
    
    // Create folder contents
    const contents = {
        root: [
            { id: 'folder1', icon: 'Folder_Opened.png', name: 'Mira' },
            { id: 'folder2', icon: 'Folder_Opened.png', name: 'Emily' },
            { id: 'file1', icon: 'TXT.png', name: 'credits.txt' }
        ],
        folder1: [
            { id: 'mira1', icon: 'TXT.png', name: 'notes.txt' },
            { id: 'mira2', icon: 'IMG.png', name: 'meow.jpg' },
            { id: 'mira3', icon: 'IMG.png', name: 'purr.jpg' },
            { id: 'back', icon: 'Folder_Opened.png', name: '.. (Up)' }
        ],
        folder2: [
            { id: 'emily1', icon: 'TXT.png', name: 'notes.txt' },
            { id: 'emily2', icon: 'IMG.png', name: 'meow.png' },
            { id: 'emily3', icon: 'IMG.png', name: 'purr.png' },
            { id: 'back', icon: 'Folder_Opened.png', name: '.. (Up)' }
        ]
    };
    
    contents[folderId].forEach(item => {
        folderView.appendChild(createFileElement(item.id, item.icon, item.name));
    });
}

function createWindowElement(title, content, isImage = false) {
    const windowDiv = document.createElement('div');
    windowDiv.className = 'popup-window';
    
    const header = document.createElement('div');
    header.className = 'window-header';
    
    const titleSpan = document.createElement('span');
    titleSpan.className = 'window-title';
    titleSpan.textContent = title;
    
    const controls = document.createElement('div');
    controls.className = 'window-controls';
    
    const minimizeBtn = document.createElement('button');
    minimizeBtn.className = 'minimize';
    minimizeBtn.textContent = '-';
    minimizeBtn.setAttribute('aria-label', 'Minimize window');
    
    const maximizeBtn = document.createElement('button');
    maximizeBtn.className = 'maximize';
    maximizeBtn.textContent = '□';
    maximizeBtn.setAttribute('aria-label', 'Maximize window');
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close';
    closeBtn.textContent = 'X';
    closeBtn.setAttribute('aria-label', 'Close window');
    
    controls.appendChild(minimizeBtn);
    controls.appendChild(maximizeBtn);
    controls.appendChild(closeBtn);
    
    header.appendChild(titleSpan);
    header.appendChild(controls);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'popup-content';
    
    if (isImage) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';
        
        const img = document.createElement('img');
        img.src = content;
        img.alt = title;
        img.loading = 'eager';
        
        img.onload = function() {
            const padding = 40;
            const maxWidth = window.innerWidth * 0.8;
            const maxHeight = window.innerHeight * 0.8;
            
            let imgWidth = img.naturalWidth;
            let imgHeight = img.naturalHeight;
            
            if (imgWidth > maxWidth || imgHeight > maxHeight) {
                const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
                imgWidth *= ratio;
                imgHeight *= ratio;
            }
            
            windowDiv.style.width = `${imgWidth + padding}px`;
            windowDiv.style.height = `${imgHeight + padding}px`;
        };
        
        imgContainer.appendChild(img);
        contentDiv.appendChild(imgContainer);
    } else {
        const textContainer = document.createElement('div');
        textContainer.className = 'text-container';
        textContainer.textContent = content;
        
        // Measure text content for sizing
        const measure = document.createElement('div');
        measure.style.position = 'absolute';
        measure.style.visibility = 'hidden';
        measure.style.whiteSpace = 'pre-wrap';
        measure.style.fontFamily = 'monospace';
        measure.style.padding = '15px';
        measure.textContent = content;
        document.body.appendChild(measure);
        
        const contentWidth = Math.min(
            Math.max(measure.scrollWidth + 40, 300),
            window.innerWidth * 0.8
        );
        const contentHeight = Math.min(
            Math.max(measure.scrollHeight + 60, 200),
            window.innerHeight * 0.7
        );
        document.body.removeChild(measure);
        
        windowDiv.style.width = `${contentWidth}px`;
        windowDiv.style.height = `${contentHeight}px`;
        
        contentDiv.appendChild(textContainer);
    }
    
    windowDiv.appendChild(header);
    windowDiv.appendChild(contentDiv);
    
    return windowDiv;
}

async function openFileWindow(fileId) {
    const fileData = {
        mira1: { title: "notes.txt", path: "documents/mira/notes.txt", type: "text" },
        mira2: { title: "meow.jpg", path: "images/meow.jpg", type: "image" },
        mira3: { title: "purr.jpg", path: "images/purr.jpg", type: "image" },
        emily1: { title: "notes.txt", path: "documents/emily/notes.txt", type: "text" },
        emily2: { title: "meow.png", path: "images/meow.png", type: "image" },
        emily3: { title: "purr.png", path: "images/purr.png", type: "image" },
        file1: { title: "credits.txt", path: "documents/credits.txt", type: "text" }
    };

    const { title, path, type } = fileData[fileId] || {};
    if (!title) return;

    let content = path;
    let isImage = type === 'image';

    if (!isImage) {
        try {
            const response = await fetch(path);
            content = response.ok ? await response.text() : `File not found: ${title}`;
        } catch (e) {
            content = `Error loading ${title}:\n${e.message}`;
        }
    }

    const existingWindow = document.getElementById(`${fileId}-window`);
    if (existingWindow) {
        existingWindow.remove();
    }

    const popup = createWindowElement(title, content, isImage);
    popup.id = `${fileId}-window`;
    popup.style.display = 'flex';
    popup.style.top = `${Math.random() * 200 + 100}px`;
    popup.style.left = `${Math.random() * 200 + 100}px`;
    
    document.body.appendChild(popup);
    makeDraggable(popup);
    
    popup.querySelector('.close').addEventListener('click', function() {
        popup.remove();
    });
}

function makeDraggable(element) {
    const header = element.querySelector('.window-header');
    if (!header) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', startDrag);

    function startDrag(e) {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        
        element.style.cursor = 'grabbing';
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;
        
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        
        element.style.left = `${Math.max(0, Math.min(x, window.innerWidth - element.offsetWidth))}px`;
        element.style.top = `${Math.max(0, Math.min(y, window.innerHeight - element.offsetHeight))}px`;
    }

    function stopDrag() {
        isDragging = false;
        element.style.cursor = '';
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }
}