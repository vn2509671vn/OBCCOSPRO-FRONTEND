// Hàm lấy dữ liệu từ API
function fetchDataHenGoiLaiBG() {
    var button = document.getElementById('search-btn');
    var loadingScreen = document.getElementById('loading-screen');

    if (!button) {
        console.error('Nút search-btn không tồn tại');
        return;
    }

    button.disabled = true; // Disable nút ngay lập tức
    loadingScreen.style.display = 'block';
    var startDate = document.getElementById('start-date').value;
    var endDate = document.getElementById('end-date').value;

    if (!startDate || !endDate) {
        alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
        loadingScreen.style.display = 'none';

        button.disabled = false; // Enable lại nút khi thiếu thông tin
    } else {
        fetch(localStorage.getItem("http_endpoint") + 'obccos/BaoCaoBG?fromN=' + formatDate(startDate) + '&toN=' + formatDate(endDate) + '&employeename=' + localStorage.getItem("user_name"), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "1"
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('API data:', data);
                if (data.errorCode === "1") {
                    var filteredData = data.data.map(item => ([
                        "", // Chỗ để số thứ tự sẽ được thêm ở đây
                        item.SMIS,
                        item.EMPLOYEENAME,
                        item.EMPLOYEEHRMCODE,
                        item.TENTAP,
                        item.OBDATE,
                        item.MAGOI,
                        item.CHUKY,
                        item.DOANHTHU,
                        item.NGAYMODICHVU
                    ]));
                    reloadTable(filteredData);
                    handleApiData(data);

                } else {
                    console.error('Error:');
                }
                button.disabled = false; // Enable lại nút sau khi hoàn tất
                loadingScreen.style.display = 'none';
            })
            .catch(error => {
                console.error('Lỗi:', error);
                loadingScreen.style.display = 'none';
                button.disabled = false; // Enable lại nút khi có lỗi
                if ($.fn.DataTable.isDataTable('#scroll-horizontal-datatable')) {
                    $('#scroll-horizontal-datatable').DataTable().clear().destroy();
                }
            });

    }
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
            { title: "Số TB" },
            { title: "ĐTV" },
            { title: "HRM" },
            { title: "Tên tập" },
            { title: "Thời gian thực hiện OB" },
            { title: "Gói cước ĐK" },
            { title: "Chu kỳ" },
            { title: "Doanh thu" },
            { title: "Ngày mở dịch vụ" }
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
                title: 'dulieu_excel',
                exportOptions: {
                    columns: ':visible' // Xuất tất cả cột hiện có
                },
                className: 'excel-button'
            }
        ], 
        createdRow: function (row, data, dataIndex) {
            // Thêm số thứ tự vào cột đầu tiên
            var table = this.api();
            var rowIndex = dataIndex + 1; // Thêm 1 để bắt đầu từ 1 thay vì 0
            $('td:eq(0)', row).html(rowIndex);
        }
    });
}

function handleApiData(responseData) {
    var dataArray = responseData.data || [];

    var countGiaHanDTV = dataArray.length;

    var totalDoanhThuDTV = dataArray
        .reduce((sum, item) => sum + parseInt(item.DOANHTHU || 0, 10), 0);

    document.getElementById('result-sl-gh-boi-dtv').textContent = countGiaHanDTV;
    document.getElementById('result-doanh-thu-gh-boi-dtv').textContent = totalDoanhThuDTV.toLocaleString() + ' VNĐ';

}

document.getElementById('start-date').valueAsDate = firstDayOfMonth;
document.getElementById('end-date').valueAsDate = yesterday;