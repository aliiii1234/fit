document.addEventListener("DOMContentLoaded", function() {
  $('#sessionDate').persianDatepicker({
    format: 'YYYY/MM/DD',
    initialValue: false,
  });
  loadSessionDataFromLocalStorage(); // بارگذاری داده‌ها از Local Storage هنگام لود شدن صفحه
});

// آبجکت برای ذخیره داده‌های هر فرد و جلسات مربوط به آن
const sessionData = {};

// تابع ذخیره برنامه
function saveProgram() {
  const selectedName = document.getElementById('nameDropdown').value;
  if (!selectedName) {
    alert('لطفاً یک نام انتخاب کنید.');
    return;
  }

  const studentName = document.getElementById('studentName').value;
  const sessionDate = document.getElementById('sessionDate').value;
  const exercises = [];
  const rows = document.querySelectorAll("#exerciseTableBody tr");

  rows.forEach((row) => {
    const exercise = row.children[0].querySelector("input").value;
    const repet = row.children[1].querySelector("input").value;
    const weight = row.children[2].querySelector("input").value;
    const rest = row.children[3].querySelector("select").value;
    const overload = row.children[4].querySelector("select").value;

    if (exercise || repet || weight || rest || overload) {
      exercises.push({ exercise, repet, weight, rest , overload });
    }
  });

  if (!sessionData[selectedName]) {
    sessionData[selectedName] = [];
  }

  // حداکثر 1000 جلسه برای هر فرد
  if (sessionData[selectedName].length >= 1000) {
    alert('حداکثر 1000 جلسه برای این نام ذخیره شده است.');
    return;
  }

  sessionData[selectedName].push({ studentName, sessionDate, exercises });
  localStorage.setItem('sessionData', JSON.stringify(sessionData));
  alert(`برنامه برای "${selectedName}" ذخیره شد!`);
  loadSessionList();
}

// تابع بارگذاری لیست جلسات
function loadSessionList() {
  const selectedName = document.getElementById('nameDropdown').value;
  const sessionSelect = document.getElementById('sessionSelect');
  sessionSelect.innerHTML = ''; // خالی کردن کشو جلسات

  if (sessionData[selectedName]) {
    sessionData[selectedName].forEach((session, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `جلسه ${index + 1}: ${session.sessionDate}`;
      sessionSelect.appendChild(option);
    });
  }
}

// تابع بارگذاری جلسه خاص
function loadSpecificSession() {
  const selectedName = document.getElementById('nameDropdown').value;
  const sessionIndex = document.getElementById('sessionSelect').value;

  if (sessionIndex !== '') {
    const data = sessionData[selectedName][sessionIndex];
    document.getElementById('studentName').value = data.studentName || '';
    document.getElementById('sessionDate').value = data.sessionDate || '';

    const tableBody = document.getElementById("exerciseTableBody");
    tableBody.innerHTML = '';

    data.exercises.forEach((exercise) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td><input type="text" value="${exercise.exercise}"></td>
        <td><input type="text" value="${exercise.repet}" class="small-input"oninput="autoResize(this)"></td>
        <td><input type="text" value="${exercise.weight}" class="weight-input"oninput="autoResize(this)"></td>
          <td>
          <select class="rest-input" oninput="autoResize(this)">
            <option value="30-60" ${exercise.rest === '30-60' ? 'selected' : ''}>30 تا 60 ثانیه</option>
            <option value="60-90" ${exercise.rest === '60-90' ? 'selected' : ''}>60 تا 90 ثانیه</option>
          </select>
        </td>
        <td>
          <select class="overload-input" oninput="autoResize(this)">
            <option value="1" ${exercise.overload === '1' ? 'selected' : ''}>1</option>
            <option value="2.5" ${exercise.overload === '2.5' ? 'selected' : ''}>2/5</option>
            <option value="5" ${exercise.overload === '5' ? 'selected' : ''}>5</option>
            <option value="7.5" ${exercise.overload === '7.5' ? 'selected' : ''}>7/5</option>
            <option value="10" ${exercise.overload === '10' ? 'selected' : ''}>10</option>
            <option value="12.5" ${exercise.overload === '12.5' ? 'selected' : ''}>12/5</option>
            <option value="15" ${exercise.overload === '15' ? 'selected' : ''}>15</option>
            <option value="-" ${exercise.overload === '-' ? 'selected' : ''}>-</option>
            <option value="17.5" ${exercise.overload === '17.5' ? 'selected' : ''}>17/5</option>
            <option value="20" ${exercise.overload === '20' ? 'selected' : ''}>20</option>
            <option value="25" ${exercise.overload === '25' ? 'selected' : ''}>25</option>
            <option value="30" ${exercise.overload === '30' ? 'selected' : ''}>30</option>
          </select>
        </td>
        <td><button type="button" id="deleteButton"onclick="removeRow(this)"></button></td>
      `;
      tableBody.appendChild(newRow);
    });

    alert(`برنامه "${selectedName}" بارگذاری شد.`);
  }
}

function editSession() {
  const selectedName = document.getElementById('nameDropdown').value;
  const sessionIndex = document.getElementById('sessionSelect').value;

  if (selectedName && sessionIndex !== '') {
    const studentName = document.getElementById('studentName').value;
    const sessionDate = document.getElementById('sessionDate').value;
    const exercises = [];
    const rows = document.querySelectorAll("#exerciseTableBody tr");

    rows.forEach((row) => {
      const exercise = row.children[0].querySelector("input").value;
      const repet = row.children[1].querySelector("input").value;
      const weight = row.children[2].querySelector("input").value;
      const rest = row.children[3].querySelector("select").value;
      const overload = row.children[4].querySelector("select").value;

    if (exercise || repet || weight || rest || overload) {
      exercises.push({ exercise, repet, weight, rest , overload });
      }
    });

    // به‌روزرسانی جلسه با اطلاعات جدید
    sessionData[selectedName][sessionIndex] = {
      studentName,
      sessionDate,
      exercises
    };

    // ذخیره‌سازی در Local Storage
    localStorage.setItem('sessionData', JSON.stringify(sessionData));
    alert(`جلسه ${parseInt(sessionIndex) + 1} ویرایش شد.`);
    loadSessionList(); // بروزرسانی لیست جلسات
  } else {
    alert("لطفاً یک جلسه انتخاب کنید.");
  }
}

function removeSession() {
  const selectedName = document.getElementById('nameDropdown').value;
  const sessionIndex = document.getElementById('sessionSelect').value;

  if (selectedName && sessionIndex !== '') {
    sessionData[selectedName].splice(sessionIndex, 1); // حذف جلسه
    localStorage.setItem('sessionData', JSON.stringify(sessionData));
    loadSessionList(); // بروزرسانی فهرست جلسات
    alert(`جلسه ${parseInt(sessionIndex) + 1} حذف شد.`);
  } else {
    alert("لطفاً یک جلسه انتخاب کنید.");
  }
}

// بارگذاری داده‌ها از Local Storage هنگام لود شدن صفحه
window.onload = function() {
  const storedData = localStorage.getItem('sessionData');
  if (storedData) {
    Object.assign(sessionData, JSON.parse(storedData));
  }
  loadNames(); // بارگذاری نام‌ها
  loadSessionList(); // بارگذاری لیست جلسات
  loadExercises(); // بارگذاری لیست حرکات
  // اضافه کردن event listener برای کشو نام
  document.getElementById('nameDropdown').addEventListener('change', function() {
    const selectedName = this.value;
    loadNameData(selectedName); // بارگذاری اطلاعات مربوط به نام انتخاب شده
    loadSessionData(); // بارگذاری جلسات مربوط به نام انتخاب شده
  });

  // بارگذاری اطلاعات برای اولین نام (اگر وجود داشته باشد)
  const firstName = Object.keys(sessionData)[0];
  if (firstName) {
    document.getElementById('nameDropdown').value = firstName;
    loadNameData(firstName);
    loadSessionData();
  }
};

// تابع بارگذاری اطلاعات برای نام خاص
function loadNameData(selectedName) {
  const data = sessionData[selectedName];

  if (data) {
    document.getElementById('studentName').value = data.studentName || '';
    document.getElementById('sessionDate').value = data.sessionDate || '';

    const tableBody = document.getElementById("exerciseTableBody");
    tableBody.innerHTML = ''; // خالی کردن جدول

    data.exercises.forEach((exercise) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td><input type="text" value="${exercise.exercise}"></td>
        <td><input type="text" value="${exercise.repet}" class="small-input"oninput="autoResize(this)"></td>
        <td><input type="text" value="${exercise.weight}" class="weight-input"oninput="autoResize(this)"></td>
        <td>
      <select class="rest-input">
        <option value="30-60">30 تا 60 ثانیه</option>
        <option value="60-90">60 تا 90 ثانیه</option>
      </select>
    </td>
    <td>
      <select class="overload-input">
        <option value="1">1</option>
        <option value="2.5">2/5</option>
        <option value="5">5</option>
        <option value="7.5">7/5</option>
        <option value="10">10</option>
        <option value="12.5">12/5</option>
        <option value="15">15</option>
        <option value="-">-</option>
        <option value="17.5">17/5</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="30">30</option>
      </select>
    </td>
        <td><button type="button" id="deleteButton"onclick="removeRow(this)"></button></td>
      `;
      tableBody.appendChild(newRow);
    });

    alert(`اطلاعات ${selectedName} بارگذاری شد.`);
  } else {
    alert("هیچ اطلاعاتی برای این نام ذخیره نشده است.");
  }
}

// تابع بارگذاری جلسه‌ها برای نام انتخاب شده
function loadSessionData() {
  const selectedName = document.getElementById('nameDropdown').value;
  const sessionSelect = document.getElementById('sessionSelect');
  sessionSelect.innerHTML = ''; // خالی کردن کشو انتخاب جلسه

  if (sessionData[selectedName]) {
    sessionData[selectedName].forEach((session, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `جلسه ${index + 1}: ${session.sessionDate}`;
      sessionSelect.appendChild(option);
    });
  } else {
    alert("هیچ جلسه‌ای برای این نام موجود نیست.");
  }
}

function loadNames() {
  const nameDropdown = document.getElementById('nameDropdown');
  nameDropdown.innerHTML = ''; // خالی کردن کشو قبل از بارگذاری

  // بارگذاری نام‌ها از sessionData
  for (const name in sessionData) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    nameDropdown.appendChild(option);
  }
}

function loadProgram() {
  const selectedName = document.getElementById('nameDropdown').value;
  if (!selectedName) {
    alert('لطفاً یک نام انتخاب کنید.');
    return;
  }

  const data = sessionData[selectedName];

  if (data) {
    document.getElementById('studentName').value = data.studentName || '';
    document.getElementById('sessionDate').value = data.sessionDate || '';

    const tableBody = document.getElementById("exerciseTableBody");
    tableBody.innerHTML = ''; // خالی کردن جدول

    data.exercises.forEach((exercise) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td><input type="text" value="${exercise.exercise}"></td>
        <td><input type="text" value="${exercise.repet}" class="small-input"oninput="autoResize(this)"></td>
        <td><input type="text" value="${exercise.weight}" class="weight-input"oninput="autoResize(this)"></td>
        <td>
          <select class="rest-input" oninput="autoResize(this)">
            <option value="30-60" ${exercise.rest === '30-60' ? 'selected' : ''}>30 تا 60 ثانیه</option>
            <option value="60-90" ${exercise.rest === '60-90' ? 'selected' : ''}>60 تا 90 ثانیه</option>
          </select>
        </td>
        <td>
          <select class="overload-input" oninput="autoResize(this)">
            <option value="1" ${exercise.overload === '1' ? 'selected' : ''}>1</option>
            <option value="2.5" ${exercise.overload === '2/5' ? 'selected' : ''}>2.5</option>
            <option value="5" ${exercise.overload === '5' ? 'selected' : ''}>5</option>
            <option value="7.5" ${exercise.overload === '7/5' ? 'selected' : ''}>7.5</option>
            <option value="10" ${exercise.overload === '10' ? 'selected' : ''}>10</option>
            <option value="12.5" ${exercise.overload === '12/5' ? 'selected' : ''}>12.5</option>
            <option value="15" ${exercise.overload === '15' ? 'selected' : ''}>15</option>
             <option value="-" ${exercise.overload === '-' ? 'selected' : ''}>15</option>
              <option value="17.5" ${exercise.overload === '17/5' ? 'selected' : ''}>15</option>
            <option value="20" ${exercise.overload === '20' ? 'selected' : ''}>20</option>
            <option value="25" ${exercise.overload === '25' ? 'selected' : ''}>25</option>
            <option value="30" ${exercise.overload === '30' ? 'selected' : ''}>30</option>
          </select>
        </td>
        <td><button type="button" id="deleteButton"onclick="removeRow(this)"></button></td>
      `;
      tableBody.appendChild(newRow);
    });

    alert(`برنامه "${selectedName}" بارگذاری شد.`);
  } else {
    alert("هیچ اطلاعاتی برای این نام ذخیره نشده است.");
  }
}

function autoResize(input) {
  // تنظیم عرض ورودی به اندازه طول متن
  input.style.width = '50px'; // ابتدا عرض را به خودکار تنظیم کن
  input.style.width = (input.scrollWidth) + 'px'; // سپس عرض را به اندازه محتوای واقعی تنظیم کن
}

function deleteExercise() {
  const exerciseName = document.getElementById('exerciseName').value;
  const exerciseLabel = document.getElementById('exerciseLabel').value;
  const exerciseDropdown = document.getElementById('exerciseDropdown');

  // اگر فقط label پر باشد، حذف کنیم
  if (exerciseLabel) {
    for (let i = 0; i < exerciseDropdown.options.length; i++) {
      if (exerciseDropdown.options[i].text === exerciseLabel) { // مقایسه بر اساس متن
        exerciseDropdown.remove(i); // حذف گزینه
        break;
      }
    }
    // پاک کردن ورودی label بعد از حذف
    document.getElementById('exerciseLabel').value = '';
  }

  // اگر نام حرکت پر باشد، حذف کنیم
  if (exerciseName) {
    for (let i = 0; i < exerciseDropdown.options.length; i++) {
      if (exerciseDropdown.options[i].value === exerciseName) { // مقایسه بر اساس value
        exerciseDropdown.remove(i); // حذف گزینه
        break;
      }
    }
    // پاک کردن ورودی‌ها بعد از حذف
    document.getElementById('exerciseName').value = '';
  }
}

function addRow() {
  const tableBody = document.getElementById("exerciseTableBody");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td><input type="text" placeholder="حرکت"></td>
    <td><input type="text" placeholder="تکرار" class="small-input"oninput="autoResize(this)"></td>
    <td><input type="text" placeholder="وزنه" class="weight-input"oninput="autoResize(this)"></td>
    <td><select class="rest-input">
        <option value="30-60">30 تا 60 ثانیه</option>
        <option value="60-90">60 تا 90 ثانیه</option>
      </select>
    </td>
    <td>
      <select class="overload-input">
        <option value="1">1</option>
        <option value="2.5">2/5</option>
        <option value="5">5</option>
        <option value="7.5">7/5</option>
        <option value="10">10</option>
        <option value="12.5">12/5</option>
        <option value="15">15</option>
        <option value="-">-</option>
        <option value="17.5">17/5</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="30">30</option>
      </select></td>
    <td><button type="button" id="deleteButton"onclick="removeRow(this)"></button></td>
  `;
  tableBody.appendChild(newRow);
  
  // تنظیم عرض ورودی‌ها برای ردیف جدید
  const repetInput = newRow.querySelector('.small-input');
  const weightInput = newRow.querySelector('.weight-input');
  const restInput = newRow.querySelector('.rest-input');
   const overloadInput = newRow.querySelector('.overload-input');

  autoResize(repetInput); // تنظیم عرض ورودی تکرار
  autoResize(weightInput); // تنظیم عرض ورودی وزنه
  autoResize(restInput); // تنظیم عرض ورودی استراحت
  autoResize(overloadInput); // تنظیم عرض ورودی اضافه بار
}

function removeRow(button) {
  const row = button.parentNode.parentNode; // به ردیف والد دسترسی پیدا کن
  row.parentNode.removeChild(row); // ردیف را حذف کن
}

function saveExerciseData() {
  const sessionSelect = document.getElementById('sessionSelect').value;
  const studentName = document.getElementById('studentName').value;
  const sessionDate = document.getElementById('sessionDate').value;
  const exercises = [];
  const rows = document.querySelectorAll("#exerciseTableBody tr");

  rows.forEach((row) => {
    const exercise = row.children[0].querySelector("input").value;
    const repet = row.children[1].querySelector("input").value;
    const weight = row.children[2].querySelector("input").value;
    const rest = row.children[3].querySelector("select").value;
const overload = row.children[4].querySelector("select").value;

    if (exercise || repet || weight || rest || overload) {
      exercises.push({ exercise, repet, weight, rest , overload });

    }
  });

  sessionData[sessionSelect] = {
    studentName,
    sessionDate,
    exercises,
    namesList: [...namesList] // ذخیره نام‌ها
  };

  // ذخیره داده‌ها در Local Storage
  localStorage.setItem('sessionData', JSON.stringify(sessionData));
  alert("برنامه تمرینی برای " + sessionSelect + " ذخیره شد!");
}

function loadNameData(selectedName) {
  const data = sessionData[selectedName];

  if (data) {
    document.getElementById('studentName').value = data.studentName || '';
    document.getElementById('sessionDate').value = data.sessionDate || '';

    const tableBody = document.getElementById("exerciseTableBody");
    tableBody.innerHTML = ''; // خالی کردن جدول

    data.exercises.forEach((exercise) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td><input type="text" value="${exercise.exercise}"></td>
        <td><input type="text" value="${exercise.repet}" class="small-input"oninput="autoResize(this)"></td>
        <td><input type="text" value="${exercise.weight}" class="weight-input"oninput="autoResize(this)"></td>
        <td>
          <select class="rest-input" oninput="autoResize(this)">
            <option value="30-60" ${exercise.rest === '30-60' ? 'selected' : ''}>30 تا 60 ثانیه</option>
            <option value="60-90" ${exercise.rest === '60-90' ? 'selected' : ''}>60 تا 90 ثانیه</option>
          </select>
        </td>
        <td>
          <select class="overload-input" oninput="autoResize(this)">
            <option value="1" ${exercise.overload === '1' ? 'selected' : ''}>1</option>
            <option value="2.5" ${exercise.overload === '2/5' ? 'selected' : ''}>2.5</option>
            <option value="5" ${exercise.overload === '5' ? 'selected' : ''}>5</option>
            <option value="7.5" ${exercise.overload === '7/5' ? 'selected' : ''}>7.5</option>
            <option value="10" ${exercise.overload === '10' ? 'selected' : ''}>10</option>
            <option value="12.5" ${exercise.overload === '12/5' ? 'selected' : ''}>12.5</option>
            <option value="15" ${exercise.overload === '15' ? 'selected' : ''}>15</option>
             <option value="-" ${exercise.overload === '-' ? 'selected' : ''}>15</option>
              <option value="17.5" ${exercise.overload === '17/5' ? 'selected' : ''}>15</option>
            <option value="20" ${exercise.overload === '20' ? 'selected' : ''}>20</option>
            <option value="25" ${exercise.overload === '25' ? 'selected' : ''}>25</option>
            <option value="30" ${exercise.overload === '30' ? 'selected' : ''}>30</option>
          </select>
        </td>
        <td><button type="button" id="deleteButton"onclick="removeRow(this)"></button></td>
      `;
      tableBody.appendChild(newRow);
    });

    alert(`اطلاعات ${selectedName} بارگذاری شد.`);
  } else {
    alert("هیچ اطلاعاتی برای این نام ذخیره نشده است.");
  }
}
function deleteSelectedName() {
  const nameDropdown = document.getElementById('nameDropdown');
  const selectedName = nameDropdown.value;

  if (!selectedName) {
    alert('لطفاً یک نام انتخاب کنید.');
    return;
  }

  if (confirm(`آیا مطمئن هستید که می‌خواهید "${selectedName}" را حذف کنید؟`)) {
    // حذف نام از sessionData
    delete sessionData[selectedName];

    // حذف نام از namesList
    const index = namesList.indexOf(selectedName);
    if (index > -1) {
      namesList.splice(index, 1);
    }

    // بروزرسانی کشو نام‌ها
    loadNames();

    // بارگذاری داده‌های جلسه‌ها
    loadSessionData();

    alert(`نام "${selectedName}" با موفقیت حذف شد.`);
  }
}

function saveAllData() {
  const allData = {
    sessionData: {},
    namesList: namesList,
  };

  for (const name of namesList) {
    if (sessionData[name]) {
      allData.sessionData[name] = sessionData[name];
    }
  }

  localStorage.setItem('programData', JSON.stringify(allData));
  alert("تمام داده‌ها با موفقیت ذخیره شد!");
}

function loadAllData() {
  const savedData = localStorage.getItem('programData');

  if (savedData) {
    const allData = JSON.parse(savedData);
    namesList = allData.namesList || [];
    Object.assign(sessionData, allData.sessionData);

    loadNames(); // بارگذاری نام‌ها
    loadSessionData(); // بارگذاری جلسات برای اولین نام
    alert("داده‌ها با موفقیت بارگذاری شدند!");
  } else {
    alert("هیچ داده‌ای برای بارگذاری وجود ندارد.");
  }
}

// تابع بارگذاری داده‌ها برای نام خاص
function loadNameData(name, data) {
  document.getElementById('studentName').value = data.studentName || '';
  document.getElementById('sessionDate').value = data.sessionDate || '';

  const tableBody = document.getElementById("exerciseTableBody");
  tableBody.innerHTML = ''; // خالی کردن جدول

  data.exercises.forEach((exercise) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td><input type="text" value="${exercise.exercise}"></td>
      <td><input type="text" value="${exercise.repet}" class="small-input"oninput="autoResize(this)"></td>
      <td><input type="text" value="${exercise.weight}" class="weight-input"oninput="autoResize(this)"></td>
      <td>
          <select class="rest-input" oninput="autoResize(this)">
            <option value="30-60" ${exercise.rest === '30-60' ? 'selected' : ''}>30 تا 60 ثانیه</option>
            <option value="60-90" ${exercise.rest === '60-90' ? 'selected' : ''}>60 تا 90 ثانیه</option>
          </select>
        </td>
        <td>
          <select class="overload-input" oninput="autoResize(this)">
            <option value="1" ${exercise.overload === '1' ? 'selected' : ''}>1</option>
            <option value="2.5" ${exercise.overload === '2/5' ? 'selected' : ''}>2.5</option>
            <option value="5" ${exercise.overload === '5' ? 'selected' : ''}>5</option>
            <option value="7.5" ${exercise.overload === '7/5' ? 'selected' : ''}>7.5</option>
            <option value="10" ${exercise.overload === '10' ? 'selected' : ''}>10</option>
            <option value="12.5" ${exercise.overload === '12/5' ? 'selected' : ''}>12.5</option>
            <option value="15" ${exercise.overload === '15' ? 'selected' : ''}>15</option>
             <option value="-" ${exercise.overload === '-' ? 'selected' : ''}>15</option>
              <option value="17.5" ${exercise.overload === '17/5' ? 'selected' : ''}>15</option>
            <option value="20" ${exercise.overload === '20' ? 'selected' : ''}>20</option>
            <option value="25" ${exercise.overload === '25' ? 'selected' : ''}>25</option>
            <option value="30" ${exercise.overload === '30' ? 'selected' : ''}>30</option>
          </select>
        </td>
      <td><button type="button" id="deleteButton"onclick="removeRow(this)"></button></td>
    `;
    tableBody.appendChild(newRow);
  });
}

// تابع دانلود PDF
function downloadPDF() {
  const element = document.getElementById('student-program');
  
  // دریافت نام انتخابی از کشو یا فیلد ورودی
  const nameDropdown = document.getElementById('nameDropdown').value;
  
  // دریافت مقدار sessionSelect و اضافه کردن 1 به آن
  let sessionSelect = document.getElementById('sessionSelect').value;
  sessionSelect = parseInt(sessionSelect) + 1;  // تبدیل به عدد و اضافه کردن 1

  // ساخت نام فایل ترکیبی از نام و جلسه
  const filename = `${nameDropdown}_جلسه${sessionSelect}.pdf`;

  // تنظیمات PDF
  const options = {
    margin: 0, // حذف حاشیه
    filename, // استفاده از نام ترکیبی برای فایل PDF
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
  };

  // دانلود PDF
  html2pdf().from(element).set(options).save();
}

const exercisesList = JSON.parse(localStorage.getItem('exercisesList')) || [];

document.getElementById('addExerciseButton').addEventListener('click', function() {
    const exerciseName = document.getElementById('exerciseName').value.trim();
    const exerciseLabel = document.getElementById('exerciseLabel').value.trim();
    const exerciseDropdown = document.getElementById('exerciseDropdown');

    if (exerciseName && exerciseLabel) {
        // بررسی وجود گزینه با همین نام در گروه
        let optGroup = [...exerciseDropdown.childNodes].find(optGroup => optGroup.label === exerciseLabel);
        let optionExists = false;

        if (optGroup) {
            optionExists = [...optGroup.childNodes].some(option => option.value === exerciseName);
        }

        if (!optionExists) {
            // ایجاد گزینه جدید
            const newOption = document.createElement('option');
            newOption.value = exerciseName;
            newOption.textContent = exerciseName;

            // اگر گروه وجود ندارد، ایجاد یک گروه جدید
            if (!optGroup) {
                optGroup = document.createElement('optgroup');
                optGroup.label = exerciseLabel;
                exerciseDropdown.appendChild(optGroup);
            }

            // اضافه کردن گزینه جدید به گروه
            optGroup.appendChild(newOption);

            // ذخیره نام و لیبل در آرایه و Local Storage
            exercisesList.push({ name: exerciseName, label: exerciseLabel });
            localStorage.setItem('exercisesList', JSON.stringify(exercisesList));

            // پاک کردن ورودی‌ها
            document.getElementById('exerciseName').value = '';
            document.getElementById('exerciseLabel').value = '';
        } 
      else {
            alert('این حرکت قبلاً به این لیبل اضافه شده است.');
        }
    } else {
        alert('لطفاً نام حرکت و لیبل را وارد کنید.');
    }
});

function searchExercise() {
  var input, filter, select, options, option, i;
  input = document.getElementById("exerciseSearch");
  filter = input.value.toUpperCase();  // جستجو به صورت حروف بزرگ انجام می‌شود
  select = document.getElementById("exerciseDropdown");
  options = select.getElementsByTagName("option");

  // حلقه برای بررسی هر گزینه در کشو
  for (i = 0; i < options.length; i++) {
    option = options[i];
    if (option.value.toUpperCase().indexOf(filter) > -1) {
      option.style.display = "";  // نشان دادن گزینه
    } else {
      option.style.display = "none";  // پنهان کردن گزینه
    }
  }
}

function loadExercises() {
    const exercisesList = JSON.parse(localStorage.getItem('exercisesList')) || [];
    const exerciseDropdown = document.getElementById('exerciseDropdown');

    exercisesList.forEach(exercise => {
        let optGroup = [...exerciseDropdown.childNodes].find(optGroup => optGroup.label === exercise.label);
        
        if (!optGroup) {
            optGroup = document.createElement('optgroup');
            optGroup.label = exercise.label;
            exerciseDropdown.appendChild(optGroup);
        }

        const newOption = document.createElement('option');
        newOption.value = exercise.name;
        newOption.textContent = exercise.name;
        optGroup.appendChild(newOption);
    });
}

function addExercise() {
  const dropdown = document.getElementById('exerciseDropdown');
  const selectedValue = dropdown.value;

  if (selectedValue) {
    const tableBody = document.getElementById("exerciseTableBody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td><input type="text" value="${selectedValue}" ></td>
      <td><input type="text" placeholder="تکرار" class="small-input"oninput="autoResize(this)"></td>
      <td><input type="text" placeholder="وزنه" class="weight-input"oninput="autoResize(this)"></td>
        <td>
      <select class="rest-input">
        <option value="30-60">30 تا 60 ثانیه</option>
        <option value="60-90">60 تا 90 ثانیه</option>
      </select>
    </td>
    <td>
      <select class="overload-input">
        <option value="1">1</option>
        <option value="2.5">2/5</option>
        <option value="5">5</option>
        <option value="7.5">7/5</option>
        <option value="10">10</option>
        <option value="12.5">12/5</option>
        <option value="15">15</option>
        <option value="-">-</option>
        <option value="17.5">17/5</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="30">30</option>
      </select>
    </td>
      <td><button type="button" id="deleteButton"onclick="removeRow(this)"></button></td>
    `;

    tableBody.appendChild(newRow);
    dropdown.value = ""; // خالی کردن کشو بعد از اضافه کردن
    
      // تنظیم عرض ورودی‌ها برای ردیف جدید
    const repetInput = newRow.querySelector('.small-input');
    const weightInput = newRow.querySelector('.weight-input');
    const restInput = newRow.querySelector('.rest-input');
    const overloadInput = newRow.querySelector('.overload-input');

    autoResize(repetInput); // تنظیم عرض ورودی تکرار
    autoResize(weightInput); // تنظیم عرض ورودی وزنه
    autoResize(restInput); // تنظیم عرض ورودی استراحت
     autoResize(overloadInput); // تنظیم عرض ورودی اضافه بار
  } else {
    alert('لطفا یک حرکت انتخاب کنید.');
  }
}

const namesList = []; // برای ذخیره لیست نام‌ها

function addName(event) {
    event.preventDefault(); // جلوگیری از ارسال فرم
    const nameInput = document.getElementById('addName');
    const nameValue = nameInput.value.trim();

    if (!nameValue) {
        alert('لطفاً نامی وارد کنید.'); // بررسی خالی بودن ورودی
        return;
    }

    if (namesList.includes(nameValue)) {
        alert('این نام قبلاً افزوده شده است.'); // بررسی وجود نام
        return;
    }

    namesList.push(nameValue);
    const dropdown = document.getElementById('nameDropdown');

    const newOption = document.createElement('option');
    newOption.value = nameValue;
    newOption.textContent = nameValue;

    dropdown.appendChild(newOption); // اضافه کردن نام به کشو
    alert(`نام "${nameValue}" با موفقیت افزوده شد!`);
    nameInput.value = ''; // خالی کردن ورودی بعد از افزودن
}
document.getElementById('nameDropdown').addEventListener('change', loadSessionData);
function loadSessionData() {
  const selectedName = document.getElementById('nameDropdown').value;
  const sessionSelect = document.getElementById('sessionSelect');
  sessionSelect.innerHTML = ''; // خالی کردن کشو انتخاب جلسه

  if (sessionData[selectedName]) {
    sessionData[selectedName].forEach((session, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `جلسه ${index + 1}: ${session.sessionDate}`;
      sessionSelect.appendChild(option);
    });
  } else {
    alert("هیچ جلسه‌ای برای این نام موجود نیست.");
  }
}

// تابع برای محاسبه حجم LocalStorage
        function getLocalStorageSize() {
            let total = 0;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                total += (key.length + value.length);  // اندازه کلید و مقدار
            }
            return total;  // حجم کل داده‌ها در بایت
        }

        // رویداد کلیک برای دکمه
        document.getElementById('showSizeButton').addEventListener('click', function() {
            const size = getLocalStorageSize(); // محاسبه حجم LocalStorage
            const resultDiv = document.getElementById('result'); // جایی برای نمایش حجم

            // نمایش حجم داده‌ها در بخش result
            resultDiv.textContent = `حجم داده‌های LocalStorage: ${size} بایت`;
        });

// تابع برای دانلود داده‌ها به عنوان فایل JSON
        function downloadLocalStorage() {
            const localStorageData = {};
            
            // داده‌های موجود در LocalStorage را جمع‌آوری می‌کنیم
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                localStorageData[key] = value;
            }

            // تبدیل داده‌ها به فرمت JSON
            const jsonData = JSON.stringify(localStorageData);
            
            // ایجاد یک فایل Blob
            const blob = new Blob([jsonData], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'localStorageBackup.json';  // نام فایل دانلودی
            link.click();  // شروع دانلود
        }

        // افزودن رویداد به دکمه
        document.getElementById('downloadBtn').addEventListener('click', downloadLocalStorage);

// تابع برای بارگذاری داده‌ها از فایل JSON و ذخیره در LocalStorage
        document.getElementById('loadDataButton').addEventListener('click', function() {
            const fileInput = document.getElementById('uploadButton');
            const file = fileInput.files[0];  // انتخاب فایل

            if (file && file.type === 'application/json') {
                const reader = new FileReader();
                
                // زمانی که فایل خوانده شد
                reader.onload = function(e) {
                    try {
                        const data = JSON.parse(e.target.result);  // تجزیه محتوای فایل JSON
                        
                        // داده‌ها را در LocalStorage ذخیره کنید
                        for (const key in data) {
                            if (data.hasOwnProperty(key)) {
                                localStorage.setItem(key, data[key]);
                            }
                        }

                        alert('داده‌ها با موفقیت بارگذاری و ذخیره شدند.');
                    } catch (error) {
                        alert('خطا در پردازش فایل. لطفاً فایل JSON معتبر وارد کنید.');
                    }
                };

                reader.readAsText(file);  // خواندن فایل به عنوان متن
            } else {
                alert('لطفاً یک فایل JSON معتبر انتخاب کنید.');
            }
        });