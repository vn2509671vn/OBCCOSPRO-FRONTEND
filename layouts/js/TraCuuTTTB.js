// Vô hiệu hóa hai checkbox ban đầu
document.getElementById("goi-den").disabled = true;
document.getElementById("goi-di").disabled = true;

// Hàm thực hiện khi tìm kiếm
function searchSubscriber() {
    document.getElementById('loading-screen').style.display = "block";
    var stb = document.getElementById("soTB").value;

    if (stb == "") {
        alert("Vui lòng nhập số điện thoại cần tra cứu!");
        document.getElementById('loading-screen').style.display = "none";
        return;
    }

    // Lấy giá trị từ ô input và thực hiện fetch
    fetch(
        localStorage.getItem("http_endpoint") + "obccos/getTTTT?stb=" +
        document.getElementById("ma-so-quoc-gia").value +
        stb,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
            },
        }
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            fetch(
                localStorage.getItem("http_endpoint") + "obccos/getTTCoban?stb=" +
                document.getElementById("ma-so-quoc-gia").value +
                stb,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    },
                }
            )
                .then((response) => response.json())
                .then((data1) => {
                    fetch(
                        localStorage.getItem("http_endpoint") + "obccos/getCosName?stb=" +
                        document.getElementById("ma-so-quoc-gia").value +
                        stb,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                                "Content-Type": "application/json",
                            },
                        }
                    )
                        .then((response) => response.json())
                        .then((data2) => {
                            // Cập nhật các trường thông tin
                            document.getElementById("ngay-kh").value = data1.DataSet.ACTIVE;

                            document.getElementById("goi-den").checked = (data1.DataSet.GOI_DEN === "A");
                            document.getElementById("goi-di").checked = (data1.DataSet.GOI_DI === "A");

                            document.getElementById("so-tk-chinh").value = data2.DataSet.SUBP_BEB_BALANCE_1;
                            document.getElementById("han-su-dung").value = data2.DataSet.SUBP_BEB_ACC_EXPIRATION_1;
                            document.getElementById("msin").value = data1.DataSet.SO_MSIN;
                            document.getElementById("ten-tb").value = data.DataSet.FULLNAME;
                            document.getElementById("loai-thue-bao").value = data1.DataSet.TEN_LOAI;

                            // Gọi API mới và cập nhật DataTable
                            fetchAutoCallData(stb);
                            fetchChuyenOBData(stb);
                        })
                        .catch((error) => console.error("Lỗi khi gọi API:", error));
                })
                .catch((error) => console.error("Lỗi khi gọi API:", error));
        })
        .catch((error) => console.error("Lỗi khi gọi API:", error));

        document.getElementById('loading-screen').style.display = "none";
}

// Hàm gọi API TraCuuAutoCall và cập nhật DataTable
function fetchAutoCallData(sdt) {
    var settings = {
        url: localStorage.getItem("http_endpoint") + "db/TraCuuAutoCall",
        method: "POST",
        timeout: 0,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ "sdt": sdt }),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);

        // Xóa các hàng cũ trong bảng trước khi thêm dữ liệu mới
        var table = $('#autoCallTable').DataTable();
        table.clear();

        // Thêm dữ liệu mới từ response vào DataTable
        response.data.forEach(function (item) {
            table.row.add([
                item.SoDienThoai,
                item.LoaiChuongTrinh,
                item.NguoiThucHien,
                item.NgayThucHien,
                item.TrangThaiOB
            ]).draw();
        });
    }).fail(function (error) {
        console.error(response.message);
    });
}

// Hàm gọi API LichSuOB và cập nhật DataTable
function fetchChuyenOBData(sdt) {
    var settings = {
        url: localStorage.getItem("http_endpoint") + "obccos/searchHisOb?smis=" + sdt,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response);

        // Xóa các hàng cũ trong bảng trước khi thêm dữ liệu mới
        var table = $('#hisOBTable').DataTable();
        table.clear();

        // Thêm dữ liệu mới từ response vào DataTable
        response.result.data.forEach(function (item) {
            table.row.add([
                item.smis,
                item.progName,
                item.employeeFullName,
                item.obStateName,
                item.obDate,
                item.note
            ]).draw();
        });
    }).fail(function (error) {
        console.error(response.message);
    });
}

// Lắng nghe sự kiện click và nhấn Enter
document.getElementById("searchIcon").addEventListener("click", searchSubscriber);
document.getElementById("soTB").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchSubscriber();
    }
});
