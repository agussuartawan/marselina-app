<?php

namespace App\Http\Controllers;

use App\Events\ClientCreated;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use App\Models\ClientType;
use App\Models\DepositBalance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('client.index');
    }

    public function getClientList(Request $request)
    {
        $data  = Client::query();

        return DataTables::of($data)
            ->addColumn('action', function ($data) {
                $action = view('include.client.btn-action', compact('data'))->render();
                return $action;
            })
            ->addColumn('client_type', function ($data) {
                return $data->clientType->name;
            })
            ->addColumn('status', function ($data) {
                if ($data->is_active == 1) {
                    return '<span class="badge badge-success">Aktif</span>';
                }
                if ($data->is_active == 0) {
                    return '<span class="badge badge-secondary">Nonaktif</span>';
                }
            })
            ->filter(function ($instance) use ($request) {
                if (!empty($request->search)) {
                    $instance->where(function ($w) use ($request) {
                        $search = $request->search;
                        $w->orwhere('name', 'LIKE', "%$search%")
                            ->orwhere('code', 'LIKE', "%$search%")
                            ->orwhere('nik', 'LIKE', "%$search%")
                            ->orwhere('phone', 'LIKE', "%$search%");
                    });
                }

                return $instance;
            })
            ->rawColumns(['action', 'client_type', 'status'])
            ->make(true);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $client = new Client();
        $client_type = ClientType::pluck('name', 'id');
        return view('include.client.create', compact('client', 'client_type'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreClientRequest $request)
    {
        DB::transaction(function () use ($request) {
            $client =  Client::create($request->validated());
            return $client;
        });
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Client $client)
    {
        return view('include.client.show', compact('client'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(CLient $client)
    {
        $client_type = ClientType::pluck('name', 'id');
        return view('include.client.edit', compact('client', 'client_type'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateClientRequest $request, CLient $client)
    {
        return $client->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // public function destroy(Client $client)
    // {
    //     if ($client->clientType()->exists()) {
    //         return false;
    //     }
    //     return $client->delete();
    // }

    public function searchClient(Request $request)
    {
        $search = $request->search;
        return Client::where('name', 'LIKE', "%$search%")->select('id', 'name')->get();
    }

    public function getBalance(Request $request)
    {
        $deposit = DepositBalance::where('client_id', $request->client_id)->select('amount')->first();
        return idr($deposit->amount);
    }

    public function balanceCheck(Request $request)
    {
        $client_id = $request->client_id;
        $amount_input =  preg_replace('/[Rp. ]/', '', $request->client_withdrawal_amount);

        $client_balance = DepositBalance::where('client_id', $client_id)->select('amount')->first();

        if ($amount_input > $client_balance->amount) {
            abort(422);
        }
        return true;
    }

    public function getClientCode(Request $request)
    {
        return Client::getNextCode($request->client_type_id);
    }
}
