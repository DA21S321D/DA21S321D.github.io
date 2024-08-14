import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDWAgJF3ay8ko7tRbi6PHvYgypH-4YFGGk",
    authDomain: "wuwa-abyss.firebaseapp.com",
    databaseURL: "https://wuwa-abyss-default-rtdb.firebaseio.com",
    projectId: "wuwa-abyss",
    storageBucket: "wuwa-abyss.appspot.com",
    messagingSenderId: "56374829937",
    appId: "1:56374829937:web:a14c6be86462e71e504cd0",
    measurementId: "G-Q2YLP6V58L"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

window.firebaseDatabase = database;
window.firebaseRef = ref;

// Functions
function loadRandomBackground() {
    const images = [
        'pic/1.png',
        'pic/2.png',
        'pic/3.png',
        'pic/4.png'
    ];

    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];
    console.log(`Selected Image: ${selectedImage}`);

    const img = new Image();
    img.src = selectedImage;
    img.onload = function() {
        document.body.style.backgroundImage = `url('${selectedImage}')`;
        console.log('Background image loaded successfully.');
    };
    img.onerror = function() {
        console.error('Failed to load background image.');
        document.body.style.backgroundColor = '#333';
    };
}

function calculatePeriods() {
    const startPeriod = new Date("2024-08-19T17:00:00");
    const periodDays = 14;
    const currentDate = new Date();

    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };


    let nextPeriods = [];
    
    // 计算与当前时间最近的一个未来周期
    let periodTime = startPeriod;
    while (periodTime < currentDate) {
        periodTime = new Date(periodTime.getTime() + periodDays * 24 * 60 * 60 * 1000);
    }
    
    // 计算5个周期：前两个周期、当前周期、后两个周期
    for (let i = -2; i <= 2; i++) {
        const cycleTime = new Date(periodTime.getTime() + i * periodDays * 24 * 60 * 60 * 1000);
        nextPeriods.push(cycleTime);
    }

    // 显示下一个周期时间
    const nextPeriodTime = nextPeriods[2];  // 中间的是当前周期
    document.getElementById("next-period").innerHTML = nextPeriodTime.toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    // 检查和更新Firebase中的周期记录
    nextPeriods.forEach(periodTime => {
        const periodName = periodTime.toLocaleString(undefined, options);

        const periodRef = window.firebaseRef(window.firebaseDatabase, 'periods/' + periodName);

        // 检查Firebase中是否存在此周期的记录
        get(periodRef).then(snapshot => {
            if (!snapshot.exists()) {
                console.log(`No data available for period ${periodName}. Creating default state.`);
                set(periodRef, false).then(() => {
                    console.log(`Default state for period ${periodName} created.`);
                }).catch(error => {
                    console.error(`Error creating default state for period ${periodName}:`, error);
                });
            } else {
                console.log(`Period ${periodName} already exists in Firebase.`);
            }
        }).catch(error => {
            console.error(`Error checking period ${periodName}:`, error);
        });
    });

    // 显示所有5个周期
    let collapsedPeriodsHtml = "";
    for (let i = 0; i < nextPeriods.length; i++) {
        const periodId = `period-${i}`;
        const periodName = nextPeriods[i].toLocaleString(undefined, options);
        collapsedPeriodsHtml += `<li id="${periodId}">
            ${periodName}
            <button id="button-${periodId}" onclick="toggleCompletion('${periodName}', '${periodId}')">加载中</button>
        </li>`;
    }
    document.getElementById("collapsed-periods").innerHTML = collapsedPeriodsHtml;

    // 加载完成状态
    nextPeriods.forEach((periodTime, i) => {
        const periodId = `period-${i}`;
        const periodName = periodTime.toLocaleString(undefined, options);
        loadCompletionState(periodName, periodId);
    });
}

function RestTime(){
    const startPeriod = new Date("2024-08-19T17:00:00");
    const periodDays = 14;
    const currentDate = new Date();

    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    document.getElementById("current-time").innerHTML = currentDate.toLocaleString(undefined, options);

    let nextPeriods = [];
    
    // 计算与当前时间最近的一个未来周期
    let periodTime = startPeriod;
    while (periodTime < currentDate) {
        periodTime = new Date(periodTime.getTime() + periodDays * 24 * 60 * 60 * 1000);
    }
    
    // 计算5个周期：前两个周期、当前周期、后两个周期
    for (let i = -2; i <= 2; i++) {
        const cycleTime = new Date(periodTime.getTime() + i * periodDays * 24 * 60 * 60 * 1000);
        nextPeriods.push(cycleTime);
    }

    // 显示下一个周期时间
    const nextPeriodTime = nextPeriods[2];  // 中间的是当前周期

      // 更新剩余时间
      const timeDiff = nextPeriodTime - currentDate;

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
      document.getElementById("time-until-next").innerHTML =
          "距离下一次刷新还有：" + days + "天 " + hours + "小时 " + minutes + "分钟 " + seconds + "秒";
  

}
function loadCompletionState(periodName, periodId) {
    const button = document.getElementById(`button-${periodId}`);
    const periodRef = window.firebaseRef(window.firebaseDatabase, 'periods/' + periodName);

    get(periodRef).then(snapshot => {
        if (snapshot.exists()) {
            const status = snapshot.val();
            console.log(`Completion state for period ${periodName} loaded: ${status}`);
            updateButton(periodId, status);
        } else {
            console.log(`No data available for period ${periodName}. Creating default state.`);
            set(periodRef, false).then(() => {
                console.log(`Default state for period ${periodName} created.`);
                updateButton(periodId, false);
            }).catch(error => {
                console.error(`Error creating default state for period ${periodName}:`, error);
            });
        }
    }).catch(error => {
        console.error(`Error loading completion state for period ${periodName}:`, error);
    });
}

function toggleCompletion(periodName, periodId) {
    console.log(`Button ${periodId} clicked for period ${periodName}`);

    // 使用正则表达式解析 periodName 中的日期和时间部分
    const dateTimeRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2}) (\d{2}:\d{2}:\d{2})$/;
    const match = periodName.match(dateTimeRegex);

    if (!match) {
        console.error(`Invalid date format in periodName: ${periodName}`);
        return;
    }

    const year = match[1];
    const month = match[2];
    const day = match[3];
    const timePart = match[4];

    // 构建 Firebase 的引用路径，确保月份和日期是整数
    const formattedPeriodRefPath = `periods/${year}/${parseInt(month)}/${parseInt(day)} ${timePart}`;
    const periodRef = window.firebaseRef(window.firebaseDatabase, formattedPeriodRefPath);

    get(periodRef).then(snapshot => {
        if (snapshot.exists()) {
            const currentStatus = snapshot.val();
            const newStatus = !currentStatus;

            console.log(`Toggling completion state for period ${periodName} to ${newStatus}`);
            set(periodRef, newStatus).then(() => {
                updateButton(periodId, newStatus);
                console.log(`Completion state for period ${periodName} updated to ${newStatus}`);
            }).catch(error => {
                console.error(`Error updating completion state for period ${periodName}:`, error);
            });
        } else {
            console.log(`No data available for period ${periodName}. Creating default state.`);
            set(periodRef, false).then(() => {
                updateButton(periodId, false);
                console.log(`Default state for period ${periodName} created.`);
            }).catch(error => {
                console.error(`Error creating default state for period ${periodName}:`, error);
            });
        }
    }).catch(error => {
        console.error(`Error toggling completion state for period ${periodName}:`, error);
    });
}




function updateButton(periodId, status) {
    const button = document.getElementById(`button-${periodId}`);
    if (!button) {
        console.error(`Button with id ${periodId} not found`);
        return;
    }

    if (status) {
        button.textContent = "已完成";
        button.classList.add('completed');  // 添加一个类用于已完成状态的样式
    } else {
        button.textContent = "未完成";
        button.classList.remove('completed');  // 移除已完成状态的样式
    }

    console.log(`Button with id ${periodId} updated to status: ${status ? '已完成' : '未完成'}`);
}

function toggleCollapse() {
    const collapseElement = document.getElementById("collapsed-periods");
    const toggleButton = document.getElementById("toggle-button");
    if (collapseElement.style.display === "none") {
        collapseElement.style.display = "block";
        toggleButton.innerHTML = "折叠";
    } else {
        collapseElement.style.display = "none";
        toggleButton.innerHTML = "显示剩余刷新时间";
    }
}

//完成日历记录
function loadCompletedPeriods() {
    const completedList = document.getElementById("completed-list");
    const periodsRef = window.firebaseRef(window.firebaseDatabase, 'periods');

    // 清空列表
    completedList.innerHTML = '';

    get(periodsRef).then(snapshot => {
        if (snapshot.exists()) {
            const periods = snapshot.val();
            const completedPeriods = [];

            // 解析 Firebase 数据结构
            for (const year in periods) {
                for (const month in periods[year]) {
                    for (const dateTime in periods[year][month]) {
                        if (periods[year][month][dateTime] === true) {
                            const fullDate = `${year}-${month}-${dateTime}`;
                            completedPeriods.push(fullDate);
                        }
                    }
                }
            }

            if (completedPeriods.length > 0) {
                // 按日期从晚到早排序
                completedPeriods.sort((a, b) => new Date(b) - new Date(a));

                completedPeriods.forEach(period => {
                    const listItem = document.createElement('li');
                    listItem.textContent = period;  // 显示周期的完整日期和时间
                    completedList.appendChild(listItem);
                });
            } else {
                const listItem = document.createElement('li');
                listItem.textContent = "没有已完成的周期记录。";
                completedList.appendChild(listItem);
            }
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = "没有周期记录。";
            completedList.appendChild(listItem);
        }
    }).catch(error => {
        console.error('Error loading completed periods:', error);
    });
}





//将函数暴露在全局作用域上
window.toggleCompletion = toggleCompletion;
window.loadRandomBackground = loadRandomBackground;
window.calculatePeriods = calculatePeriods;
window.toggleCollapse = toggleCollapse;
window.loadCompletionState = loadCompletionState;
window.updateButton = updateButton;

window.onload = function() {
    console.log("Window onload triggered");
    loadRandomBackground();
    calculatePeriods();
    document.getElementById("collapsed-periods").style.display = "none";
    
    const toggleButton = document.getElementById("toggle-button");
    if (toggleButton) {
        console.log("Button found, adding event listener");
        toggleButton.addEventListener("click", toggleCollapse);
    } else {
        console.error("Button not found!");
    }
    // 添加“显示完成记录”按钮的事件监听器
    const toggleButton2 = document.getElementById("toggle-button2");
    if (toggleButton2) {
        toggleButton2.addEventListener("click", function() {
            const completedPeriodsDiv = document.getElementById("completed-periods");
            if (completedPeriodsDiv.style.display === "none") {
                completedPeriodsDiv.style.display = "block";
                loadCompletedPeriods(); // 加载完成的周期记录
            } else {
                completedPeriodsDiv.style.display = "none";
            }
        });
    } else {
        console.error("Button 2 not found!");
    }
};

// 每秒更新一次距离下一个周期的时间
setInterval(RestTime, 1000);
