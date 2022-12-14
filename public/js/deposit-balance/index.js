$(function () {
    $(document).ready(function () {
        var dTable = $("#deposit-balance-table").DataTable({
            lengthChange: false,
            paging: true,
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
            dom: "<'row'<'col'B><'col'f>>tipr",
            buttons: [
                {
                    text: `<i class="fa fa-fw fa-arrow-circle-up" aria-hidden="true"></i> Setoran`,
                    className: "btn btn-info",
                    action: function (e, dt, node, config) {
                        window.location.href = '/deposits';
                    },
                },
                {
                    text: `<i class="fa fa-fw fa-arrow-circle-down" aria-hidden="true"></i> Tarikan`,
                    className: "btn btn-info",
                    action: function (e, dt, node, config) {
                        window.location.href = '/withdrawals';
                    },
                },
            ],
        });
    });
});
