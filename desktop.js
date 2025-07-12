// Music Player Implementation
const musicPlayer = {
    audio: new Audio(),
    isPlaying: false,
    currentTrack: null,
    playlist: [],
    currentIndex: -1,
    
    init: function() {
        // Get player elements
        this.playBtn = document.getElementById('play-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.volumeControl = document.getElementById('volume-control');
        this.progressBar = document.getElementById('progress-bar');
        this.currentTimeDisplay = document.getElementById('current-time');
        this.durationDisplay = document.getElementById('duration');
        this.statusDisplay = document.getElementById('player-status');
        this.nowPlayingDisplay = document.getElementById('now-playing');
        this.playlistElement = document.getElementById('playlist');
        
        // Set initial volume
        this.audio.volume = this.volumeControl.value;
        
        // Event listeners
        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        this.volumeControl.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.progressBar.addEventListener('input', (e) => this.seek(e.target.value));
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.next());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        
        // Load initial playlist
        this.loadInitialPlaylist();
    },
    
    loadInitialPlaylist: function() {
        // Replace these with your actual music files in documents/music
        const initialTracks = [
            { title: 'pity party. - ISSBROKIE', path: 'documents/music/song1.mp3' },
            { title: 'PLASTIC! - ISSBROKIE', path: 'documents/music/song2.mp3' },
            { title: 'Just Leave Me Alone - strxwberrymilk', path: 'documents/music/song3.mp3' }
        ];
        
        // Clear existing playlist
        this.playlist = [];
        this.playlistElement.innerHTML = '';
        
        // Add tracks to playlist
        initialTracks.forEach((track, index) => {
            this.addToPlaylist(track.title, track.path, index);
        });
        
        // Load first track if available
        if (this.playlist.length > 0) {
            this.loadTrack(0);
        }
    },
    
    addToPlaylist: function(title, path, index) {
        const track = { title, path };
        this.playlist.push(track);
        
        // Create playlist item
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.textContent = title;
        item.dataset.index = index;
        item.addEventListener('click', () => {
            this.loadTrack(parseInt(item.dataset.index));
        });
        
        this.playlistElement.appendChild(item);
    },
    
    loadTrack: function(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        // Pause current track if playing
        if (this.isPlaying) {
            this.audio.pause();
        }
        
        // Update current track
        this.currentIndex = index;
        this.currentTrack = this.playlist[index];
        
        // Update UI
        this.nowPlayingDisplay.textContent = this.currentTrack.title;
        this.statusDisplay.textContent = 'Loading...';
        
        // Highlight active track in playlist
        const items = this.playlistElement.querySelectorAll('.playlist-item');
        items.forEach(item => item.classList.remove('active'));
        items[index].classList.add('active');
        
        // Load the audio file
        this.audio.src = this.currentTrack.path;
        this.audio.load();
        
        // Auto-play if player was playing
        if (this.isPlaying) {
            this.play();
        }
    },
    
    play: function() {
        if (!this.audio.src) {
            if (this.playlist.length > 0) {
                this.loadTrack(0);
                return;
            }
            this.statusDisplay.textContent = 'No track loaded';
            return;
        }
        
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.statusDisplay.textContent = 'Playing';
            })
            .catch(error => {
                this.statusDisplay.textContent = 'Playback error';
                console.error('Playback failed:', error);
            });
    },
    
    pause: function() {
        this.audio.pause();
        this.isPlaying = false;
        this.statusDisplay.textContent = 'Paused';
    },
    
    stop: function() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.statusDisplay.textContent = 'Stopped';
    },
    
    prev: function() {
        if (this.playlist.length === 0) return;
        const newIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(newIndex);
        if (this.isPlaying) this.play();
    },
    
    next: function() {
        if (this.playlist.length === 0) return;
        const newIndex = (this.currentIndex + 1) % this.playlist.length;
        this.loadTrack(newIndex);
        if (this.isPlaying) this.play();
    },
    
    setVolume: function(volume) {
        this.audio.volume = volume;
    },
    
    seek: function(position) {
        if (!isNaN(this.audio.duration)) {
            this.audio.currentTime = (position / 100) * this.audio.duration;
        }
    },
    
    updateProgress: function() {
        if (!isNaN(this.audio.duration)) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressBar.value = progress;
            this.currentTimeDisplay.textContent = this.formatTime(this.audio.currentTime);
        }
    },
    
    updateDuration: function() {
        if (!isNaN(this.audio.duration)) {
            this.durationDisplay.textContent = this.formatTime(this.audio.duration);
            this.statusDisplay.textContent = 'Ready';
        }
    },
    
    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize music player
    musicPlayer.init();
    
    // Make music player window draggable
    const musicPlayerWindow = document.getElementById('music-player-window');
    if (musicPlayerWindow) {
        makeDraggable(musicPlayerWindow);
    }
    
    // Close button functionality
    const closeBtn = musicPlayerWindow.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            musicPlayerWindow.style.display = 'none';
            const taskbarItem = document.getElementById('music-player-taskbar-item');
            if (taskbarItem) taskbarItem.classList.remove('active');
        });
    }

    // Get all DOM elements
    const explorerWindow = document.getElementById('explorer-window');
    if (!explorerWindow) {
        console.error('Explorer window element not found');
        return;
    }

    const folderView = explorerWindow.querySelector('.folder-view');
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const startExplorer = document.getElementById('start-explorer');
    const startMusicPlayerItem = document.getElementById('start-music-player');
    const startRestart = document.getElementById('start-restart');
    const startShutdown = document.getElementById('start-shutdown');
    const explorerTaskbarItem = document.getElementById('explorer-taskbar-item');
    const fileExplorerIcon = document.getElementById('file-explorer-icon');
    const musicPlayerIcon = document.getElementById('music-player-icon');
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

    // Music Player Start Menu item
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
    img.style.width = '64px';
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
    contentDiv.style.overflow = 'auto';
    
    if (isImage) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';
        imgContainer.style.display = 'flex';
        imgContainer.style.justifyContent = 'center';
        imgContainer.style.alignItems = 'center';
        imgContainer.style.height = '100%';
        imgContainer.style.padding = '20px';
        
        const img = document.createElement('img');
        img.src = content;
        img.alt = title;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.objectFit = 'contain';
        
        img.onload = function() {
            const maxWidth = window.innerWidth * 0.8;
            const maxHeight = window.innerHeight * 0.8;
            
            let imgWidth = img.naturalWidth;
            let imgHeight = img.naturalHeight;
            
            if (imgWidth > maxWidth || imgHeight > maxHeight) {
                const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
                imgWidth *= ratio;
                imgHeight *= ratio;
            }
            
            windowDiv.style.width = `${Math.min(imgWidth + 40, maxWidth)}px`;
            windowDiv.style.height = `${Math.min(imgHeight + 60, maxHeight)}px`;
        };
        
        imgContainer.appendChild(img);
        contentDiv.appendChild(imgContainer);
        
        windowDiv.style.width = '500px';
        windowDiv.style.height = '500px';
    } else {
        const textContainer = document.createElement('div');
        textContainer.className = 'text-container';
        textContainer.style.whiteSpace = 'pre-wrap';
        textContainer.style.fontFamily = 'Courier New, monospace';
        textContainer.style.padding = '15px';
        textContainer.style.overflow = 'auto';
        textContainer.style.backgroundColor = 'white';
        textContainer.style.height = '100%';
        textContainer.textContent = content;
        
        contentDiv.appendChild(textContainer);
        
        windowDiv.style.width = '500px';
        windowDiv.style.height = '400px';
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

    let content = '';
    let isImage = type === 'image';

    try {
        if (isImage) {
            content = path;
        } else {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error('File not found');
            }
            content = await response.text();
        }
    } catch (e) {
        content = `Error loading ${title}:\n${e.message}`;
        isImage = false;
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