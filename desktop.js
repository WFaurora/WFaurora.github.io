document.addEventListener('DOMContentLoaded', function() {
    // Get all DOM elements
    const explorerWindow = document.getElementById('explorer-window');
    const folderView = explorerWindow.querySelector('.folder-view');
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const startExplorer = document.getElementById('start-explorer');
    const startRestart = document.getElementById('start-restart');
    const startShutdown = document.getElementById('start-shutdown');
    const explorerTaskbarItem = document.getElementById('explorer-taskbar-item');

    // File Explorer icon click
    document.getElementById('file-explorer').addEventListener('click', function() {
        explorerWindow.style.display = 'flex';
        makeDraggable(explorerWindow);
        showFolderContents('root');
        explorerTaskbarItem.classList.add('active');
    });

    // Handle folder/file clicks
    folderView.addEventListener('click', function(e) {
        const fileElement = e.target.closest('.file');
        if (!fileElement) return;
        
        const fileId = fileElement.getAttribute('data-file');
        if (fileId.startsWith('folder')) {
            showFolderContents(fileId);
        } else if (fileId === 'back') {
            showFolderContents('root');
        } else {
            openFileWindow(fileId);
        }
    });

    // Start menu functionality
    startButton.addEventListener('click', function(e) {
        e.stopPropagation();
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
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
    startExplorer.addEventListener('click', function() {
        explorerWindow.style.display = 'flex';
        makeDraggable(explorerWindow);
        showFolderContents('root');
        explorerTaskbarItem.classList.add('active');
        startMenu.style.display = 'none';
    });

    startRestart.addEventListener('click', function() {
        if (confirm('Are you sure you want to restart?')) {
            location.reload();
        }
    });

    startShutdown.addEventListener('click', function() {
        if (confirm('Are you sure you want to shutdown?')) {
            document.body.innerHTML = '<div style="background:black;color:white;height:100vh;display:flex;justify-content:center;align-items:center;">It is now safe to turn off your computer.</div>';
        }
    });

    // Taskbar item click
    explorerTaskbarItem.addEventListener('click', function() {
        if (explorerWindow.style.display === 'flex') {
            explorerWindow.style.display = 'none';
            this.classList.remove('active');
        } else {
            explorerWindow.style.display = 'flex';
            makeDraggable(explorerWindow);
            this.classList.add('active');
        }
    });

    // Window controls for explorer
    explorerWindow.querySelector('.close').addEventListener('click', function() {
        explorerWindow.style.display = 'none';
        explorerTaskbarItem.classList.remove('active');
    });
});

function createFileElement(fileId, imgSrc, name) {
    const div = document.createElement('div');
    div.className = 'file';
    div.setAttribute('data-file', fileId);
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = name + ' icon';
    
    const span = document.createElement('span');
    span.textContent = name;
    
    div.appendChild(img);
    div.appendChild(span);
    
    return div;
}

function showFolderContents(folderId) {
    const folderView = document.querySelector('.folder-view');
    const windowTitle = document.querySelector('.window-title');
    
    // Clear current view
    while (folderView.firstChild) {
        folderView.removeChild(folderView.firstChild);
    }
    
    // Update window title
    windowTitle.textContent = folderId === 'root' ? 'File Explorer' : 
                            folderId === 'folder1' ? 'Mira' : 'Emily';
    
    if (folderId === 'root') {
        // Root folder contents
        folderView.appendChild(createFileElement('folder1', 'Folder_Opened.png', 'Mira'));
        folderView.appendChild(createFileElement('folder2', 'Folder_Opened.png', 'Emily'));
        folderView.appendChild(createFileElement('file1', 'TXT.png', 'credits.txt'));
    } else if (folderId === 'folder1') {
        // Mira's folder contents
        folderView.appendChild(createFileElement('mira1', 'TXT.png', 'notes.txt'));
        folderView.appendChild(createFileElement('mira2', 'IMG.png', 'meow.jpg'));
        folderView.appendChild(createFileElement('mira3', 'IMG.png', 'purr.jpg'));
        folderView.appendChild(createFileElement('back', 'Folder_Opened.png', '.. (Up)'));
    } else if (folderId === 'folder2') {
        // Emily's folder contents
        folderView.appendChild(createFileElement('emily1', 'TXT.png', 'notes.txt'));
        folderView.appendChild(createFileElement('emily2', 'IMG.png', 'IN.file'));
        folderView.appendChild(createFileElement('emily3', 'IMG.png', 'LZZ.cutie'));
        folderView.appendChild(createFileElement('back', 'Folder_Opened.png', '.. (Up)'));
    }
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
    
    const maximizeBtn = document.createElement('button');
    maximizeBtn.className = 'maximize';
    maximizeBtn.textContent = '□';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close';
    closeBtn.textContent = 'X';
    
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
        imgContainer.style.display = 'flex';
        imgContainer.style.justifyContent = 'center';
        imgContainer.style.alignItems = 'center';
        imgContainer.style.padding = '20px';
        
        const img = document.createElement('img');
        img.src = `images/${title}`;
        img.alt = title;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.objectFit = 'contain';
        
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
        textContainer.style.whiteSpace = 'pre-wrap';
        textContainer.style.padding = '15px';
        textContainer.style.overflow = 'auto';
        textContainer.textContent = content;
        
        contentDiv.appendChild(textContainer);
        
        // Create temporary element for measurement
        const measure = document.createElement('div');
        measure.style.position = 'absolute';
        measure.style.visibility = 'hidden';
        measure.style.whiteSpace = 'pre-wrap';
        measure.style.fontFamily = 'monospace';
        measure.style.padding = '15px';
        measure.textContent = content;
        document.body.appendChild(measure);
        
        const contentWidth = measure.scrollWidth + 40;
        const contentHeight = measure.scrollHeight + 60;
        document.body.removeChild(measure);
        
        windowDiv.style.width = `${Math.min(
            Math.max(contentWidth, 300),
            window.innerWidth * 0.8
        )}px`;
        
        windowDiv.style.height = `${Math.min(
            Math.max(contentHeight, 200),
            window.innerHeight * 0.7
        )}px`;
    }
    
    windowDiv.appendChild(header);
    windowDiv.appendChild(contentDiv);
    
    return windowDiv;
}

async function openFileWindow(fileId) {
    let content = '';
    let title = '';
    let filePath = '';
    let isImage = false;
    let isHexFile = false;

    switch(fileId) {
        case 'mira1':
            title = "notes.txt";
            filePath = "documents/mira/notes.txt";
            break;
        case 'mira2':
            title = "meow.jpg";
            filePath = "images/collage1.jpg";
            isImage = true;
            break;
        case 'mira3':
            title = "purr.jpg";
            filePath = "images/collage2.jpg";
            isImage = true;
            break;
        case 'emily1':
            title = "notes.txt";
            filePath = "documents/emily/notes.txt";
            break;
        case 'emily2':
            title = "meow.png";
            filePath = "images/image copy.png";
            isImage = true;
            break;
        case 'emily3':
            title = "purr.png";
            filePath = "images/image.png";
            isImage = true;
            break;
        case 'file1':
            title = "credits.txt";
            filePath = "documents/credits.txt";
            break;
    }

    if (!isImage) {
        try {
            const response = await fetch(filePath);
            if (response.ok) {
                content = await response.text();
                if (isHexFile) {
                    content = decodeHexContent(content);
                }
            } else {
                content = `File not found: ${title}`;
            }
        } catch (e) {
            content = `Error loading ${title}:\n${e.message}`;
        }
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

function decodeHexContent(hexContent) {
    return hexContent.split('\n')
        .map(line => {
            const hexValues = line.match(/0x[0-9A-Fa-f]{2}/g) || [];
            return hexValues.map(hex => {
                try {
                    return String.fromCharCode(parseInt(hex, 16));
                } catch {
                    return '';
                }
            }).join('');
        })
        .join('\n');
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = element.querySelector('.window-header');
    
    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}