// Hàm lấy dữ liệu từ API
function fetchDataTaiKhoanCCOS() {
    const loadingScreen = document.getElementById('loading-screen');

    loadingScreen.style.display = 'block';
    fetch(localStorage.getItem("http_endpoint") + 'db/list_user_ccos?obccos_user_code=' + localStorage.getItem("user_code"), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(response_data => {
            console.log('API data:', response_data);
            if (response_data.error_code === "0") {
                const filteredData = response_data.data.map(item => ([
                    "", // Chỗ để số thứ tự sẽ được thêm ở đây
                    item.username_ccos,
                    item.password_ccos,
                    item.trang_thai === 1 ? "Hoạt động" : "Dừng hoạt động",
                    convertDateTime(item.ngay_tao),
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
        .catch(() => {
            loadingScreen.style.display = 'none';
        });
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
            { title: "Tài khoản" },
            { title: "Mật khẩu" },
            { title: "Trạng thái" },
            { title: "Ngày tạo" },
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
            const button1 = $('<button class="btn-primary" style="margin-right: 10px" onclick="showPopup(this)"></button>')
                .text('Sửa')

            const button2 = $('<button class="btn-primary" onclick="loginCCOS(this)"></button>')
                .text('Đăng nhập')
            $('td:eq(5)', row).append(button1).append(button2);

        }
    });
}

function submitFormXoa() {
    document.getElementById('loading-screen').style.display = "block";
    var tk_ccos = document.getElementById('txtEditUserCCOS').value;
    var mk_ccos = document.getElementById('txtEditPassCCOS').value;
    var trang_thai = document.getElementById("selectTrangThai").value

    // In ra console
    if (mk_ccos == null) {
        document.getElementById('loading-screen').style.display = "none";
        alert("Vui lòng nhập mật khẩu!");
    } else {
        // Thực hiện gọi API
        var settings = {
            url: localStorage.getItem("http_endpoint") + "db/edit_user_ccos",
            method: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                "obccos_user_code": localStorage.getItem("user_code"),
                "username_ccos": tk_ccos,
                "password_ccos": mk_ccos,
                "trang_thai": trang_thai
            }),
        };
    
        $.ajax(settings).done(function (response) {
            console.log(response);
            alert("Chỉnh sửa user CCOS thành công!");
            closePopupXoa();
            fetchDataTaiKhoanCCOS();
            document.getElementById('loading-screen').style.display = "none";
        }).fail(function (error) {
            document.getElementById('loading-screen').style.display = "none";
            console.error("Lỗi khi gọi API Add User CCOS:", error);
        });
    }
}

function submitFormThem() {
    document.getElementById('loading-screen').style.display = "block";
    // Lấy giá trị của hidden input
    var tk_ccos = document.getElementById('txtUserCCOS').value;
    var mk_ccos = document.getElementById('txtPassCCOS').value;
    // Lấy giá trị đã chọn từ dropdown

    // In ra console
    if (tk_ccos == null || mk_ccos == "") {
        document.getElementById('loading-screen').style.display = "none";
        alert("Vui lòng điền đầy đủ tài khoản và mật khẩu!");
    } else {
        // Thực hiện gọi API
        var settings = {
            url: localStorage.getItem("http_endpoint") + "db/add_user_ccos",
            method: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                "obccos_user_code": localStorage.getItem("user_code"),
                "username_ccos": tk_ccos,
                "password_ccos": mk_ccos
            }),
        };
    
        $.ajax(settings).done(function (response) {
            console.log(response);
            alert("Thêm user CCOS thành công!");
            closePopupThem();
            fetchDataTaiKhoanCCOS();
            document.getElementById('loading-screen').style.display = "none";
        }).fail(function (error) {
            document.getElementById('loading-screen').style.display = "none";
            console.error("Lỗi khi gọi API Add User CCOS:", error);
        });
    }
}

function submitFormOTP() {
    document.getElementById('loading-screen').style.display = "block";
    // Lấy giá trị của hidden input
    var otp = document.getElementById('txtOTP').value;
    var token = document.getElementById('szToken').value;
    // Lấy giá trị đã chọn từ dropdown

    // In ra console
    if (otp == "") {
        document.getElementById('loading-screen').style.display = "none";
        alert("OTP không được bỏ trống!");
    } else {
        // Thực hiện gọi API
        var settings = {
            url: localStorage.getItem("http_endpoint") + "ccos/enter_otp",
            method: "POST",
            timeout: 0,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                "otp": otp
            }),
        };
    
        $.ajax(settings).done(function (response) {
            const isSuccess = response.VerifySuccess;
            const mess = response.Messenger;
            if(isSuccess){
                closePopupOTP();
            }
            alert(mess);
            console.log(isSuccess);
            console.log(mess);
            document.getElementById('loading-screen').style.display = "none";
        }).fail(function (error) {
            document.getElementById('loading-screen').style.display = "none";
            console.error("Lỗi khi gọi API Enter OTP:", error);
        });
    }
}

function showPopup(button) {
    var row = button.closest('tr');
    var tk_ccos = row.cells[1].innerText;
    var mk_ccos = row.cells[2].innerText;
    var trang_thai = row.cells[3].innerText;

    document.getElementById("txtEditUserCCOS").value = tk_ccos;
    document.getElementById("txtEditPassCCOS").value = mk_ccos;
    document.getElementById("selectTrangThai").value = trang_thai === "Hoạt động" ? 1 : 0 ;

    document.getElementById("popup").style.display = "block";
}

function loginCCOS(button) {
    document.getElementById('loading-screen').style.display = "block";
    var row = button.closest('tr');
    var tk_ccos = row.cells[1].innerText;
    var mk_ccos = row.cells[2].innerText;
    var trang_thai = row.cells[3].innerText;

    if(trang_thai != "Hoạt động"){
        document.getElementById('loading-screen').style.display = "none";
        alert("User đã ngưng hoạt động, không thể login!");
    }
    else {
        // Thực hiện gọi API
        var settings = {
            url: localStorage.getItem("http_endpoint") + "ccos/login",
            method: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                "username": tk_ccos,
                "password": mk_ccos
            }),
        };
    
        $.ajax(settings).done(function (response) {
            const loginSuccess = response.LoginSuccess;
            const needOTP = response.NeedOTP;
            const token = response.token;
            const mess = response.Messenger;

            if(needOTP == true){
                showPopupOTP(token);
            }
            else {
                alert(mess);
            }
            
            console.log("Login Success:", loginSuccess);
            console.log("Need OTP:", needOTP);
            console.log("Token:", token);

            document.getElementById('loading-screen').style.display = "none";
        }).fail(function (error) {
            document.getElementById('loading-screen').style.display = "none";
            alert(error.Messenger)
        });
    }
}

function closePopupXoa() {
    document.getElementById("popup").style.display = "none";
}

function showPopupThem(button, url) {
    document.getElementById("popupThem").style.display = "block";
}

function showPopupOTP(token) {
    document.getElementById("popupOTP").style.display = "block";
    document.getElementById("txtOTP").value = "";
    document.getElementById("szToken").value = token;
}

function closePopupThem() {
    document.getElementById("popupThem").style.display = "none";
}

function closePopupOTP() {
    document.getElementById("popupOTP").style.display = "none";
}

fetchDataTaiKhoanCCOS();