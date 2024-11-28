
document
    .getElementById("btn-login")
    .addEventListener("click", function (event) {
        event.preventDefault();

        const userName = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        if (!userName || !password) {
            alert("Vui lòng nhập tài khoản và mật khẩu");
            return;
        }

        loginUser(userName, password);
    });

// Hàm đăng nhập
function loginUser(userName, password) {
    const loginData = {
        user_name: userName,
        password: password,
    };

    fetch(localStorage.getItem("http_endpoint") + "obccos/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Dữ liệu trả về:", data);
            if (data.access_token) {
                localStorage.setItem("access_token", data.access_token);
                fetchUnreadMessages();
            } else {
                alert("Đăng nhập thất bại, kiểm tra lại thông tin tài khoản");
            }
        })
        .catch((error) => {
            console.error("Lỗi khi gọi API:", error);
            alert(
                "Đã xảy ra lỗi. Vui lòng thử lại sau." +
                localStorage.getItem("http_endpoint")
            );
        });
}

// Hàm lấy số tin nhắn chưa đọc
function fetchUnreadMessages() {
    fetch(localStorage.getItem("http_endpoint") + "obccos/getUnreadMessageCount", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "1",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            const receiveUserId = data.result[0].receiveUserId;
            localStorage.setItem("receiveUserId", receiveUserId);
            searchUserById(receiveUserId);
        })
        .catch((error) => {
            console.error("Lỗi khi gọi API:", error);
        });
}

// Hàm tìm kiếm người dùng theo ID
function searchUserById(receiveUserId) {
    fetch(
        localStorage.getItem("http_endpoint") +
        "obccos/searchUserCode?user_code=" +
        receiveUserId,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
            },
        }
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Lỗi: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Dữ liệu trả về:", data);
            if (data.data.data.length > 0) {
                // alert(data.data.data[0].full_name);
                //lưu thông tin
                localStorage.setItem("email", data.data.data[0].email);
                localStorage.setItem("full_name", data.data.data[0].full_name);
                localStorage.setItem("user_name", data.data.data[0].user_name);
                localStorage.setItem("vnpt_code", data.data.data[0].vnpt_code);
                localStorage.setItem("user_code", data.data.data[0].user_code);
                //chuyển qua trang khác + lưu thông tin
                window.location.href = "home.html";
            } else {
                console.error(
                    "Có lỗi xảy ra hoặc không có kết quả:",
                    data.error_msg
                );
            }
        })
        .catch((error) => {
            console.error("Lỗi khi gọi API:", error);
        });
}
document.addEventListener('keydown', function (event) {
    // Kiểm tra nếu phím nhấn là "Enter" (mã phím 13)
    if (event.key === 'Enter') {
        // Kích hoạt nút login
        document.getElementById('btn-login').click();
    }
});