import React from 'react';
import { useDispatch } from 'react-redux';
import { eventClearActiveEvent } from '../../actions/events';
import { uiOpenModal } from '../../actions/ui';

export const AddNewButton = () => {
	const dispatch = useDispatch();

	const handleClickNew = () => {
		dispatch(uiOpenModal());
		dispatch(eventClearActiveEvent());
	};

	return (
		<button onClick={handleClickNew} className='btn btn-primary fab'>
			<i className='fas fa-plus'></i>
		</button>
	);
};
