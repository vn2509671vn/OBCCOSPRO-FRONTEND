// Hàm lấy dữ liệu từ API
function fetchDataOBTrong24h() {
    const loadingScreen = document.getElementById('loading-screen');

    loadingScreen.style.display = 'block';
    fetch(localStorage.getItem("http_endpoint") + 'obccos/getList24H?stb=&ktv=&page=0&size=10000', {
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
                    item.customerFeedBack,
                    item.obStateName,
                    convertDateTime(item.modifiedDate),
                    item.progId,
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
            { title: "ID" }, // Cột cho hành động
            { title: "Số TB" },
            { title: "Tên chương trình" },
            { title: "Khai thác viên" },
            { title: "Kết quả" },
            { title: "Trạng thái liên lạc" },
            { title: "Ngày OB" },
            { title: "Program ID" }, // Cột cho hành động
            { title: "Hành động" } // Cột cho hành động

        ],
        paging: true,
        searching: true,
        pageLength: 10, // Số dòng mỗi trang
        lengthChange: false,
        info: true,
        lengthChange: true, // Cho phép thay đổi số dòng mỗi trang
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Tất cả"]], // Các tùy chọn hiển thị số dòng mỗi trang
        info: true,
        dom: 'lBfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Xuất file Excel',
                title: 'Danh sách OB 24h',
                exportOptions: {
                    columns: ':visible' // Xuất tất cả cột hiện có
                },
                className: 'excel-button'
            }
        ],
        createdRow: function (row, data, dataIndex) {
            // Thêm số thứ tự vào cột đầu tiên
            const table = this.api();
            const rowIndex = dataIndex + 1; // Thêm 1 để bắt đầu từ 1 thay vì 0
            $('td:eq(0)', row).html(rowIndex);

            const smiNumber = data[1];

            const button1 = $('<button onclick=showPopup(this,"obccos/GetListUser")>')
                .text('Chuyển OB')
                .click(function () {
                    console.log('SMIS:', smiNumber);
                });

            // const button2 = $('<button class="custom-button"  onclick="showPopup(this,"obccos/GetListUser")>')
            //     .text('Sửa')
            //     .click(function () {
            //         console.log('Chỉnh sửa SMIS:', smiNumber);
            //     });

            // $('td:eq(7)', row).append(button1).append(button2);
            $('td:eq(9)', row).append(button1);

        }
    });
}

function submitForm() {
    // Lấy giá trị của hidden input
    const id = document.getElementById('hidden-id').value;
    const progID = document.getElementById('hidden-progID').value;

    // Lấy giá trị đã chọn từ dropdown

    const selectedValue = document.getElementById('dropdownList').value;

    // In ra console
    if (selectedValue == null || selectedValue == "") {
        alert("Bạn chưa chọn tên");
    } else {

        fetch(localStorage.getItem("http_endpoint") + 'obccos/ChuyenOB?progId=' + progID + '&id=' + id + '&ktv=' + selectedValue, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                if (!response.ok) {
                    alert('Chuyển OB thất bại');
                } else {
                    alert('Chuyển OB thành công');
                    fetchDataHenGoiLaiCKD();
                    closePopup();
                }
            })
            .catch(error => console.error('Lỗi:', error));


        console.log('Hidden input value:', id);
        console.log('Hidden input value:', progID);

        console.log('Selected dropdown value:', selectedValue);
    }
}



function showPopup(button, url) {
    // Gọi API khi bấm nút
    fetch(localStorage.getItem("http_endpoint") + url,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
            },
        }
    )
        .then(response => response.json())
        .then(result => {
            // Kiểm tra mã code trả về
            if (result.code === 200) {
                // Kiểm tra dữ liệu "data.data" thực sự là gì
                const dataList = result.data.data;
                console.log('Dữ liệu:', dataList); // Log dataList để xem nó có phải là mảng không

                if (Array.isArray(dataList)) {
                    const dropdown = document.getElementById('dropdownList');
                    dropdown.innerHTML = ''; // Xóa các option cũ

                    // Thêm option mặc định
                    let defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.text = '--Chọn một mục--';
                    dropdown.appendChild(defaultOption);
                    dataList.sort((a, b) => a.full_name.localeCompare(b.full_name));
                    // Duyệt qua mảng và thêm các option mới
                    dataList.forEach(item => {
                        let option = document.createElement('option');
                        option.value = item.user_code;
                        option.text = item.full_name;
                        dropdown.appendChild(option);
                    });
                } else {
                    console.error('Dữ liệu không phải là mảng, không thể lặp qua nó:', dataList);
                }
            } else {
                console.error('API trả về mã code không hợp lệ:', result.code);
            }
        })
        .catch(error => console.error('Có lỗi xảy ra:', error));


    var row = button.closest('tr');
    var id = row.cells[1].innerText;
    document.getElementById("hidden-id").value = id;

    document.getElementById("popup").style.display = "block";
}
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

fetchDataOBTrong24h();
