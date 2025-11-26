const extensionName = "CTE_Map";
const extensionPath = `scripts/extensions/third-party/${extensionName}`;

let stContext = null;

// 定义全局命名空间
window.CTEMap = {
    currentDestination: '',
    roomDetails: {
        '前院与玄关': '设有小型日式枯山水庭院与智能安防通道，风格低调奢华。',
        '客厅/公共休息区': '挑高设计，拥有整面墙的落地窗，配有超大尺寸的模块化沙发、顶级家庭影院系统和复古黑胶唱片机，是成员们放松、看电影或聊天的地方。',
        '开放式厨房与餐厅': '拥有设备齐全的专业级中西厨，长条形的大理石餐桌足够所有人一起用餐。鹿言经常在这里为成员们准备餐点。',
        '储藏室与洗衣房': '分门别类地存放着各种生活用品和演出服装。',
        '后院与露天泳池': '拥有精心打理的草坪、烧烤区和一个恒温露天泳池，是举办小型派对或夏日放松的好去处。耶耶（萨摩耶）最喜欢在草坪上打滚。',
        '周锦宁个人工作室': '为对创作有需求的成员配备的独立空间，内部有顶级的音乐制作设备和隔音设计。',
        '孟明赫个人工作室': '为对创作有需求的成员配备的独立空间，内部有顶级的音乐制作设备和隔音设计。',
        '乐器练习室': '存放着钢琴、吉他、架子鼓等多种乐器，供成员练习或寻找灵感。',
        '游戏娱乐室': '配备了最新款的游戏主机、电竞椅和高清曲面屏，是司洛、亓谢等人主要的娱乐场所。',
        '私人会客厅': '用于接待少数的亲密朋友或家人，风格更为温馨私密。',
        '收藏室': '专门用来存放粉丝赠送的珍贵礼物和成员们获得的奖杯、奖牌。',
        '主舞蹈室': '面积巨大，三面环绕着顶天立地的镜墙，配备了专业的音响和灯光系统，是CTE日常排练和练习舞蹈的核心场所。',
        '声乐录音棚': '拥有录音室和控制室，设备达到行业顶尖标准，供鹿言、谌绪等人录制歌曲demo或练习发声。',
        '造型与衣帽间': '一个巨大的衣帽间，整齐地挂满了成员们的私服、演出服以及各大品牌的赞助衣物。旁边连接着一个配有专业化妆镜和灯光的造型室。',
        '成员休息室': '紧邻练习区，放着舒适的懒人沙发和零食饮料，供成员在练习间隙短暂休息。',
        '会议室': '配备投影仪、大会议桌等设施的专业会议室。',
        '健身房': '空间宽敞，器材种类齐全，从有氧到力量器械应有尽有，是秦述、桑洛凡等人保持身材的必备场所。',
        '瑜伽与冥想室': '环境安静，铺着柔软的地板，适合进行拉伸、瑜伽或冥想，帮助成员缓解压力。',
        '水疗与按摩室': '设有大型按摩浴缸和专业的理疗床，可供成员在结束一天高强度工作后进行身体放松与恢复。',
        '健康管理室': '配备了基础医疗用品和专业的身体数据监测设备，定期会有营养师和队医上门服务。',
        '秦述': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '司洛': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '鹿言': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '魏星泽': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '周锦宁': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '谌绪': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '孟明赫': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '亓谢': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '魏月华': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '桑洛凡': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '你': '每个成员都拥有独立的卧室套间，风格根据个人喜好进行装修，均配备了独立的豪华卫浴和步入式衣帽间，保证了绝对的私密性。',
        '公共书房/阅览区': '位于楼层中间，有一个巨大的书架，藏书丰富，供成员阅读或安静地处理个人事务。'
    }
};

const initInterval = setInterval(() => {
    if (window.SillyTavern && window.SillyTavern.getContext && window.jQuery) {
        clearInterval(initInterval);
        stContext = window.SillyTavern.getContext();
        initializeExtension();
    }
}, 500);

async function initializeExtension() {
    console.log("[CTE Map] Initializing...");

    $('#cte-map-panel').remove();
    $('#cte-toggle-btn').remove();
    $('link[href*="CTE_Map/style.css"]').remove();

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${extensionPath}/style.css`;
    document.head.appendChild(link);

    const panelHTML = `
        <div id="cte-toggle-btn" title="打开 CTE 地图" 
             style="position:fixed; top:130px; left:10px; z-index:9000; width:40px; height:40px; background:#b38b59; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.3); color:#fff; font-size:20px;">
            🗺️
        </div>
        <div id="cte-map-panel">
            <div id="cte-drag-handle">
                <span>CTE 档案地图</span>
            </div>
            <div id="cte-content-area">Loading Map...</div>
        </div>
    `;
    $('body').append(panelHTML);

    try {
        const response = await fetch(`${extensionPath}/map.html`);
        if (!response.ok) throw new Error("Map file not found");
        const htmlContent = await response.text();
        $('#cte-content-area').html(htmlContent);
        
        bindMapEvents();
        loadSavedPositions();
        loadSavedBg();

    } catch (e) {
        console.error("[CTE Map] Error:", e);
        $('#cte-content-area').html(`<p style="padding:20px; color:white;">无法加载地图文件 (map.html)。<br>请检查控制台获取详细错误。</p>`);
    }

    $('#cte-toggle-btn').on('click', () => $('#cte-map-panel').fadeToggle());
}

function bindMapEvents() {
    const mapContainer = document.getElementById('cte-map-container');
    if (!mapContainer) return;
    
    const locations = mapContainer.querySelectorAll('.location');
    
    locations.forEach(elm => {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        let hasMoved = false;

        const startDrag = (e) => {
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            if (e.type === 'touchstart') {
                // 不阻止默认可能导致拖拽时整个页面滚动
            } else {
                e.preventDefault();
                e.stopPropagation();
            }

            isDragging = true;
            hasMoved = false;
            elm.classList.add('dragging');
            
            startX = clientX;
            startY = clientY;
            initialLeft = elm.offsetLeft;
            initialTop = elm.offsetTop;
        };

        const doDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault(); // 阻止屏幕滚动

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            const dx = clientX - startX;
            const dy = clientY - startY;
            
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved = true;

            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;
            
            newLeft = Math.max(0, Math.min(newLeft, mapContainer.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, mapContainer.offsetHeight));

            elm.style.left = newLeft + 'px';
            elm.style.top = newTop + 'px';
        };

        const stopDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            elm.classList.remove('dragging');

            if (!hasMoved) {
                const popupId = elm.getAttribute('data-popup');
                if (popupId) window.CTEMap.showPopup(popupId);
            } else {
                savePosition(elm.id, elm.style.left, elm.style.top);
            }
        };

        elm.addEventListener('mousedown', (e) => {
            startDrag(e);
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', () => {
                stopDrag();
                document.removeEventListener('mousemove', doDrag);
            }, { once: true });
        });

        elm.addEventListener('touchstart', (e) => {
            startDrag(e);
            const touchMoveHandler = (ev) => doDrag(ev);
            const touchEndHandler = () => {
                stopDrag();
                document.removeEventListener('touchmove', touchMoveHandler);
                document.removeEventListener('touchend', touchEndHandler);
            };
            
            document.addEventListener('touchmove', touchMoveHandler, { passive: false });
            document.addEventListener('touchend', touchEndHandler);
        }, { passive: false });
    });
}

function savePosition(id, left, top) {
    let data = localStorage.getItem('cte_map_positions');
    data = data ? JSON.parse(data) : {};
    data[id] = { left, top };
    localStorage.setItem('cte_map_positions', JSON.stringify(data));
}

function loadSavedPositions() {
    const data = JSON.parse(localStorage.getItem('cte_map_positions'));
    if (!data) return;
    for (const [id, pos] of Object.entries(data)) {
        const el = document.getElementById(id);
        if (el) {
            el.style.left = pos.left;
            el.style.top = pos.top;
        }
    }
}

function loadSavedBg() {
    const bg = localStorage.getItem('cte_map_bg');
    if (bg) {
        document.getElementById('cte-map-container').style.backgroundImage = `url(${bg})`;
    }
}

window.CTEMap.changeBackground = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('cte-map-container').style.backgroundImage = `url(${e.target.result})`;
            localStorage.setItem('cte_map_bg', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
};

window.CTEMap.showPopup = function(id) {
    if (id === 'dorm-detail-popup') window.CTEMap.closeAllPopups();
    
    const popup = document.querySelector(`#cte-map-panel #${id}`);
    const overlay = document.querySelector(`#cte-map-panel #cte-overlay`);
    
    if (popup) {
        if (overlay) overlay.style.display = 'block';
        popup.style.display = 'block';
        popup.scrollTop = 0;
    }
};

window.CTEMap.closeAllPopups = function() {
    $('#cte-map-panel #cte-overlay').hide();
    $('#cte-map-panel .cte-popup').hide();
    window.CTEMap.closeSubMenu();
    window.CTEMap.closeTravelMenu();
};

window.CTEMap.openTravelMenu = function(destination) {
    window.CTEMap.currentDestination = destination;
    const box = $('#travel-menu-overlay');
    box.find('.travel-options').html(`
        <button class="cte-btn" onclick="window.CTEMap.confirmTravel(true)">👤 独自前往</button>
        <button class="cte-btn" onclick="window.CTEMap.showCompanionInput()">👥 和……一起前往</button>
        <button class="cte-btn" style="margin-top: 10px; border-color: #666; color: #888;" onclick="window.CTEMap.closeTravelMenu()">关闭</button>
    `);
    box.css('display', 'flex');
};

window.CTEMap.showCompanionInput = function() {
    $('#travel-menu-overlay .travel-options').html(`
        <p style="color: #888; margin: 0 0 10px 0;">和谁一起去？</p>
        <input type="text" id="companion-name" class="travel-input" placeholder="输入角色姓名">
        <button class="cte-btn" onclick="window.CTEMap.confirmTravel(false)">🤝 一起前往</button>
        <button class="cte-btn" style="margin-top: 10px; border-color: #666; color: #888;" onclick="window.CTEMap.openTravelMenu('${window.CTEMap.currentDestination}')">返回</button>
    `);
};

window.CTEMap.closeTravelMenu = function() {
    $('#travel-menu-overlay').hide();
};

window.CTEMap.goToCustomDestination = function() {
    const val = $('#custom-destination-input').val();
    if (val) {
        window.CTEMap.closeAllPopups();
        window.CTEMap.openTravelMenu(val);
    } else {
        alert('请输入地点名称');
    }
};

window.CTEMap.confirmTravel = function(isAlone) {
    const dest = window.CTEMap.currentDestination;
    let text = "";
    
    if (isAlone) {
        text = `{{user}} 决定独自前往${dest}。`;
    } else {
        const name = $('#companion-name').val();
        if (!name) return alert("请输入姓名");
        text = `{{user}} 邀请 ${name} 一起前往${dest}。`;
    }
    
    if (stContext) {
        stContext.executeSlashCommandsWithOptions(`/setinput ${text}`);
        window.CTEMap.closeAllPopups();
    }
};

window.CTEMap.openSubMenu = function(title, items) {
    const overlay = document.getElementById('interior-sub-menu');
    const titleEl = document.getElementById('sub-menu-title');
    const contentEl = document.getElementById('sub-menu-content');
    
    titleEl.textContent = title;
    contentEl.innerHTML = '';
    
    items.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'sub-item-btn';
        btn.textContent = item;
        btn.onclick = () => window.CTEMap.openThirdLevelMenu(item, title, items);
        contentEl.appendChild(btn);
    });
    
    overlay.style.display = 'flex';
};

window.CTEMap.closeSubMenu = function() {
    $('#interior-sub-menu').hide();
};

window.CTEMap.openThirdLevelMenu = function(roomName, floorTitle, floorItems) {
    const titleEl = document.getElementById('sub-menu-title');
    const contentEl = document.getElementById('sub-menu-content');
    
    titleEl.textContent = roomName;
    const desc = window.CTEMap.roomDetails[roomName] || "暂无详细介绍。";
    
    contentEl.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%;">
            <p style="text-align:justify; font-size:14px; line-height:1.6;">${desc}</p>
            <button class="cte-btn" onclick="window.CTEMap.openTravelMenu('${roomName}')">🚀 前往</button>
            <button class="sub-item-btn" id="temp-back-btn">[ < 返回上一级 ]</button>
        </div>
    `;
    
    document.getElementById('temp-back-btn').onclick = () => window.CTEMap.openSubMenu(floorTitle, floorItems);
};

window.CTEMap.openRooftopMenu = function() {
    window.CTEMap.openSubMenu('天台花园酒吧', []);
    const contentEl = document.getElementById('sub-menu-content');
    contentEl.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%;">
            <p style="text-align:justify; font-size:14px; line-height:1.6;">
                种植着四季花草，设有舒适的露天沙发、吧台和烧烤架，可以远眺京港的夜景，是成员们聚会放松的绝佳地点。
            </p>
            <button class="cte-btn" onclick="window.CTEMap.openTravelMenu('天台花园酒吧')">🚀 前往</button>
        </div>
    `;
};
