$(function () {
    $(document).ready(function () {
        var dTable = $("#client-table").DataTable({
            lengthChange: false,
            paging: true,
            serverSide: true,
            processing: true,
            responsive: true,
            autoWidth: false,
            order: [[0, "desc"]],
            language: {
                lengthMenu: "Tampilkan _MENU_ data",
                zeroRecords: "Data tidak ditemukan",
                info: "Menampilkan _START_ ke _END_ dari _TOTAL_ data",
                infoEmpty: "Menampilkan 0 ke 0 dari 0 data",
                emptyTable: "Tidak ada data tersedia pada tabel",
                infoFiltered: "(Difilter dari _MAX_ total data)",
                search: "Cari:",
                paginate: {
                    first: "Awal",
                    last: "Akhir",
                },
            },
            scroller: {
                loadingIndicator: false,
            },
            pagingType: "first_last_numbers",
            ajax: {
                url: "client/get-list",
                data: function (d) {
                    d.search = $('input[type="search"]').val();
                },
            },
            columns: [
                { data: "code", name: "code" },
                { data: "nik", name: "nik" },
                { data: "name", name: "name" },
                { data: "phone", name: "phone" },
                { data: "client_type", name: "client_type" },
                { data: "status", name: "status" },
                { data: "action", name: "action", orderable: false },
            ],
            dom: "<'row'<'col'B><'col'f>>tipr",
            buttons: [
                {
                    text: `<i class="fa fa-fw fa-plus-circle" aria-hidden="true"></i> Tambah`,
                    className: "btn btn-info",
                    action: function (e, dt, node, config) {
                        $(".modal-save").show();
                        $("#modal").modal("show");
                        fillModal($(this));
                    },
                },
            ],
            initComplete: function (settings, json) {
                $('input[type="search"').unbind();
                $('input[type="search"').bind("keyup", function (e) {
                    if (e.keyCode == 13) {
                        dTable.draw();
                    }
                });
            },
        });
    });

    $("body").on("click", ".btn-show", function (event) {
        event.preventDefault();
        var me = $(this);

        $(".modal-save").hide();
        $("#modal").modal("show");
        fillModal(me);
    });

    $("body").on("click", ".modal-edit", function (event) {
        event.preventDefault();
        var me = $(this);

        $(".modal-save").show();
        $("#modal").modal("show");
        fillModal(me);
    });

    $(".modal-save").on("click", function (event) {
        event.preventDefault();

        var form = $("#form-client"),
            url = form.attr("action"),
            method =
                $("input[name=_method").val() == undefined ? "POST" : "PUT",
            message =
                $("input[name=_method").val() == undefined
                    ? "Data klien berhasil ditambahkan"
                    : "Data klien berhasil diubah";

        $(".form-control").removeClass("is-invalid");
        $(".invalid-feedback").remove();

        $.ajax({
            url: url,
            method: method,
            data: form.serialize(),
            beforeSend: function () {
                $(".modal-save").attr("disabled", true);
            },
            complete: function () {
                $(".modal-save").removeAttr("disabled");
            },
            success: function (response) {
                showSuccessToast(message);
                $("#modal").modal("hide");
                $("#client-table").DataTable().ajax.reload();
            },
            error: function (xhr) {
                showErrorToast();
                var res = xhr.responseJSON;
                if ($.isEmptyObject(res) == false) {
                    $.each(res.errors, function (key, value) {
                        $("#" + key)
                            .addClass("is-invalid")
                            .after(
                                `<small class="invalid-feedback">${value}</small>`
                            );
                    });
                }
            },
        });
    });

    $("body").on("change", "#client_type_id", function () {
        const value = $(this).val();
        const url = "/client/client-type-check";
        const method = "GET";

        $.ajax({
            url: url,
            method: method,
            data: { client_type_id: value },
            success: function (response) {
                $("#code").val(response);
            },
        });
    });
});

fillModal = (me) => {
    var url = me.attr("href"),
        title = me.attr("title");

    url === undefined ? (url = "/clients/create") : url;
    title === undefined ? (title = "Tambah Klien") : title;

    $(".modal-title").text(title);

    $.ajax({
        url: url,
        type: "GET",
        dataType: "html",
        success: function (response) {
            $(".modal-body").html(response);
            makeSelectTwo();
        },
        error: function (xhr, status) {
            $("#modal").modal("hide");
            alert("Terjadi kesalahan");
        },
    });
};

showSuccessToast = (message) => {
    Swal.fire("Berhasil!", message, "success");
};

showErrorToast = () => {
    Swal.fire("Opps!", "Terjadi kesalahan!", "error");
};
