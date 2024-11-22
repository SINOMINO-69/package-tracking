document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("packageTable");

  // تحميل البيانات من Local Storage
  function loadPackages() {
    const storedPackages = JSON.parse(localStorage.getItem("packages")) || [];
    storedPackages.forEach(addPackageToTable);
  }

  // حفظ البيانات إلى Local Storage
  function savePackages() {
    const rows = Array.from(table.rows).map((row) => ({
      trackingNumber: row.cells[0].innerText,
      arrivalDate: row.cells[1].innerText,
      stayDuration: parseInt(row.cells[2].innerText),
      returnDate: row.cells[3].innerText,
      statusClass: row.cells[4].className,
      statusText: row.cells[4].innerText
    }));
    localStorage.setItem("packages", JSON.stringify(rows));
  }

  // إضافة طرد إلى الجدول
  function addPackageToTable({
    trackingNumber,
    arrivalDate,
    stayDuration,
    returnDate,
    statusClass,
    statusText
  }) {
    const row = table.insertRow();
    row.innerHTML = `
        <td>${trackingNumber}</td>
        <td>${arrivalDate}</td>
        <td>${stayDuration} يوم</td>
        <td>${returnDate}</td>
        <td class="${statusClass}">${statusText}</td>
        <td>
            <button class="action-btn edit-btn">تعديل</button>
            <button class="action-btn delete-btn">حذف</button>
        </td>
    `;
  }

  // حساب وتحديث الحالة
  function calculateStatus(arrivalDate, stayDuration) {
    const returnDate = new Date(arrivalDate);
    returnDate.setDate(returnDate.getDate() + stayDuration);

    const currentDate = new Date();
    const daysLeft = Math.ceil(
      (returnDate - currentDate) / (1000 * 60 * 60 * 24)
    );

    let statusClass = "";
    let statusText = "";
    if (daysLeft > 3) {
      statusClass = "status-green";
      statusText = `${daysLeft} يوم متبقي`;
    } else if (daysLeft <= 3 && daysLeft > 0) {
      statusClass = "status-yellow";
      statusText = `${daysLeft} يوم متبقي`;
    } else {
      statusClass = "status-red";
      statusText = "متأخر!";
    }

    return {
      returnDate: returnDate.toISOString().split("T")[0],
      statusClass,
      statusText
    };
  }

  // إضافة الطرود
  document.getElementById("addPackages").addEventListener("click", function () {
    const trackingNumbers = document
      .getElementById("trackingNumbers")
      .value.split("\n")
      .filter(Boolean);
    const arrivalDate = document.getElementById("arrivalDate").value;
    const stayDuration = parseInt(
      document.getElementById("stayDuration").value
    );

    if (!trackingNumbers.length || !arrivalDate || !stayDuration) {
      alert("الرجاء إدخال جميع البيانات!");
      return;
    }

    trackingNumbers.forEach((trackingNumber) => {
      const { returnDate, statusClass, statusText } = calculateStatus(
        arrivalDate,
        stayDuration
      );
      addPackageToTable({
        trackingNumber,
        arrivalDate,
        stayDuration,
        returnDate,
        statusClass,
        statusText
      });
    });

    savePackages();

    // Clear inputs
    document.getElementById("trackingNumbers").value = "";
    document.getElementById("arrivalDate").value = "";
    document.getElementById("stayDuration").value = "";
  });

  // تعديل أو حذف الطرود
  table.addEventListener("click", function (e) {
    const row = e.target.closest("tr");
    if (e.target.classList.contains("delete-btn")) {
      row.remove();
      savePackages();
    } else if (e.target.classList.contains("edit-btn")) {
      const trackingNumber = row.cells[0].innerText;
      const arrivalDate = row.cells[1].innerText;
      const stayDuration = parseInt(row.cells[2].innerText);

      document.getElementById("trackingNumbers").value = trackingNumber;
      document.getElementById("arrivalDate").value = arrivalDate;
      document.getElementById("stayDuration").value = stayDuration;

      row.remove();
      savePackages();
    }
  });

  // تحميل البيانات عند فتح الصفحة
  loadPackages();
});