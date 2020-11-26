import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/es';

import { Navbar } from '../ui/Navbar';
import { calendarOptions } from '../../helpers/calendar-options';
import { CalendarEvent } from './CalendarEvent';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarModal } from './CalendarModal';
import { uiOpenModal } from '../../actions/ui';
import {
	eventClearActiveEvent,
	eventSetActive,
	eventStartLoading,
} from '../../actions/events';
import { AddNewButton } from '../ui/AddNewButton';
import { DeleteButton } from '../ui/DeleteButton';

moment.locale('es');
const localizer = momentLocalizer(moment);

export const CalendarScreen = () => {
	const dispatch = useDispatch();

	const { events, activeEvent } = useSelector((state) => state.calendar);
	const { uid } = useSelector((state) => state.auth);
	const [lastView, setLastView] = useState(
		localStorage.getItem('lastView' || 'month')
	);
	useEffect(() => {
		dispatch(eventStartLoading());
	}, [dispatch]);

	const onDoubleClick = (e) => {
		dispatch(uiOpenModal());
	};
	const onSelectEvent = (e) => {
		dispatch(eventSetActive(e));
	};
	const onViewChange = (e) => {
		setLastView(e);
		localStorage.setItem('lastView', e);
	};

	const onSelectSlot = (e) => {
		dispatch(eventClearActiveEvent());
	};
	const eventStyleGetter = (event, start, end, isSelected) => {
		const style = {
			backgroundColor: uid === event.user._id ? '#367CF7' : '#465660',
			borderRadius: '0px',
			opacity: 0.8,
			display: 'block',
			color: 'white',
		};
		return {
			style,
		};
	};
	return (
		<div className='calendar-screen'>
			<Navbar />
			<Calendar
				localizer={localizer}
				events={events}
				startAccessor='start'
				endAccessor='end'
				style={{ height: 500 }}
				messages={calendarOptions}
				eventPropGetter={eventStyleGetter}
				onDoubleClickEvent={onDoubleClick}
				onSelectEvent={onSelectEvent}
				onSelectSlot={onSelectSlot}
				selectable={true}
				onView={onViewChange}
				view={lastView}
				components={{
					event: CalendarEvent,
				}}
			/>
			<AddNewButton />

			<CalendarModal />

			{activeEvent && <DeleteButton />}
		</div>
	);
};
