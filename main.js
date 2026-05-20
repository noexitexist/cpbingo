const gongGrid = document.getElementById('gong-grid');
const suGrid = document.getElementById('su-grid');
const downloadBtn = document.getElementById('download-btn');
const canvas = document.getElementById('merge-canvas');
const ctx = canvas.getContext('2d');

const gongImages = Array(12).fill(null);
const suImages = Array(12).fill(null);

// 1. 그리드 생성 및 터치 시 즉시 앨범 열기
function createGrid(gridElement, imageArray) {
    for (let i = 0; i < 12; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;

        cell.addEventListener('click', () => {
            // 💡 사파리 보안 우회용 즉시 인풋 생성 및 실행
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            
            fileInput.onchange = (e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        // 배열에 이미지 저장 및 화면 노출
                        imageArray[i] = img;
                        cell.style.backgroundImage = `url(${event.target.result})`;
                        cell.classList.add('has-img');
                    };
                };
                reader.readAsDataURL(file);
            };
            
            // 다른 비동기 코드 없이 터치 즉시 실행하여 앨범 호출
            fileInput.click();
        });
        gridElement.appendChild(cell);
    }
}

createGrid(gongGrid, gongImages);
createGrid(suGrid, suImages);

// 2. 이미지 합성 및 다운로드 (1020x850 해상도 정밀 매핑)
downloadBtn.addEventListener('click', () => {
    const templateImg = new Image();
    templateImg.src = 'template.png'; 

    templateImg.onload = () => {
        canvas.width = 1020;
        canvas.height = 850;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(templateImg, 0, 0, 1020, 850);

        // 🎯 1020x850 해상도 실측 흰색 칸 좌표 세팅
        const cellWidth = 139;   
        const cellHeight = 139;  
        const gapX = 7;          
        const gapY = 7;          

        const gongStartX = 39;   
        const suStartX = 546;    
        const gridY = 135;       

        drawCells(gongImages, gongStartX, gridY, cellWidth, cellHeight, gapX, gapY);
        drawCells(suImages, suStartX, gridY, cellWidth, cellHeight, gapX, gapY);

        const link = document.createElement('a');
        link.download = 'gong_su_analysis.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
});

function drawCells(images, startX, startY, w, h, gapX, gapY) {
    for (let i = 0; i < 12; i++) {
        if (images[i]) {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = startX + col * (w + gapX);
            const y = startY + row * (h + gapY);
            ctx.drawImage(images[i], x, y, w, h);
        }
    }
}
