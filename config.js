localStorage.setItem("http_endpoint", "https://true-mentally-wahoo.ngrok-free.app/");
localStorage.setItem("http_local_endpoint", "http://10.94.35.204:9000/");

function convertDateTime(dateTimeString) {
    // Chuyển đổi chuỗi thành đối tượng Date
    const date = new Date(dateTimeString);

    // Lấy các thành phần ngày tháng năm và giờ phút giây
    const day = String(date.getDate()).padStart(2, '0'); // Ngày
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng (0-11)
    const year = date.getFullYear(); // Năm
    const hours = String(date.getHours()).padStart(2, '0'); // Giờ
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Phút
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Giây

    // Trả về chuỗi theo định dạng dd/mm/yyyy HH:mm:ss
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
function formatDate(dateTimeString) { //dd/mm/yyyy
    const dateObj = new Date(dateTimeString);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Tháng trong JS bắt đầu từ 0
    const year = dateObj.getFullYear();

    // Định dạng thành dd/mm/yyyy
    return `${day}/${month}/${year}`;
}