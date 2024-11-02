// Hàm lấy dữ liệu từ API
function fetchDataHenGoiLaiCKD() {
    const loadingScreen = document.getElementById('loading-screen');

    loadingScreen.style.display = 'block';
    fetch(localStorage.getItem("http_endpoint") + 'obccos/HenGoiLaiCKD?progId=6583a76346270935aa47ede9&states=4&page=0&size=10000', {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log('API data:', data);
            if (data.error_code === "1") {
                const filteredData = data.result.data.map(item => ([
                    "", // Chỗ để số thứ tự sẽ được thêm ở đây
                    item.id,
                    item.smis,
                    item.progName,
                    item.createdName,
                    convertDateTime(item.obDate),
                    ""
                ]));

                // Khởi tạo lại DataTable với dữ liệu từ API
                reloadTable(filteredData);
                loadingScreen.style.display = 'none';

            } else {
                console.error('Error:');
                loadingScreen.style.display = 'none';
            }
        })
        .catch(error => console.error('Lỗi:', error));
}

// Hàm tải lại bảng với dữ liệu mới
function reloadTable(data) {
    // Hủy bảng DataTable hiện tại nếu đã khởi tạo
    if ($.fn.DataTable.isDataTable('#scroll-horizontal-datatable')) {
        $('#scroll-horizontal-datatable').DataTable().clear().destroy();
    }

    // Khởi tạo lại DataTable với dữ liệu từ API
    $('#scroll-horizontal-datatable').DataTable({
        data: data, // Dữ liệu đã lọc
        columns: [
            { title: "STT" }, // Cột cho số thứ tự
            { title: "ID" },
            { title: "Số TB" },
            { title: "Tên chương trình" },
            { title: "Khai thác viên" },
            { title: "Ngày OB" },
            { title: "Hành động" }
        ],
        paging: true,
        searching: true,
        pageLength: 10, // Số dòng mỗi trang
        lengthChange: false,
        info: true,
        lengthChange: true, // Cho phép thay đổi số dòng mỗi trang
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Tất cả"]], // Các tùy chọn hiển thị số dòng mỗi trang
        info: true,
        createdRow: function (row, data, dataIndex) {
            // Thêm số thứ tự vào cột đầu tiên
            const table = this.api();
            const rowIndex = dataIndex + 1; // Thêm 1 để bắt đầu từ 1 thay vì 0
            $('td:eq(0)', row).html(rowIndex);
            const smiNumber = data[1];
            const button1 = $('<button class="custom-button-red" onclick="showPopup(this,\'obccos/GetListUser\')">Click Me</button>')

                .text('Xóa')
                .click(function () {
                    console.log('SMIS:', smiNumber);
                });

            // const button2 = $('<button class="custom-button" onclick="showPopup(this,\'obccos/GetListUser\')">Click Me</button>')

            //     .text('Sửa')
            //     .click(function () {
            //         console.log('Chỉnh sửa SMIS:', smiNumber);
            //     });


            // $('td:eq(6)', row).append(button1).append(button2);
            $('td:eq(6)', row).append(button1);

        }
    });
}

function submitFormXoa() {
    const id = document.getElementById('hidden-id').value;

    // In ra console
    if (id == null || id == "") {
        alert("Lỗi vui lòng chọn lại sdt");
    } else {
        console.log('Hidden input value:', id);
    }
}

function submitFormThem() {
    // Lấy giá trị của hidden input
    const ds_sdt = document.getElementById('ds-sdt').value;
    // Lấy giá trị đã chọn từ dropdown


    // In ra console
    if (ds_sdt == null || ds_sdt == "") {
        alert("Danh sách rỗng");
    } else {
        console.log('Hidden input value:', ds_sdt);
    }
}

function showPopup(button, url) {
    // Gọi API khi bấm nút


    var row = button.closest('tr');
    var id = row.cells[1].innerText;
    var sdt = row.cells[2].innerText;

    document.getElementById("hidden-id").value = id;
    document.getElementById("hidden-sdt").value = sdt;


    document.getElementById("popup").style.display = "block";
}
function closePopupXoa() {
    document.getElementById("popup").style.display = "none";
}






function showPopupThem(button, url) {
    document.getElementById("popupThem").style.display = "block";
}
function closePopupThem() {
    document.getElementById("popupThem").style.display = "none";
}
fetchDataHenGoiLaiCKD();