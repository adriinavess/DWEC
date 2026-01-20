const dropZone = document.getElementById('dropZone');
const previews = document.getElementById('previews');
let images = [];

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
    dropZone.addEventListener(event, e => {
        e.preventDefault();
        e.stopPropagation();
        if (event === 'dragenter' || event === 'dragover') dropZone.classList.add('dragover');
        else if (event === 'dragleave') dropZone.classList.remove('dragover');
        else if (event === 'drop') dropZone.classList.remove('dragover');
    });
});

dropZone.addEventListener('drop', e => {
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => {
            images.push({file, dataUrl: ev.target.result});
            showPreview(file, ev.target.result);
        };
        reader.readAsDataURL(file);
    });
});

function showPreview(file, dataUrl) {
    const img = document.createElement('img');
    img.src = dataUrl;
    img.className = 'preview';
    img.title = file.name;
    previews.appendChild(img);
}

function processImages() {
    const watermark = document.getElementById('watermark').value;
    const maxWidth = parseInt(document.getElementById('maxWidth').value);
    const format = document.getElementById('format').value;

    images.forEach(({file, dataUrl}, index) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let {width, height} = img;
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            if (watermark) {
                ctx.font = '40px Arial';
                ctx.fillStyle = 'rgba(255,255,255,0.7)';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.fillText(watermark, width - 20, height - 20);
            }

            const link = document.createElement('a');
            link.download = `editada-${file.name}`;
            link.href = canvas.toDataURL(format, 0.9);
            link.click();
        };
        img.src = dataUrl;
    });
}
