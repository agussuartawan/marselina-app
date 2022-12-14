{!! Form::model($user, [
    'route' => 'users.store',
    'method' => 'POST',
    'id' => 'form-user',
]) !!}

<div class="form-group">
    <label for="name">{{ __('Nama User') }}</label>
    {!! Form::text('name', null, ['class' => 'form-control', 'id' => 'name']) !!}
</div>

<div class="form-group">
    <label for="email">{{ __('Email') }}</label>
    {!! Form::text('email', null, ['class' => 'form-control', 'id' => 'email']) !!}
</div>

<div class="form-group">
    <div class="form-row">
        <div class="col">
            <label for="password">{{ __('Password') }}</label>
            <input id="password" type="password" class="form-control" name="password">
        </div>

        <div class="col">
            <label for="password_confirmation">{{ __('Password Confirm') }}</label>
            <input id="password_confirmation" type="password" class="form-control" name="password_confirmation">
        </div>
    </div>
</div>

<div class="form-group">
    <label for="date_in">{{ __('Tanggal Masuk') }}</label>
    {!! Form::date('date_in', now(), ['class' => 'form-control', 'id' => 'date_in']) !!}
</div>

<div class="form-group">
    <label for="role">{{ __('Jabatan') }}</label>
    {!! Form::select('role', $roles, null, ['class' => 'form-control custom-select', 'id' => 'role']) !!}
</div>

{!! Form::close() !!}
