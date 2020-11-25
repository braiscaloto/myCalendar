import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Modal from 'react-modal';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';

import { uiCloseModal } from '../../actions/ui';
import {
	eventAddNew,
	eventClearActiveEvent,
	eventUpdated,
} from '../../actions/events';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};
Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const oneHourLater = now.clone().add(1, 'hours');

const initEvent = {
	title: '',
	notes: '',
	start: now.toDate(),
	end: oneHourLater.toDate(),
};

export const CalendarModal = () => {
	const { modalOpen } = useSelector((state) => state.ui);
	const { activeEvent } = useSelector((state) => state.calendar);
	const dispatch = useDispatch();

	//const [startDate, setStartDate] = useState(now.toDate());
	//const [endDate, setEndDate] = useState(oneHourLater.toDate());
	const [titleValid, setTitleValid] = useState(true);

	const [formValues, setFormValues] = useState(initEvent);

	const { title, notes, start, end } = formValues;

	useEffect(() => {
		if (activeEvent) {
			setFormValues(activeEvent);
		} else {
			setFormValues(initEvent);
		}
	}, [activeEvent, setFormValues]);

	const handleInputChange = ({ target }) => {
		setFormValues({
			...formValues,
			[target.name]: target.value,
		});
	};

	const closeModal = () => {
		dispatch(uiCloseModal());
		dispatch(eventClearActiveEvent());
		setFormValues(initEvent);
		//setStartDate(now.toDate());
		//setEndDate(oneHourLater.toDate());
	};

	const handleStartDateChange = (e) => {
		//setStartDate(e);
		setFormValues({
			...formValues,
			start: e,
		});
	};
	const handleEndDateChange = (e) => {
		//setEndDate(e);
		setFormValues({
			...formValues,
			end: e,
		});
	};
	const handleSubmitForm = (e) => {
		e.preventDefault();

		const momentStart = moment(start);
		const momentEnd = moment(end);

		if (momentStart.isSameOrAfter(momentEnd)) {
			return Swal.fire('Error', 'End date must be higer than start date');
		}
		if (title.trim().length < 2) {
			return setTitleValid(false);
		}

		if (activeEvent) {
			dispatch(eventUpdated(formValues));
		} else {
			dispatch(
				eventAddNew({
					...formValues,
					id: new Date().getTime(),
					user: {
						_id: '123',
						name: 'Brais',
					},
				})
			);
		}

		setTitleValid(true);
		closeModal();
	};

	return (
		<Modal
			isOpen={modalOpen}
			onRequestClose={closeModal}
			closeTimeoutMS={200}
			style={customStyles}
			className='modal'
			overlayClassName='modal-fondo'
		>
			<h1> {activeEvent ? 'Editar Evento' : 'Nuevo evento'} </h1>
			<hr />
			<form className='container' onSubmit={handleSubmitForm}>
				<div className='form-group'>
					<label>Date and start time</label>
					<DateTimePicker
						onChange={handleStartDateChange}
						value={start}
						className='form-control'
					/>
				</div>

				<div className='form-group'>
					<label>Date and end time</label>
					<DateTimePicker
						onChange={handleEndDateChange}
						value={end}
						minDate={start}
						className='form-control'
					/>
				</div>

				<hr />
				<div className='form-group'>
					<label>Title and notes</label>
					<input
						type='text'
						className={`form-control ${
							!titleValid && 'is-invalid'
						}`}
						placeholder='Event title'
						name='title'
						value={title}
						onChange={handleInputChange}
						autoComplete='off'
					/>
					<small id='emailHelp' className='form-text text-muted'>
						Short description
					</small>
				</div>

				<div className='form-group'>
					<textarea
						type='text'
						className='form-control'
						placeholder='Notes'
						rows='5'
						name='notes'
						value={notes}
						onChange={handleInputChange}
					></textarea>
					<small id='emailHelp' className='form-text text-muted'>
						Additional Information
					</small>
				</div>

				<button
					type='submit'
					className='btn btn-outline-primary btn-block'
				>
					<i className='far fa-save'></i>
					<span> Save </span>
				</button>
			</form>
		</Modal>
	);
};
