function getFormData($form) {
    var unindexedArray = $form.serializeArray();
    var indexedArray = {};

    $.map(unindexedArray, function (n, i) {
        indexedArray[n['name']] = n['value'];
    });

    return indexedArray;
}

$("#btnInvoice").click(function () {

    bootbox.dialog({
        title: "Đang tra cứu hóa đơn",
        message: "<p class='text-center' ><i style='font-size:350%;' class='fa fa-spin fa-spinner'></i></p>",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Hủy',
                className: 'btn btn-modal button-solid',
                callback: function () {
                    clearTimeout(interVal);
                    bootbox.hideAll();
                }
            }
        }
    });
    var interVal = setTimeout(function () {
        var $form = $('#frmIndex');
        var datapost = $form.serialize();

        var model = getFormData($form);
        var dataObject = JSON.stringify(model);

        var url = '/tracuu/getinfoinvoice';

        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: dataObject,
            success: function (result) {

                if (!result.hasOwnProperty("error")) {
                    $("#divInvoice").show();
                    $('#divInvoice').prop('hidden', false);
                    $('#tableInvoice').prop('hidden', false);
                    $("#tableInvoice tbody>tr").remove();

                    for (var i = 0; i < result.data.length; i++) {
                        var tien = result.data[i].inv_TotalAmount == null ? result.data[i].sum_tien.toLocaleString() : result.data[i].inv_TotalAmount.toLocaleString();
                        $("#tableInvoice").find('tbody')
                            .append('<tr><td>' + result.data[i].mau_hd + '</td><td>' + result.data[i].inv_invoiceSeries + '</td><td>' + result.data[i].inv_invoiceNumber + '</td>' +
                                '<td>' + moment(result.data[i].inv_invoiceIssuedDate).format("DD/MM/YYYY") + '</td>' +
                                '<td>' + tien + '</td>' +
                                '<td>' +
                                '<a href="#" onClick = "displayInvoice(\'' + result.data[i].sobaomat.toString() + '\',\'' + result.data[i].inv_InvoiceAuth_id.toString() + '\',\'' + result.data[i].inv_auth_id.toString() + '\');" data-toggle="modal" data-target="#myModal" data-placement="top" title="Xem hóa đơn"><i class="fas fa-search text-success"></i></a>'
                                +
                                '</td></tr>');
                    }
                    bootbox.hideAll();
                    clearTimeout(interVal);
                }
                else {
                    $("#tableInvoice tbody>tr").remove();
                    bootbox.hideAll();
                    clearTimeout(interVal);
                    //bootbox.alert(
                    //{
                    //        message: result.error,
                    //        className: 'btn-modal-result'
                    //});
                    bootbox.dialog({
                        message: result.error,
                        buttons: {
                            ok: {
                                label: "OK",
                                className: 'btn btn-modal button-solid'
                            }
                        }
                    });
                }
            }
        });
    }, 1000);
});


function PrintInvoicePDF() {

    var sbm = $("#sobaomat_html").val();
    var type = "PDF";
    var auth = $("#invoiceauth").val();
    bootbox.dialog({
        title: "Đang in hóa đơn ...",
        message: "<p class='text-center' ><i style='font-size:350%;' class='fa fa-spin fa-spinner'></i></p>",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Hủy',
                className: 'btn btn-modal button-solid',
                callback: function () {
                    clearTimeout(interVal);
                    bootbox.hideAll();
                }
            }
        }
    });
    var interVal = setTimeout(function () {
        var model = '{  "auth": "' + auth + '", "sobaomat": "' + sbm + '", "type":"' + type + '" }';

        var url = '/tracuu/printinvoice';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.responseType = 'arraybuffer';
        xhr.send(model);
        xhr.onload = function () {
            if (this.status === 200) {
                var filename = "";
                var disposition = xhr.getResponseHeader('Content-Disposition');
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                }
                var type = xhr.getResponseHeader('Content-Type');
                var blob = typeof File === 'function' ? new File([this.response], filename, {
                    type: type
                }) : new Blob([this.response], {
                    type: type
                });

                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var URL = window.URL || window.webkitURL;
                    var downloadUrl = URL.createObjectURL(blob);

                    if (filename) {
                        var a = document.createElement("a");
                        if (typeof a.download === 'undefined') {
                            bootbox.hideAll();
                            clearTimeout(interVal);
                            var newWindow = window.open('/');
                            newWindow.onload = () => {
                                newWindow.location = downloadUrl;
                            };
                        } else {
                            bootbox.hideAll();
                            clearTimeout(interVal);
                            var newWindow = window.open('/');
                            newWindow.onload = () => {
                                newWindow.location = downloadUrl;
                            };
                        }
                    } else {
                        bootbox.hideAll();
                        clearTimeout(interVal);
                        var newWindow = window.open('/');
                        newWindow.onload = () => {
                            newWindow.location = downloadUrl;
                        };
                    }
                }
            } else {
                bootbox.hideAll();
                clearTimeout(interVal);
                bootbox.alert("Có lỗi xảy ra !");
            }
        };
    }, 1000);
}

function PrintInvoiceChuyenDoiPDF() {
    var sbm = $("#sobaomat_html").val();
    var inchuyendoi = 1;
    var type = "PDF";
    var auth = $("#invoiceauth").val();
    bootbox.dialog({
        title: "Đang in hóa đơn ...",
        message: "<p class='text-center' ><i style='font-size:350%;' class='fa fa-spin fa-spinner'></i></p>",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Hủy',
                className: 'btn btn-modal button-solid',
                callback: function () {
                    clearTimeout(interVal);
                    bootbox.hideAll();
                }
            }
        }
    });
    var interVal = setTimeout(function () {
        var model = '{"auth": "' + auth + '", "sobaomat": "' + sbm + '", "type":"' + type + '", "inchuyendoi":"' + inchuyendoi + '" }';

        var url = '/tracuu/printinvoice';

        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.responseType = 'arraybuffer';
        xhr.send(model);
        xhr.onload = function () {
            if (this.status === 200) {
                var filename = "";
                var disposition = xhr.getResponseHeader('Content-Disposition');
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                }
                var type = xhr.getResponseHeader('Content-Type');
                var blob = typeof File === 'function' ? new File([this.response], filename, {
                    type: type
                }) : new Blob([this.response], {
                    type: type
                });

                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var URL = window.URL || window.webkitURL;
                    var downloadUrl = URL.createObjectURL(blob);

                    if (filename) {
                        var a = document.createElement("a");
                        if (typeof a.download === 'undefined') {
                            bootbox.hideAll();
                            clearTimeout(interVal);
                            var newWindow = window.open('/');
                            newWindow.onload = () => {
                                newWindow.location = downloadUrl;
                            };
                        } else {
                            bootbox.hideAll();
                            clearTimeout(interVal);
                            var newWindow = window.open('/');
                            newWindow.onload = () => {
                                newWindow.location = downloadUrl;
                            };
                        }
                    } else {
                        bootbox.hideAll();
                        clearTimeout(interVal);
                        var newWindow = window.open('/');
                        newWindow.onload = () => {
                            newWindow.location = downloadUrl;
                        };
                    }
                }
            } else {
                bootbox.hideAll();
                clearTimeout(interVal);
                bootbox.alert("Có lỗi xảy ra !");
            }
        };
    }, 1000);
}

function ExportZipXML() {
    var sbm = $("#sobaomat_html").val();
    var auth = $("#invoiceauth").val();
    bootbox.dialog({
        title: "Đang Export hóa đơn File .Zip ...",
        message: "<p class='text-center' ><i style='font-size:350%;' class='fa fa-spin fa-spinner'></i></p>",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Hủy',
                className: 'btn btn-modal button-solid',
                callback: function () {
                    clearTimeout(interVal);
                    bootbox.hideAll();
                }
            }
        }
    });
    var interVal = setTimeout(function () {
        var model = '{ "sobaomat": "' + sbm + '", "auth": "' + auth + '" }';
        var kiki = JSON.parse(model);
        var url = '/tracuu/exportzipfilexml';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.responseType = 'arraybuffer';
        xhr.send(model);
        xhr.onload = function () {

            if (this.status === 200) {
                var filename = $("#fileName").val();
                var disposition = xhr.getResponseHeader('Content-Disposition');
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                }

                var type = xhr.getResponseHeader('Content-Type');
                var blob = typeof File === 'function' ? new File([this.response], filename, {
                    type: type
                }) : new Blob([this.response], {
                    type: type
                });
                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var URL = window.URL || window.webkitURL;
                    var downloadUrl = URL.createObjectURL(blob);
                    if (filename) {
                        var a = document.createElement("a");
                        document.body.appendChild(a);
                        a.href = downloadUrl;
                        a.download = filename;
                        a.click();
                        window.URL.revokeObjectURL(downloadUrl);
                        document.body.removeChild(a);
                        bootbox.hideAll();
                    } else {
                        bootbox.hideAll();
                        clearTimeout(interVal);
                        window.location = downloadUrl;
                    }
                }
            } else {
                bootbox.hideAll();
                clearTimeout(interVal);
                bootbox.alert("Có lỗi xảy ra !");
            }
        };
    }, 1000);
}


function handleFileSelect(evt) {
    var files = evt.target.files;
    var arr = ['application/zip', 'application/octet-stream', 'application/x-zip-compressed', 'multipart/x-zip'];

    if (arr.indexOf(files[0].type) === -1) {
        bootbox.alert("Định dạng File không đúng (*.zip) !");
        return;
    } else {
        if (files[0].size <= 0) {
            bootbox.alert("Bạn chưa chọn File !");
            return;
        } else {
            $(':button[type="submit"]').prop('disabled', false);
        }
    }
}

document.getElementById('input-file-now').addEventListener('change', handleFileSelect, false);



$('#btnUpFile').click(function () {

    bootbox.dialog({
        title: "Đang tra cứu hóa đơn",
        message: "<p class='text-center' ><i style='font-size:350%;' class='fa fa-spin fa-spinner'></i></p>",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Hủy',
                className: 'btn-danger',
                callback: function () {
                    clearTimeout(interVal);
                    bootbox.hideAll();
                }
            }
        }
    });

    var interVal = setTimeout(function () {
        var data = new FormData();
        var file = $('input[type=file]')[0].files[0];
        var fileSize = $("#txtFileSize").val();
        if (file.size / 1024 > parseInt(fileSize)) {
            bootbox.hideAll();
            bootbox.alert("Kích thước file upload không được lớn hơn 1 MB");
            return;
        }

        data.append('file', file);
        var url = '/tracuu/uploadinv';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.send(data);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function (rs) {
            if (this.status === 200) {
                var filename = "";
                var disposition = xhr.getResponseHeader('Content-Disposition');
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                }
                var type = xhr.getResponseHeader('Content-Type');

                var blob = typeof File === 'function'
                    ? new File([this.response],
                        filename,
                        {
                            type: type
                        })
                    : new Blob([this.response],
                        {
                            type: type
                        });
                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var URL = window.URL || window.webkitURL;
                    var downloadUrl = URL.createObjectURL(blob);

                    if (filename) {
                        var a = document.createElement("a");
                        if (typeof a.download === 'undefined') {
                            bootbox.hideAll();
                            var newWindow = window.open('/');
                            newWindow.onload = () => {
                                newWindow.location = downloadUrl;
                            };
                            //window.location = downloadUrl;
                        } else {
                            bootbox.hideAll();
                            var newWindow = window.open('/');
                            newWindow.onload = () => {
                                newWindow.location = downloadUrl;
                            };
                            //window.location = downloadUrl;
                        }
                    } else {
                        bootbox.hideAll();
                        var newWindow = window.open(downloadUrl);
                        //newWindow.onload = () => {
                        //    newWindow.location = downloadUrl;
                        //};
                    }
                }
            } else {

                var a = JSON.parse(new TextDecoder("utf-8").decode(new Uint8Array(xhr.response)));
                if (a.hasOwnProperty("error")) {
                    bootbox.alert(a.error);
                    bootbox.hideAll();
                }

            }
        };
    },
        1000);
});


function displayInvoice(sobaomat, auth, abc) {
    var data = {
        sobaomat: sobaomat,
        type: "PDF",
        auth: auth
    };
    $("#title-load").show();
    $("#hs-masthead").hide();
    $("#htm-content").empty();
    $("#btn-buyer-sign").hide();
    $("#btn-download-html").hide();
    $("#btn-dowd-zip").hide();
    $("#btn-download-pdf").hide();
    $("#btn-plugin").hide();
    $("#btn-download-pdf-inchuyendoi").hide();
    var url = '/tracuu/printinvoicepdf';

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (response) {

            if (response.hasOwnProperty("ok")) {
                var builder = '';
                var blob = b64toBlob(response.ok, 'application/pdf');
                var blobUrl = URL.createObjectURL(blob);
                builder += '<iframe class="responsive-iframe" src="' + blobUrl + '" frameborder="0" height="700px" width="100%"></iframe>';
                $("#htm-content").html('');
                $("#htm-content").append(builder);
                $("#htm-content").show();
                $("#title-load").hide();
                $("#sobaomat_html").val(sobaomat);
                $("#invoiceauth").val(auth);
                $("#ecd").val(response.ecd);
                $("#fileName").val(response.fileName);
                $("#abcdefg").val(abc);
                $("#btn-buyer-sign").show();
                $("#btn-download-html").show();
                $("#btn-dowd-zip").show();
                $("#btn-plugin").show();
                $("#btn-download-pdf").show();
                $("#btn-download-pdf-inchuyendoi").show();
            } else {
                $("#htm-content").html(response.error);
                $("#btn-buyer-sign").hide();
                $("#btn-dowdload-html").hide();
                $("#btn-dowd-zip").hide();
                $("#btn-plugin").hide();
                $("#btn-download-pdf").hide();
                $("#btn-download-pdf-inchuyendoi").hide();
            }
        }
    });
}

function buyerSignature() {


    //var SignalrConnection;
    //$.connection.hub.url = "http://localhost:19898/signalr";
    //SignalrConnection = $.connection.invoiceHub;

    //if (SignalrConnection == null) {
    //  bootbox.alert("Chưa bật plugin ký. Vui lòng kiểm tra (hoặc nhấn nút Tải Plugin). Tải lại trang web để thực hiện chức năng");
    //  return false;
    //}


    //$.connection.hub.start().done(function () {
    //  var invInvoiceAuthId = $("#invoiceauth").val();
    //  var a = $("#abcdefg").val();
    //  bootbox.dialog({
    //    title: "Đang ký hóa đơn",
    //    message: "<p class='text-center' ><i style='font-size:350%;' class='fa fa-spin fa-spinner'></i></p>",
    //    buttons: {
    //      cancel: {
    //        label: '<i class="fa fa-times"></i> Hủy',
    //        className: 'btn-danger',
    //        callback: function () {
    //          clearTimeout(interVal);
    //          bootbox.hideAll();
    //        }
    //      }
    //    }
    //  });

    //  var interVal = setTimeout(function () {
    //    SignalrConnection.server.SignatureXML(mst, invInvoiceAuthId, atob(a)).done(function (result) {
    //      console.log(result);
    //      if (result === "") {
    //        bootbox.alert({
    //          message: "Ký hóa đơn thành công. Vui lòng nhấn xem lại hóa đơn",
    //          callback: function () {

    //            //$('#myModal').modal('hide');
    //            $("#myModal").removeClass("in");
    //            $(".modal-backdrop").remove();
    //            $("#myModal").hide();
    //            bootbox.hideAll();
    //          }
    //        });
    //      }
    //      else {
    //        bootbox.hideAll();
    //        clearTimeout(interVal);
    //        bootbox.alert({
    //          size: "small",
    //          title: "Error",
    //          message: result
    //        });
    //      }
    //    });
    //  }, 3000);
    //})
    //  .fail(function () {
    //    bootbox.alert("Kết nối Plugin ký thất bại. Vui lòng kiểm tra lại");
    //  });


}

function readSignature(id) {


    //var SignalrConnection;
    //$.connection.hub.url = "http://localhost:19898/signalr";
    //SignalrConnection = $.connection.invoiceHub;

    //if (SignalrConnection == null) {
    //  bootbox.alert("Chưa bật plugin ký. Vui lòng kiểm tra (hoặc nhấn nút Tải Plugin). Tải lại trang web để thực hiện chức năng");
    //  return false;
    //}



    //var xml = $("#ecd").val();

    //if (id === "buyer") {
    //  if (xml.indexOf("buyer") === -1) {
    //    bootbox.alert("Không có thông tin người mua");
    //    return false;
    //  }
    //}



    //$.connection.hub.start().done(function () {
    //  var arg = {
    //    xml: xml,
    //    id: id
    //  };

    //  SignalrConnection.server.execCommand("ShowCert2", JSON.stringify(arg)).done(function (result) {
    //    console.log(result);
    //  }).fail(function (error) {
    //    console.log('Invocation of NewContosoChatMessage failed. Error: ' + error);
    //  });
    //})
    //  .fail(function () {
    //    bootbox.alert("Kết nối Plugin ký thất bại. Vui lòng kiểm tra lại");
    //  });
}


function veryfyXml() {
    var data = new FormData();
    var file = $('input[type=file]')[0].files[0];
    data.append('file', file);
    var url = '/tracuu/veryfyxml';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.responseType = 'json';
    xhr.send(data);
    xhr.onload = function () {
        var a = xhr.response;
        if (a.hasOwnProperty("error")) {
            bootbox.alert({
                message: a.error,
                className: "alertCss"
            });
        } else {
            bootbox.alert({
                message: a.ok,
                className: "alertCss"
            });
        }
    }
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}