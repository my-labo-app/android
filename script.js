document.addEventListener("DOMContentLoaded", () => {

    const scrollContainer = document.getElementById("calendar-scroll");
    const headerMonth = document.getElementById("header-month");
    const picker = document.getElementById("month-picker");
    const detailDate = document.getElementById("detailDate");
    const goTodayBtn = document.getElementById("go-today");
    const openPickerBtn = document.getElementById("open-picker");

    const today = new Date();
    const START_YEAR = 2025;
    const END_YEAR = 2040;

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    const rokuyo = ["大安","赤口","先勝","友引","先負","仏滅"];

    function updateHeader(year, month) {
    headerMonth.querySelector(".year").textContent = year;
    headerMonth.querySelector(".month").textContent = monthNames[month];
}

    function updateDetail(year, month, day) {
        const date = new Date(year, month, day);
        const weekDays = ["日","月","火","水","木","金","土"];
        const r = rokuyo[(year + month + day) % 6];
        detailDate.textContent =
            `${year}年${month + 1}月${day}日(${weekDays[date.getDay()]}) ${r}`;
    }

    function renderCalendar(year, month) {
        const container = document.createElement("div");
        container.className = "calendar-container";
        container.dataset.year = year;
        container.dataset.month = month + 1;

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

        const firstDay = new Date(year, month, 1).getDay();
        const startIndex = (firstDay + 6) % 7;
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();

        const totalCells = 42;

        for (let i = 0; i < totalCells; i++) {

            const div = document.createElement("div");
            div.className = "day";

            const dateNum = i - startIndex + 1;
           
            if (dateNum <= 0) {
               
                div.textContent = prevLastDate + dateNum;
                div.classList.add("other-month");
               
            } else if (dateNum > lastDate) {
               
                div.textContent = dateNum - lastDate;
                div.classList.add("other-month");
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
   
    scrollContainer.scrollTo({
        left: window.innerWidth * initialIndex
    });

    if (goTodayBtn) {
        goTodayBtn.addEventListener("click", () => {
            const index =
                (today.getFullYear() - START_YEAR) * 12 + today.getMonth();
            scrollContainer.scrollTo({
                left: window.innerWidth * index,
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
        const index = Math.round(scrollContainer.scrollLeft / window.innerWidth);
       
        const year = START_YEAR + Math.floor(index / 12);
        const month = index % 12;
       
        updateHeader(year, month);
    });

});