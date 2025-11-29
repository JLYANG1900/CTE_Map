const extensionName = "CTE_Map";
const extensionPath = `scripts/extensions/third-party/${extensionName}`;

let stContext = null;

// 定义全局命名空间
window.CTEMap = {
    currentDestination: '',
    currentCompanion: '', 
    // 暂存NPC设置状态
    tempNPCState: { enabled: false, content: '' },
    // 地点对应的默认NPC配置
    npcDefaults: {
        '机场': '粉丝、工作人员、其他团队成员',
        '京港电视台': '粉丝、工作人员、其他团队成员',
        '私人会所': '社交名流'
    },
    // 角色资料数据
    characterProfiles: {
        '魏月华': {
            image: 'https://files.catbox.moe/auqnct.jpeg',
            age: 27,
            role: '万城娱乐CEO、CTE男团缔造者',
            personality: '严肃、冷酷、认真、严谨'
        },
        '秦述': {
            image: 'https://files.catbox.moe/c2khbl.jpeg',
            age: 24,
            role: 'CTE男团队长、主舞担当、艺名Qshot',
            personality: '沉默、清冷、内敛'
        },
        '司洛': {
            image: 'https://files.catbox.moe/pohz52.jpeg',
            age: 24,
            role: 'CTE男团全能ACE、主舞担当、艺名SOLO',
            personality: '慵懒、随性、玩世不恭'
        },
        '鹿言': {
            image: 'https://files.catbox.moe/parliq.jpeg',
            age: 23,
            role: 'CTE男团主唱担当、艺名DEER',
            personality: '温柔、谦逊、善良'
        },
        '魏星泽': {
            image: 'https://files.catbox.moe/syo0ze.jpeg',
            age: 20,
            role: 'CTE男团舞蹈担当、气氛担当、艺名STARS',
            personality: '开朗、感性、大大咧咧'
        },
        '周锦宁': {
            image: 'https://files.catbox.moe/1loxsn.jpeg',
            age: 20,
            role: 'CTE男团Rapper、门面担当、艺名JinNa',
            personality: '傲娇、矜贵、毒舌'
        },
        '谌绪': {
            image: 'https://files.catbox.moe/9tnuva.png',
            age: 18,
            role: 'CTE男团主唱担当、忙内、艺名Chase',
            personality: '腹黑、恶劣、隐藏病娇'
        },
        '孟明赫': {
            image: 'https://files.catbox.moe/m446ro.jpeg',
            age: 20,
            role: 'CTE男团Rapper、艺名Hades',
            personality: '阴郁、厌世、内向、大胆叛逆'
        },
        '亓谢': {
            image: 'https://files.catbox.moe/ev2g1l.png',
            age: 18,
            role: 'CTE男团舞蹈担当、副Rapper、艺名KNIFE',
            personality: '疯批、天才、毒舌、直白'
        },
        '桑洛凡': {
            image: 'https://files.catbox.moe/syudzu.png',
            age: 27,
            role: '传奇Solo爱豆、CTE精神支柱、艺名Lovan',
            personality: '慵懒随性、桀骜不驯、腹黑'
        },
        '你': {
            image: '', // 用户自定义头像，默认为空
            age: '?',
            role: 'CTE宿舍成员',
            personality: '由你定义'
        }
    },
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

/**
 * [修复] 动态计算并设置面板位置
 * 解决手机端因浏览器地址栏/工具栏导致的界面上浮问题
 */
function fixPanelPosition() {
    const panel = document.getElementById('cte-map-panel');
    if (!panel) return;

    // 获取真实可视区域尺寸
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // 获取面板尺寸
    const panelRect = panel.getBoundingClientRect();
    const panelHeight = panelRect.height || panel.offsetHeight;
    const panelWidth = panelRect.width || panel.offsetWidth;

    // 判断是否为移动端（宽度小于 768px）
    const isMobile = viewportWidth < 768;

    if (isMobile) {
        // 移动端：使用 fixed 定位，基于真实 viewport 计算
        // 清除 CSS 中的 transform 居中，改用直接定位
        panel.style.position = 'fixed';
        panel.style.transform = 'none';
        panel.style.top = Math.max(10, (viewportHeight - panelHeight) / 2) + 'px';
        panel.style.left = Math.max(5, (viewportWidth - panelWidth) / 2) + 'px';
        
        // 确保面板不会超出屏幕顶部
        if (parseFloat(panel.style.top) < 10) {
            panel.style.top = '10px';
        }
        
        // 移动端限制最大高度，防止超出可视区域
        panel.style.maxHeight = (viewportHeight - 20) + 'px';
    } else {
        // 桌面端：恢复原版 CSS 居中效果
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.maxHeight = '85vh';
    }
}

/**
 * [新增] 监听窗口变化，实时调整面板位置
 */
function setupResizeListener() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const panel = document.getElementById('cte-map-panel');
            if (panel && panel.style.display !== 'none') {
                fixPanelPosition();
            }
        }, 100);
    });

    // 针对移动端浏览器地址栏显示/隐藏的特殊处理
    window.addEventListener('orientationchange', () => {
        setTimeout(fixPanelPosition, 300);
    });
}

async function initializeExtension() {
    console.log("[CTE Map] Initializing...");

    // 清理可能存在的旧元素，防止重复加载导致的ID冲突
    $('#cte-map-panel').remove();
    $('#cte-toggle-btn').remove();
    $('link[href*="CTE_Map/style.css"]').remove();

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${extensionPath}/style.css`;
    document.head.appendChild(link);

    // [修改] 顶部导航栏增加了“地图”和“行程表”的切换按钮
    const panelHTML = `
        <div id="cte-toggle-btn" title="点击打开 / 长按拖动" 
             style="position:fixed; top:130px; left:10px; z-index:9000; width:40px; height:40px; background:#b38b59; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:move; box-shadow:0 4px 10px rgba(0,0,0,0.3); color:#fff; font-size:20px;">
            🗺️
        </div>
        <div id="cte-map-panel">
            <div id="cte-drag-handle">
                <span>CTE 档案地图</span>
                <div class="cte-nav-group">
                    <button class="cte-nav-btn active" onclick="window.CTEMap.switchView('map', this)">地图</button>
                    <button class="cte-nav-btn" onclick="window.CTEMap.switchView('schedule', this)">行程表</button>
                    <span id="cte-close-btn" style="cursor:pointer; margin-left:10px;">❌</span>
                </div>
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

    // =================================================
    // [新增] 悬浮图标拖拽与点击冲突处理逻辑
    // =================================================
    let isIconDragging = false;

    // [修复] 打开面板时调用 fixPanelPosition
    $('#cte-toggle-btn').on('click', (e) => {
        // [修改] 如果被标记为正在拖拽，则不执行打开面板的操作
        if (isIconDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        const panel = $('#cte-map-panel');
        if (panel.is(':visible')) {
            panel.fadeOut();
        } else {
            panel.fadeIn(200, function() {
                // 面板显示后立即修正位置
                fixPanelPosition();
                // 每次打开如果是在行程表界面，自动刷新一次
                if ($('#cte-view-schedule').is(':visible')) {
                    window.CTEMap.refreshSchedule();
                }
            });
        }
    });
    
    $('#cte-close-btn').on('click', () => $('#cte-map-panel').fadeOut());

    if ($.fn.draggable) {
        // 主面板拖拽
        $('#cte-map-panel').draggable({ 
            handle: '#cte-drag-handle',
            containment: 'window'
        });

        // [新增] 悬浮图标拖拽初始化
        $('#cte-toggle-btn').draggable({
            containment: 'window', // 限制在窗口内拖动
            start: function() {
                isIconDragging = true; // 开始拖拽，标记状态
            },
            stop: function() {
                // 停止拖拽后，稍微延迟一下再取消标记
                // 这是为了防止松开鼠标的瞬间触发 click 事件
                setTimeout(() => {
                    isIconDragging = false;
                }, 50); 
            }
        });
    }

    // [新增] 设置窗口变化监听
    setupResizeListener();
}

// [新增] 视图切换功能 (地图/行程表)
window.CTEMap.switchView = function(viewName, btn) {
    // 切换按钮样式
    $('.cte-nav-btn').removeClass('active');
    $(btn).addClass('active');

    // 切换内容显示
    $('.cte-view').removeClass('active');
    $(`#cte-view-${viewName}`).addClass('active');

    // 如果切换到行程表，自动刷新数据
    if (viewName === 'schedule') {
        window.CTEMap.refreshSchedule();
    }
};

// [新增] 从ST聊天记录中提取 status_top 并渲染行程表
window.CTEMap.refreshSchedule = async function() {
    const statusEl = $('#cte-schedule-status');
    const container = $('#cte-timeline-container');
    
    statusEl.text('正在读取最新状态...');
    
    if (!stContext) {
        statusEl.text('错误：无法连接到 SillyTavern 上下文。');
        return;
    }

    // 获取当前聊天记录
    // 通常可以通过 SillyTavern.getContext().chat 获取
    // 我们需要从后往前找，找到第一个包含 <status_top> 的消息
    const chat = stContext.chat || [];
    let foundContent = null;

    for (let i = chat.length - 1; i >= 0; i--) {
        const msg = chat[i].mes;
        // 简单的正则匹配 <status_top> 内容
        const match = msg.match(/<status_top>([\s\S]*?)<\/status_top>/i);
        if (match) {
            foundContent = match[1].trim();
            break;
        }
    }

    if (!foundContent) {
        statusEl.text('未找到最新行程信息');
        container.html('<p style="text-align:center; color:#666; margin-top:50px;">在聊天记录中未找到 &lt;status_top&gt; 标签。</p>');
        return;
    }

    statusEl.text('行程安排 (已同步)');
    const items = window.CTEMap.parseSchedule(foundContent);
    window.CTEMap.renderSchedule(items);
};

// [新增] 解析行程文本
// 假设格式为每行一个项目，或者像 HTML 那样有时间。
// 这里做一个通用的解析：尝试提取 "时间" 和 "内容"
// 如果每一行都包含 ":" 或 "："，则前半部分为时间，后半部分为内容
window.CTEMap.parseSchedule = function(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const items = [];

    lines.forEach(line => {
        // 尝试匹配时间格式 (例如 19:30, 20:00, [19:00])
        // 简单的逻辑：分隔符为冒号或者空格
        let time = '';
        let content = line;
        
        // 匹配行首的时间 (例如 19:30 CTE开场, 19:30 - CTE开场)
        const timeMatch = line.match(/^\[?(\d{1,2}:\d{2})\]?\s*[-:：]?\s*(.*)/);
        
        if (timeMatch) {
            time = timeMatch[1];
            content = timeMatch[2];
        } else {
            // 如果没有明确时间，使用默认标记
            time = '待定';
        }

        items.push({ time, content, raw: line });
    });

    return items;
};

// [新增] 渲染行程时间轴
window.CTEMap.renderSchedule = function(items) {
    const container = $('#cte-timeline-container');
    container.empty();

    if (items.length === 0) {
        container.html('<p style="text-align:center; color:#666;">行程单为空。</p>');
        return;
    }

    items.forEach(item => {
        // 尝试提取"标签" (例如括号里的内容)
        let displayContent = item.content;
        let tagsHtml = '';
        
        // 提取 (tag) 或 [tag]
        const tagMatch = displayContent.match(/[\(\[\（](.*?)[\)\]\）]/);
        if (tagMatch) {
            // 将提取到的标签移除，单独显示
            // displayContent = displayContent.replace(tagMatch[0], '');
            tagsHtml = `<span class="cte-tag">${tagMatch[1]}</span>`;
        }

        const html = `
            <div class="cte-timeline-item">
                <div class="cte-timeline-time">${item.time}</div>
                <div class="cte-timeline-content">
                    <div class="cte-schedule-title">
                        <span>${displayContent}</span>
                        ${tagsHtml}
                    </div>
                    <!-- 如果有详细描述，可以在解析时扩展，这里暂时只显示一行 -->
                    <!-- <div class="cte-schedule-desc">备注信息...</div> -->
                    
                    <button class="cte-exec-btn" onclick="window.CTEMap.executeScheduleItem('${item.raw.replace(/'/g, "\\'")}')">
                        ⚡ 执行行程
                    </button>
                </div>
            </div>
        `;
        container.append(html);
    });
};

// [新增] 执行行程
window.CTEMap.executeScheduleItem = function(itemText) {
    const text = `{{user}} 开始执行行程：${itemText}`;
    
    if (stContext) {
        stContext.executeSlashCommandsWithOptions(`/setinput ${text}`);
        // 可选：执行后自动关闭面板
        // $('#cte-map-panel').fadeOut();
    } else {
        alert("无法连接到 SillyTavern，请确保插件已正确加载。");
    }
};

function bindMapEvents() {
    const mapContainer = document.getElementById('cte-map-container');
    if (!mapContainer) return;
    
    const locations = mapContainer.querySelectorAll('.location');
    
    locations.forEach(elm => {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        let hasMoved = false;

        elm.onmousedown = function(e) {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡
            isDragging = true;
            hasMoved = false;
            elm.classList.add('dragging');
            
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = elm.offsetLeft;
            initialTop = elm.offsetTop;

            document.onmousemove = function(e) {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;

                let newLeft = initialLeft + dx;
                let newTop = initialTop + dy;
                
                newLeft = Math.max(0, Math.min(newLeft, mapContainer.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, mapContainer.offsetHeight));

                elm.style.left = newLeft + 'px';
                elm.style.top = newTop + 'px';
            };

            document.onmouseup = function() {
                isDragging = false;
                elm.classList.remove('dragging');
                document.onmousemove = null;
                document.onmouseup = null;

                if (!hasMoved) {
                    const popupId = elm.getAttribute('data-popup');
                    if (popupId) window.CTEMap.showPopup(popupId);
                } else {
                    savePosition(elm.id, elm.style.left, elm.style.top);
                }
            };
        };
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
    
    // 使用 querySelector 限制在 panel 内部查找，避免找到错误的元素
    const popup = document.querySelector(`#cte-map-panel #${id}`);
    const overlay = document.querySelector(`#cte-map-panel #cte-overlay`);
    
    if (popup) {
        if (overlay) overlay.style.display = 'block';
        popup.style.display = 'block';
        // 修正：打开弹窗时，让弹窗内部回滚到顶部
        popup.scrollTop = 0;
    }
};

window.CTEMap.closeAllPopups = function() {
    // 隐藏遮罩和所有弹窗
    $('#cte-map-panel #cte-overlay').hide();
    $('#cte-map-panel .cte-popup').hide();
    window.CTEMap.closeSubMenu();
    window.CTEMap.closeTravelMenu();
};

window.CTEMap.openTravelMenu = function(destination) {
    window.CTEMap.currentDestination = destination;
    
    // 重置临时NPC状态
    window.CTEMap.tempNPCState = { enabled: false, content: '' };
    
    // 获取当前地点默认的NPC (如果没有定义，则为空字符串)
    const defaultNPC = window.CTEMap.npcDefaults[destination] || '';

    const box = $('#travel-menu-overlay');
    box.find('.travel-options').html(`
        <!-- 新增: NPC 遇见选项 -->
        <div style="margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                <span style="color:#aaa; font-size:13px;">是否遇见NPC？</span>
                <div>
                    <button id="btn-npc-yes" class="cte-btn" style="font-size:12px; padding:2px 8px; margin-right:5px; border-color:#666;" onclick="window.CTEMap.toggleNPC(true, '${defaultNPC}')">是</button>
                    <button id="btn-npc-no" class="cte-btn" style="font-size:12px; padding:2px 8px; background:#b38b59; color:#1a1a1a;" onclick="window.CTEMap.toggleNPC(false)">否</button>
                </div>
            </div>
            <input type="text" id="npc-input" class="travel-input" style="display:none; font-size:13px; margin-bottom:0;" placeholder="请输入遇见的人 (例如: 粉丝)" value="${defaultNPC}">
        </div>

        <button class="cte-btn" onclick="window.CTEMap.confirmTravel(true)">👤 独自前往</button>
        <!-- [修改] 点击按钮后不再直接跳转，而是先保存状态 -->
        <button class="cte-btn" onclick="window.CTEMap.prepareCompanionInput()">👥 和……一起前往</button>
        <button class="cte-btn" style="margin-top: 10px; border-color: #666; color: #888;" onclick="window.CTEMap.closeTravelMenu()">关闭</button>
    `);
    box.css('display', 'flex');
};

window.CTEMap.toggleNPC = function(enable, defaultText) {
    const input = document.getElementById('npc-input');
    const btnYes = document.getElementById('btn-npc-yes');
    const btnNo = document.getElementById('btn-npc-no');

    window.CTEMap.tempNPCState.enabled = enable;

    if (enable) {
        input.style.display = 'block';
        // 只有当输入框为空且有默认值时才填充，避免覆盖用户已修改的内容
        if (defaultText && !input.value) input.value = defaultText;
        
        // 更新按钮样式
        btnYes.style.background = '#b38b59';
        btnYes.style.color = '#1a1a1a';
        btnYes.style.borderColor = '#b38b59';
        
        btnNo.style.background = 'transparent';
        btnNo.style.color = '#e0c5a1';
        btnNo.style.borderColor = '#666';
    } else {
        input.style.display = 'none';
        
        // 更新按钮样式
        btnNo.style.background = '#b38b59';
        btnNo.style.color = '#1a1a1a';
        btnNo.style.borderColor = '#b38b59';

        btnYes.style.background = 'transparent';
        btnYes.style.color = '#e0c5a1';
        btnYes.style.borderColor = '#666';
    }
};

window.CTEMap.prepareCompanionInput = function() {
    const npcInput = document.getElementById('npc-input');
    if (npcInput && window.CTEMap.tempNPCState.enabled) {
        window.CTEMap.tempNPCState.content = npcInput.value.trim();
    }
    window.CTEMap.showCompanionInput();
}

window.CTEMap.showCompanionInput = function() {
    $('#travel-menu-overlay .travel-options').html(`
        <p style="color: #888; margin: 0 0 10px 0;">和谁一起去？</p>
        <input type="text" id="companion-name" class="travel-input" placeholder="输入角色姓名">
        <button class="cte-btn" onclick="window.CTEMap.validateAndShowActivities()">🤝 一起前往</button>
        <button class="cte-btn" style="margin-top: 10px; border-color: #666; color: #888;" onclick="window.CTEMap.openTravelMenu('${window.CTEMap.currentDestination}')">返回</button>
    `);
};

window.CTEMap.validateAndShowActivities = function() {
    const name = $('#companion-name').val();
    if (!name) return alert("请输入姓名");
    
    // 暂存同伴姓名
    window.CTEMap.currentCompanion = name;
    
    // 显示活动选择界面
    window.CTEMap.showActivityMenu();
};

window.CTEMap.showActivityMenu = function() {
    const activities = ['训练', '开会', '购物', '闲逛', '吃饭', '喝酒', '约会', '做爱', '运动', '直播', '拍摄节目', '接受媒体采访'];
    
    // 生成活动按钮网格
    let buttonsHtml = activities.map(act => 
        `<button class="cte-btn" style="margin: 3px; min-width: 60px; font-size: 13px;" onclick="window.CTEMap.finalizeTravel('${act}')">${act}</button>`
    ).join('');

    $('#travel-menu-overlay .travel-options').html(`
        <p style="color: #e0c5a1; margin: 0 0 10px 0;">去做什么？</p>
        
        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:4px; margin-bottom:15px; max-height: 200px; overflow-y: auto;">
            ${buttonsHtml}
        </div>
        
        <div style="border-top: 1px solid #444; padding-top: 10px; width: 100%;">
            <input type="text" id="custom-activity" class="travel-input" placeholder="自定义活动..." style="margin-bottom: 8px;">
            <button class="cte-btn" onclick="window.CTEMap.finalizeTravel(null)">🚀 确认出发</button>
        </div>
        
        <button class="cte-btn" style="margin-top: 10px; border-color: #666; color: #888; font-size: 12px; padding: 4px 10px;" onclick="window.CTEMap.showCompanionInput()">返回上一步</button>
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
    let npcText = '';

    const npcInput = document.getElementById('npc-input');
    if (npcInput && window.CTEMap.tempNPCState.enabled) {
         const val = npcInput.value.trim();
         if (val) npcText = `，遇见了${val}`;
    }

    if (isAlone) {
        let text = `{{user}} 决定独自前往${dest}${npcText}。`;
        if (stContext) {
            stContext.executeSlashCommandsWithOptions(`/setinput ${text}`);
            window.CTEMap.closeAllPopups();
        }
    }
};

window.CTEMap.finalizeTravel = function(activity) {
    const dest = window.CTEMap.currentDestination;
    let finalActivity = activity;
    
    if (!finalActivity) {
        finalActivity = $('#custom-activity').val();
    }
    
    if (!finalActivity) return alert("请选择或输入活动内容");

    const name = window.CTEMap.currentCompanion;
    
    let npcText = '';
    if (window.CTEMap.tempNPCState.enabled && window.CTEMap.tempNPCState.content) {
        npcText = `，期间遇见了${window.CTEMap.tempNPCState.content}`;
    }
    
    const text = `{{user}} 邀请 ${name} 一起前往${dest}，${finalActivity}${npcText}。`;
    
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
    
    // 检查是否为角色房间
    const profile = window.CTEMap.characterProfiles[roomName];
    
    let contentHTML = '';
    
    if (profile) {
        // 特殊处理"你"的房间
        if (roomName === '你') {
            const savedAvatar = localStorage.getItem('cte_user_avatar');
            const avatarSrc = savedAvatar || '';
            const hasAvatar = avatarSrc !== '';
            
            contentHTML = `
                <div class="character-room-detail">
                    <div class="character-portrait user-portrait ${hasAvatar ? '' : 'no-avatar'}">
                        ${hasAvatar 
                            ? `<img src="${avatarSrc}" alt="你" class="character-image" id="user-avatar-img">` 
                            : `<div class="avatar-placeholder" id="user-avatar-placeholder">
                                <span class="placeholder-icon">👤</span>
                                <span class="placeholder-text">点击上传头像</span>
                               </div>`
                        }
                    </div>
                    <div class="avatar-upload-section">
                        <button class="cte-btn avatar-upload-btn" onclick="document.getElementById('user-avatar-upload').click()">
                            📷 ${hasAvatar ? '更换头像' : '上传头像'}
                        </button>
                        <input type="file" id="user-avatar-upload" accept="image/*" style="display:none;" onchange="window.CTEMap.uploadUserAvatar(this)">
                        ${hasAvatar ? `<button class="cte-btn avatar-delete-btn" onclick="window.CTEMap.deleteUserAvatar()">🗑️ 删除头像</button>` : ''}
                    </div>
                    <div class="character-info">
                        <div class="info-row">
                            <span class="info-label">姓名</span>
                            <span class="info-value">你</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">年龄</span>
                            <span class="info-value">${profile.age}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">身份</span>
                            <span class="info-value">${profile.role}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">性格</span>
                            <span class="info-value">${profile.personality}</span>
                        </div>
                    </div>
                    <div class="room-description">
                        <p>${desc}</p>
                    </div>
                    <div class="action-buttons">
                        <button class="cte-btn" onclick="window.CTEMap.openTravelMenu('你的房间')">🚀 前往</button>
                        <button class="sub-item-btn" id="temp-back-btn">[ < 返回上一级 ]</button>
                    </div>
                </div>
            `;
        } else {
            contentHTML = `
                <div class="character-room-detail">
                    <div class="character-portrait">
                        <img src="${profile.image}" alt="${roomName}" class="character-image">
                    </div>
                    <div class="character-info">
                        <div class="info-row">
                            <span class="info-label">姓名</span>
                            <span class="info-value">${roomName}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">年龄</span>
                            <span class="info-value">${profile.age}岁</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">身份</span>
                            <span class="info-value">${profile.role}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">性格</span>
                            <span class="info-value">${profile.personality}</span>
                        </div>
                    </div>
                    <div class="room-description">
                        <p>${desc}</p>
                    </div>
                    <div class="action-buttons">
                        <button class="cte-btn" onclick="window.CTEMap.openTravelMenu('${roomName}的房间')">🚀 前往</button>
                        <button class="sub-item-btn" id="temp-back-btn">[ < 返回上一级 ]</button>
                    </div>
                </div>
            `;
        }
    } else {
        contentHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%;">
                <p style="text-align:justify; font-size:14px; line-height:1.6;">${desc}</p>
                <button class="cte-btn" onclick="window.CTEMap.openTravelMenu('${roomName}')">🚀 前往</button>
                <button class="sub-item-btn" id="temp-back-btn">[ < 返回上一级 ]</button>
            </div>
        `;
    }
    
    contentEl.innerHTML = contentHTML;
    
    document.getElementById('temp-back-btn').onclick = () => window.CTEMap.openSubMenu(floorTitle, floorItems);
};

window.CTEMap.uploadUserAvatar = function(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        if (file.size > 2 * 1024 * 1024) {
            alert('图片大小不能超过2MB，请选择较小的图片');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            try {
                localStorage.setItem('cte_user_avatar', imageData);
                window.CTEMap.openThirdLevelMenu('你', '五楼：私人宿舍区', ['秦述', '司洛', '鹿言', '魏星泽', '周锦宁', '谌绪', '孟明赫', '亓谢', '魏月华', '桑洛凡', '你', '公共书房/阅览区']);
            } catch (err) {
                alert('保存失败，图片可能太大。请尝试使用较小的图片。');
            }
        };
        reader.readAsDataURL(file);
    }
};

window.CTEMap.deleteUserAvatar = function() {
    if (confirm('确定要删除头像吗？')) {
        localStorage.removeItem('cte_user_avatar');
        window.CTEMap.openThirdLevelMenu('你', '五楼：私人宿舍区', ['秦述', '司洛', '鹿言', '魏星泽', '周锦宁', '谌绪', '孟明赫', '亓谢', '魏月华', '桑洛凡', '你', '公共书房/阅览区']);
    }
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
