import Swal from 'sweetalert2';
import { fetchNoToken, fetchWithToken } from '../helpers/fetch';
import { types } from '../types/types';
import { eventLogout } from './events';

export const startlogin = (email, password) => {
	return async (dispatch) => {
		const resp = await fetchNoToken('auth', { email, password }, 'POST');
		const body = await resp.json();

		if (body.ok) {
			localStorage.setItem('token', body.token);
			localStorage.setItem('token-init-date', new Date().getTime());

			dispatch(
				login({
					uid: body.uid,
					name: body.name,
				})
			);
		} else {
			Swal.fire('Error', body.msg, 'error');
		}
	};
};

export const startRegister = (email, password, name) => {
	return async (dispatch) => {
		const resp = await fetchNoToken(
			'auth/register',
			{ email, password, name },
			'POST'
		);
		const body = await resp.json();

		if (body.ok) {
			localStorage.setItem('token', body.token);
			localStorage.setItem('token-init-date', new Date().getTime());

			dispatch(
				login({
					uid: body.uid,
					name: body.name,
				})
			);
		} else {
			Swal.fire('Error', body.msg, 'error');
		}
	};
};

const login = (user) => {
	return {
		type: types.authLogin,
		payload: user,
	};
};

export const startChecking = () => {
	return async (dispatch) => {
		const resp = await fetchWithToken('auth/renew'); //por defecto es un 'GET'
		const body = await resp.json();
		console.log(body);

		if (body.ok) {
			localStorage.setItem('token', body.token);
			localStorage.setItem('token-init-date', new Date().getTime());

			dispatch(
				login({
					uid: body.uid,
					name: body.name,
				})
			);
		} else {
			dispatch(checkingFinish());
		}
	};
};
const checkingFinish = () => {
	return {
		type: types.authCheckingFinish,
	};
};

export const startLogout = () => {
	return (dispatch) => {
		localStorage.clear();
		dispatch(eventLogout());
		dispatch(logout());
	};
};

const logout = () => ({ type: types.authLogout });
