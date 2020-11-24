import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { Navbar } from '../ui/Navbar';
import { calendarOptions } from '../../helpers/calendar-options';
import { CalendarEvent } from './CalendarEvent';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarModal } from './CalendarModal';
import { uiOpenModal } from '../../actions/ui';
import { eventAddNew, eventSetActive } from '../../actions/events';
import { AddNewButton } from '../ui/AddNewButton';

const localizer = momentLocalizer(moment);

const events = [
	{
		title: 'Boss birthday',
		start: moment().toDate(),
		end: moment().add(2, 'hours').toDate(),
		bgcolor: '#fafafa',
		notes: 'Buy cake',
		user: {
			_id: '123',
			name: 'Pepe',
		},
	},
];

export const CalendarScreen = () => {
	const dispatch = useDispatch();
	const [lastView, setLastView] = useState(
		localStorage.getItem('lastView' || 'month')
	);

	const onDoubleClick = (e) => {
		dispatch(uiOpenModal());
	};
	const onSelectEvent = (e) => {
		dispatch(eventSetActive(e));
		dispatch(uiOpenModal());
	};
	const onViewChange = (e) => {
		setLastView(e);
		localStorage.setItem('lastView', e);
	};
	const eventStyleGetter = (event, start, end, isSelected) => {
		const style = {
			backgroundColor: '#367CF7',
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
				onView={onViewChange}
				view={lastView}
				components={{
					event: CalendarEvent,
				}}
			/>
			<CalendarModal />
			<AddNewButton />
		</div>
	);
};
