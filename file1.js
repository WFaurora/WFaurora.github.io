document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('file1-window');
    
    // Window controls
    popup.querySelector('.close').addEventListener('click', function() {
        window.close();
    });

    popup.querySelector('.minimize').addEventListener('click', function() {
        // Minimize functionality would go here
    });

    popup.querySelector('.maximize').addEventListener('click', function() {
        // Maximize functionality would go here
    });

    // Make draggable
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = popup.querySelector('.window-header');
    
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
        popup.style.top = (popup.offsetTop - pos2) + "px";
        popup.style.left = (popup.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
});