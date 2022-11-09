"use strict";
/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
const gCOLUMNS_TABLE_ORDER = [
  "orderCode",
  "kichco",
  "loaipizza",
  "nuocuong",
  "thanhtien",
  "hoten",
  "trangthai",
  "sodienthoai",
  "action",
];
// khai báo hằng số toàn cục cho column table
const gCOL_ORDERCODE = 0;
const gCOL_KICHCO = 1;
const gCOL_LOAIPIZZA = 2;
const gCOL_NUOCUONG = 3;
const gCOL_THANHTIEN = 4;
const gCOL_HOTEN = 5;
const gCOL_TRANGTHAI = 6;
const gCOL_SODIENTHOAI = 7;
const gCOL_ACTION = 8;
var gOrderTable = $("#orders-table").DataTable({
  columns: [
    { data: gCOLUMNS_TABLE_ORDER[gCOL_ORDERCODE] },
    { data: gCOLUMNS_TABLE_ORDER[gCOL_KICHCO] },
    { data: gCOLUMNS_TABLE_ORDER[gCOL_LOAIPIZZA] },
    { data: gCOLUMNS_TABLE_ORDER[gCOL_NUOCUONG] },
    { data: gCOLUMNS_TABLE_ORDER[gCOL_THANHTIEN] },
    { data: gCOLUMNS_TABLE_ORDER[gCOL_HOTEN] },
    { data: gCOLUMNS_TABLE_ORDER[gCOL_TRANGTHAI] },
    { data: gCOLUMNS_TABLE_ORDER[gCOL_SODIENTHOAI] },
    { data: gCOLUMNS_TABLE_ORDER[gCOL_ACTION] },
  ],
  columnDefs: [
    {
      targets: gCOL_ACTION,
      defaultContent: `<button class="btn btn-success btn-detail">Sửa</button>
             <button class="btn btn-danger btn-delete">Xoá</button>
            `,
    },
  ],
});
var gOrderDataTable = [];
var gOrderCode = "";
var gID = "";
var gDataRow = "";
/*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */
/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
$(document).ready(function () {
  callApiLoadAllOrderToTable();
  console.log(gOrderDataTable);
  $("#orders-table").on("click", ".btn-detail", function () {
    onBtnDetailDataOrderClick(this);
  });
  $(".btn-update").on("click", function () {
    onBtnUpdateStatusClick();
  });
  $("#orders-table").on("click", ".btn-delete", function () {
    onBtnDeleteClick(this);
  });
  $("#btn-confirm-delete").on("click", function () {
    callApiDeleteOrder();
  });
  $(".btn-filter").on("click", function (e) {
    e.preventDefault();
    onBtnFilterGradesClick();
  });
  $(".btn-add-order").on("click", function () {
    $("#add-orders-modal").modal("show");
    callApiLoadDataDrinkToSelect();
  });
  $('.btn-add-order-modal').on('click', function(){
    onBtnAddOrderModalClick()
  })
  $('#select-size-combo').change(function(){
    $('#select-size-combo option:selected').each(function(){
        if($(this).val() =='S'){
            $('#add-orders-modal #inp-duong-kinh').val('20')
            $('#add-orders-modal #inp-suon-nuong').val('2')
            $('#add-orders-modal #inp-number-drink').val('2')
            $('#add-orders-modal #inp-salad').val('200')
            $('#add-orders-modal #inp-thanh-tien').val('150000')
        } else if($(this).val()=='M'){
            $('#add-orders-modal #inp-duong-kinh').val('25')
            $('#add-orders-modal #inp-suon-nuong').val('4')
            $('#add-orders-modal #inp-number-drink').val('3')
            $('#add-orders-modal #inp-salad').val('300')
            $('#add-orders-modal #inp-thanh-tien').val('200000')
        } else if($(this).val()=='L'){
            $('#add-orders-modal #inp-duong-kinh').val('30')
            $('#add-orders-modal #inp-suon-nuong').val('8')
            $('#add-orders-modal #inp-number-drink').val('4')
            $('#add-orders-modal #inp-salad').val('500')
            $('#add-orders-modal #inp-thanh-tien').val('250000')
        } else if($(this).val() == '0'){
            $('#add-orders-modal #inp-duong-kinh').val('')
            $('#add-orders-modal #inp-suon-nuong').val('')
            $('#add-orders-modal #inp-number-drink').val('')
            $('#add-orders-modal #inp-salad').val('')
            $('#add-orders-modal #inp-thanh-tien').val('')
        }
    })
  })
});
/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình */
function onBtnAddOrderModalClick(){
    var vObjectRequest = {
        kichCo: "",
        duongKinh: "",
        suon: "",
        salad: "",
        loaiPizza: "",
        idVourcher: "",
        idLoaiNuocUong: "",
        soLuongNuoc: "",
        hoTen: "",
        thanhTien: "",
        email: "",
        soDienThoai: "",
        diaChi: "",
        loiNhan: "",
        trangThai: 'open'
    }
    getDataAddOrder(vObjectRequest)
    if(validateFormAddOrder(vObjectRequest)){
        $("#add-orders-modal").modal("hide");
        callApiAddOrder(vObjectRequest)
    }
}
function callApiAddOrder(paramObjAddOrder){
    $.ajax({
        type: "POST",
        url: "http://203.171.20.210:8080/devcamp-pizza365/orders",
        async: false,
        contentType: 'application/json',
        data: JSON.stringify(paramObjAddOrder),
        dataType: "json",
        success: function (response) {
            callApiLoadAllOrderToTable()
        }
    });
}
function validateFormAddOrder(paramObjAddOrder){
    if(paramObjAddOrder.kichCo == '0'){
        alert('Vui lòng chọn kích cỡ pizza!')
        return false
    }
    if(paramObjAddOrder.loaiPizza == '0'){
        alert('Vui lòng chọn loại pizza!')
        return false
    }
    if(!isNaN(paramObjAddOrder.kichCo)){
        alert('Vui lòng nhập voucher là số!')
        return false
    }
    if(paramObjAddOrder.idLoaiNuocUong == '0'){
        alert('Vui lòng chọn loại nước uống!')
        return false
    }
    if(paramObjAddOrder.hoTen == ''){
        alert('Vui lòng nhập họ tên!')
        return false
    }
    if(paramObjAddOrder.soDienThoai == ''){
        alert('Vui lòng nhập số điện thoại!')
        return false
    }
    if(paramObjAddOrder.diaChi == ''){
        alert('Vui lòng nhập địa chỉ!')
        return false
    }
    if(!isEmail(paramObjAddOrder.email)){
        alert('Vui lòng nhập đúng email!')
        return false
    }
    return true
}
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
function getDataAddOrder(paramObjAddOrder){
    paramObjAddOrder.kichCo = $('#add-orders-modal #select-size-combo').val();
    paramObjAddOrder.duongKinh = $('#add-orders-modal #inp-duong-kinh').val();
    paramObjAddOrder.suon = $('#add-orders-modal #inp-suon-nuong').val();
    paramObjAddOrder.salad = $('#add-orders-modal #inp-salad').val();
    paramObjAddOrder.loaiPizza = $('#add-orders-modal #select-pizza').val();
    paramObjAddOrder.idVourcher = $('#add-orders-modal #inp-voucher-id').val();
    paramObjAddOrder.idLoaiNuocUong = $('#add-orders-modal #select-drinks').val();
    paramObjAddOrder.soLuongNuoc = $('#add-orders-modal #inp-number-drink').val();
    paramObjAddOrder.hoTen = $('#add-orders-modal #inp-fullname').val().trim();
    paramObjAddOrder.thanhTien = $('#add-orders-modal #inp-thanh-tien').val();
    paramObjAddOrder.email = $('#add-orders-modal #inp-email').val();
    paramObjAddOrder.soDienThoai = $('#add-orders-modal #inp-phone-number').val().trim();
    paramObjAddOrder.diaChi = $('#add-orders-modal #inp-address').val();
    paramObjAddOrder.loiNhan = $('#add-orders-modal #inp-message').val();
}
function callApiLoadDataDrinkToSelect() {
    $.ajax({
      type: "GET",
      url: "http://203.171.20.210:8080/devcamp-pizza365/drinks",
      dataType: "json",
      success: function (response) {
        displayDataDrinkToSelect(response);
      },
    });
  }
  function displayDataDrinkToSelect(paramResponse) {
    for (var bIndex in paramResponse) {
      var bOption = $("<option>")
        .val(paramResponse[bIndex].maNuocUong)
        .html(paramResponse[bIndex].tenNuocUong);
      $("#select-drinks").append(bOption);
    }
  }
  function onBtnFilterGradesClick() {
    var vFilterForm = {
      loaiPizza: "",
      status: "",
    };
    getDataFilter(vFilterForm);
    console.log(vFilterForm);
    filterGrades(vFilterForm);
  }
  function getDataFilter(paramObjFilter) {
    paramObjFilter.loaiPizza = $("#select-filter-pizza").val();
    paramObjFilter.status = $("#select-filter-status").val();
  }
  function filterGrades(paramObjFilter) {
    var vGradesResult = [];
    // thực hiện việc lọc
    debugger;
    vGradesResult = gOrderDataTable.filter(function (paramObject) {
      return (
        (paramObjFilter.loaiPizza == 0 ||
          paramObject.loaipizza == paramObjFilter.loaiPizza) &&
        (paramObjFilter.status == 0 ||
          paramObject.trangthai == paramObjFilter.status)
      );
    });
    if (vGradesResult.length < gOrderDataTable.length) {
      $(".p-message-result").html(
        `Có ${vGradesResult.length} bản ghi thỏa mãn!`
      );
    } else {
      $(".p-message-result").html("");
    }
    // load dữ liệu trả về lên table
    loadDataTable(gOrderTable, vGradesResult);
  }
function onBtnDeleteClick(paramElementButton) {
  gDataRow = getDataRowFromButton(paramElementButton);
  $("#delete-confirm-modal").modal("show");
}
function callApiDeleteOrder() {
  $.ajax({
    type: "DELETE",
    url: "http://203.171.20.210:8080/devcamp-pizza365/orders/" + gDataRow.id,
    async: false,
    dataType: "json",
    success: function (response) {
      $("#delete-confirm-modal").modal("hide");
      callApiLoadAllOrderToTable();
    },
  });
}
function getDataRowFromButton(paramButton) {
  var vTableRow = $(paramButton).parents("tr");
  var vRowData = gOrderTable.row(vTableRow).data();
  return vRowData;
}
//ham xử lý sự kiện thay đổi trạng thái confirmed
function onBtnUpdateStatusClick() {
  var vObjectRequest = {
    trangThai: "", //3: trang thai open, confirmed, cancel tùy tình huống
  };
  vObjectRequest.trangThai = $('#select-status').val()
  $.ajax({
    type: "PUT",
    url: "http://203.171.20.210:8080/devcamp-pizza365/orders/" + gID,
    contentType: "application/json",
    data: JSON.stringify(vObjectRequest),
    dataType: "json",
    success: function (response) {
      $("#orders-modal").modal("hide");
      callApiLoadAllOrderToTable();
    },
  });
}
function getDataOrderFromButton(paramButton) {
  var vTableRow = $(paramButton).parents("tr");
  var vUserRowData = gOrderTable.row(vTableRow).data();
  return vUserRowData;
}
function onBtnDetailDataOrderClick(paramElement) {
  var vDataOrder = getDataOrderFromButton(paramElement);
  gOrderCode = vDataOrder.orderCode;
  $("#orders-modal").modal("show");
  callApiGetDataOrderByOrderId(gOrderCode);
}
function callApiGetDataOrderByOrderId(paramOrderID) {
  $.ajax({
    type: "GET",
    url: "http://203.171.20.210:8080/devcamp-pizza365/orders/" + paramOrderID,
    dataType: "json",
    success: function (response) {
      console.log(response);
      gID = response.id;
      displayDataResponseToElementForm(response);
    },
  });
}
function displayDataResponseToElementForm(paramResponse) {
  $("#orders-modal #inp-order-id").val(paramResponse.orderCode);
  $("#orders-modal #select-size-combo").val(paramResponse.kichCo);
  $("#orders-modal #inp-duong-kinh").val(paramResponse.duongKinh);
  $("#orders-modal #inp-suon-nuong").val(paramResponse.suon);
  $("#orders-modal #inp-do-uong").val(paramResponse.idLoaiNuocUong);
  $("#orders-modal #inp-number-drink").val(paramResponse.soLuongNuoc);
  $("#orders-modal #inp-voucher-id").val(paramResponse.idVourcher);
  $("#orders-modal #inp-pizza-type").val(paramResponse.loaiPizza);
  $("#orders-modal #inp-salad").val(paramResponse.salad);
  $("#orders-modal #inp-thanh-tien").val(paramResponse.thanhTien);
  $("#orders-modal #inp-giam-gia").val(paramResponse.giamGia);
  $("#orders-modal #inp-fullname").val(paramResponse.hoTen);
  $("#orders-modal #inp-email").val(paramResponse.email);
  $("#orders-modal #inp-phone-number").val(paramResponse.soDienThoai);
  $("#orders-modal #inp-address").val(paramResponse.diaChi);
  $("#orders-modal #inp-message").val(paramResponse.loiNhan);
  $("#orders-modal #select-status").val(paramResponse.trangThai);
  $("#orders-modal #inp-ngay-tao").val(paramResponse.ngayTao);
  $("#orders-modal #inp-ngay-update").val(paramResponse.ngayCapNhat);
}
function callApiLoadAllOrderToTable() {
  $.ajax({
    type: "GET",
    url: "http://203.171.20.210:8080/devcamp-pizza365/orders",
    dataType: "json",
    success: function (response) {
      mountDataToVariableGloble(response);
      loadDataTable(gOrderTable, gOrderDataTable);
    },
  });
}
function mountDataToVariableGloble(paramRes) {
  gOrderDataTable = [];
  for (var bIndex in paramRes) {
    var bOrder = {
      id: paramRes[bIndex].id,
      orderCode: paramRes[bIndex].orderCode,
      kichco: paramRes[bIndex].kichCo,
      loaipizza: paramRes[bIndex].loaiPizza,
      nuocuong: paramRes[bIndex].idLoaiNuocUong,
      thanhtien: paramRes[bIndex].thanhTien,
      hoten: paramRes[bIndex].hoTen,
      trangthai: paramRes[bIndex].trangThai,
      sodienthoai: paramRes[bIndex].soDienThoai,
    };
    gOrderDataTable.push(bOrder);
  }
}
function loadDataTable(paramTable, paramData) {
  //Xóa toàn bộ dữ liệu đang có của bảng
  paramTable.clear();
  //Cập nhật data cho bảng
  paramTable.rows.add(paramData);
  //Cập nhật lại giao diện hiển thị bảng
  paramTable.draw();
}
