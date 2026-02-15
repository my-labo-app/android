document.addEventListener("DOMContentLoaded", () => {

    // スクロール
    const scrollContainer = document.getElementById("calendar-scroll");
    // ヘッダー年月
    const headerMonth = document.getElementById("header-month");
    // 日付ピッカー
    const picker = document.getElementById("month-picker");
    // 選択した日付
    const detailDate = document.getElementById("detailDate");
    // 今日に戻る
    const goTodayBtn = document.getElementById("go-today");
    // 日付ピッカーを開く
    const openPickerBtn = document.getElementById("open-picker");

    // 読み込み
    const today = new Date();
    const START_YEAR = 2025;
    const END_YEAR = 2040;

    // ヘッダー月
    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];
    
    // ディティール六曜
    const rokuyo = ["大安","赤口","先勝","友引","先負","仏滅"];

    // ヘッダー
    function updateHeader(year, month) {
    headerMonth.querySelector(".year").textContent = year;
    headerMonth.querySelector(".month").textContent = monthNames[month];
}
    // 曜日
    function updateDetail(year, month, day) {
        const date = new Date(year, month, day);
        const weekDays = ["日","月","火","水","木","金","土"];
        const r = rokuyo[(year + month + day) % 6];
        detailDate.textContent =
            `${year}年${month + 1}月${day}日(${weekDays[date.getDay()]}) ${r}`;
    }

    // カレンダー
    function renderCalendar(year, month) {
        const container = document.createElement("div");
        container.className = "calendar-container";
        container.dataset.year = year;
        container.dataset.month = month + 1;

        // 曜日
        const weekdays = document.createElement("div");
        weekdays.className = "weekdays";

        ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach((d, i) => {
            const div = document.createElement("div");
            div.textContent = d;
            if (i === 5) div.classList.add("sat");
            if (i === 6) div.classList.add("sun");
            weekdays.appendChild(div);
        });

        container.appendChild(weekdays);
        const cal = document.createElement("div");
        cal.className = "calendar";

        // 読み込み
        const firstDay = new Date(year, month, 1).getDay();
        const startIndex = (firstDay + 6) % 7;
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();

        // 1ヶ月42マス
        const totalCells = 42;

        for (let i = 0; i < totalCells; i++) {

            const div = document.createElement("div");
            div.className = "day";

            const dateNum = i - startIndex + 1;

            // ===== 前月 =====
            if (dateNum <= 0) {

                const prevDate = prevLastDate + dateNum;
                div.textContent = prevDate;
                div.classList.add("other-month");

                div.addEventListener("click", () => {
                    container.querySelectorAll(".day")
                        .forEach(el => el.classList.remove("selected"));

                    div.classList.add("selected");

                    const targetMonth = month - 1;
                    const targetYear = targetMonth < 0 ? year - 1 : year;
                    const realMonth = (targetMonth + 12) % 12;

                    updateDetail(targetYear, realMonth, prevDate);
                    updateHeader(targetYear, realMonth);
                });

            // ===== 次月 =====
            } else if (dateNum > lastDate) {

                const nextDate = dateNum - lastDate;
                div.textContent = nextDate;
                div.classList.add("other-month");

                div.addEventListener("click", () => {
                    container.querySelectorAll(".day")
                        .forEach(el => el.classList.remove("selected"));

                    div.classList.add("selected");

                    const targetMonth = month + 1;
                    const targetYear = targetMonth > 11 ? year + 1 : year;
                    const realMonth = targetMonth % 12;

                    updateDetail(targetYear, realMonth, nextDate);
                    updateHeader(targetYear, realMonth);
                });

            // ===== 今月 =====
            } else {

                div.textContent = dateNum;

                if (
                    dateNum === today.getDate() &&
                    year === today.getFullYear() &&
                    month === today.getMonth()
                ) {
                    div.classList.add("today");
                    updateDetail(year, month, dateNum);
                    updateHeader(year, month);
                }

                div.addEventListener("click", () => {
                    container.querySelectorAll(".day")
                        .forEach(el => el.classList.remove("selected"));

                    div.classList.add("selected");
                    updateDetail(year, month, dateNum);
                    updateHeader(year, month);
                });
            }

            cal.appendChild(div);
        }

        container.appendChild(cal);
        scrollContainer.appendChild(container);
    }

    for (let y = START_YEAR; y <= END_YEAR; y++) {
        for (let m = 0; m < 12; m++) {
            renderCalendar(y, m);
        }
    }

    const initialIndex = (today.getFullYear() - START_YEAR) * 12 + today.getMonth();
   
    const containerWidth = scrollContainer.clientWidth;

    scrollContainer.scrollTo({
        left: containerWidth * initialIndex
    });

    if (goTodayBtn) {
        goTodayBtn.addEventListener("click", () => {
            const index =
                (today.getFullYear() - START_YEAR) * 12 + today.getMonth();
            const containerWidth = scrollContainer.clientWidth;

             scrollContainer.scrollTo({
                 left: containerWidth * index,
                 behavior: "smooth"
             });

            updateHeader(today.getFullYear(), today.getMonth());
        });
    }

    if (openPickerBtn) {
        openPickerBtn.addEventListener("click", () => {
            picker.focus();
        });
    }

    picker.addEventListener("input", () => {
        const [y, m] = picker.value.split("-");
        const target = document.querySelector(
            `.calendar-container[data-year="${y}"][data-month="${Number(m)}"]`
        );

        if (target) {
            target.scrollIntoView({ behavior: "smooth", inline: "start" });
        }
        updateHeader(Number(y), Number(m) - 1);
    });

    scrollContainer.addEventListener("scroll", () => {
        const containerWidth = scrollContainer.clientWidth;
        const index = Math.round(scrollContainer.scrollLeft / containerWidth);
       
        const year = START_YEAR + Math.floor(index / 12);
        const month = index % 12;
       
        updateHeader(year, month);
    });

});