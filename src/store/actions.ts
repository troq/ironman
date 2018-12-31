import * as redux from 'redux';

import { getBuiltinQuotes } from './selectors';

enum ActionTypes {
	TOGGLE_SHOW_QUOTES = <any>'TOGGLE_SHOW_QUOTES',
	TOGGLE_BUILTIN_QUOTES = <any>'TOGGLE_BUILTIN_QUOTES',
	SELECT_NEW_QUOTE = <any>'SELECT_NEW_QUOTE',
	HIDE_QUOTE = <any>'HIDE_QUOTE',
	DELETE_QUOTE = <any>'DELETE_QUOTE',
	ADD_QUOTE = <any>'ADD_QUOTE',
	ADD_QUOTES_BULK = <any>'ADD_QUOTES_BULK',
	RESET_HIDDEN_QUOTES = <any>'RESET_HIDDEN_QUOTES',
}

interface INFO_PANEL_SHOW {
	type: 'INFO_PANEL_SHOW';
	show: 'SHOW' | 'HIDE' | 'TOGGLE';
}

interface QUOTE_MENU_SHOW {
	type: 'QUOTE_MENU_SHOW';
	show: 'SHOW' | 'HIDE' | 'TOGGLE';
}

interface QUOTE_EDIT {
	type: 'QUOTE_EDIT';
	action:
		| { type: 'START' }
		| { type: 'CANCEL' }
		| { type: 'SET_TEXT'; text: string }
		| { type: 'SET_SOURCE'; source: string }
		| { type: 'TOGGLE_BULK' };
}

interface ERROR {
	type: 'PARSE_ERROR';
	message: string;
}

import { IState } from './reducer';

interface ActionTypeObject {
	type: ActionTypes;
}

export type ActionObject =
	| QUOTE_MENU_SHOW
	| INFO_PANEL_SHOW
	| QUOTE_EDIT
	| ERROR;

export default ActionTypes;

function generateID(): string {
	let key = '';
	while (key.length < 16) {
		key += Math.random()
			.toString(16)
			.substr(2);
	}
	return key.substr(0, 16);
}

export function hideInfoPanel(): INFO_PANEL_SHOW {
	return {
		type: 'INFO_PANEL_SHOW',
		show: 'HIDE',
	};
}

export function showInfoPanel(): INFO_PANEL_SHOW {
	return {
		type: 'INFO_PANEL_SHOW',
		show: 'SHOW',
	};
}

export function toggleShowQuotes() {
	return {
		type: ActionTypes.TOGGLE_SHOW_QUOTES,
	};
}

export function toggleBuiltinQuotes() {
	return dispatch => {
		dispatch({
			type: ActionTypes.TOGGLE_BUILTIN_QUOTES,
		});

		dispatch(selectNewQuote());
	};
}

export function addQuote(text: string, source: string) {
	const id = generateID();
	return dispatch => {
		dispatch({
			type: ActionTypes.ADD_QUOTE,
			id,
			text,
			source,
		});
		dispatch(cancelEditing());
	};
}

export function resetHiddenQuotes() {
	return {
		type: ActionTypes.RESET_HIDDEN_QUOTES,
	};
}

export function removeCurrentQuote() {
	return (dispatch, getState) => {
		const state: IState = getState();
		if (state.isCurrentQuoteCustom) {
			dispatch({
				type: ActionTypes.DELETE_QUOTE,
				id: state.currentQuoteID,
			});
		} else {
			dispatch({
				type: ActionTypes.HIDE_QUOTE,
				id: state.currentQuoteID,
			});
		}

		dispatch(selectNewQuote());
	};
}

export function selectNewQuote() {
	return (dispatch, getState) => {
		const state: IState = getState();
		const builtinQuotes = getBuiltinQuotes(state);
		const customQuotes = state.customQuotes;
		const allQuotes = builtinQuotes.concat(customQuotes);
		if (allQuotes.length < 1) {
			return dispatch({
				type: ActionTypes.SELECT_NEW_QUOTE,
				isCustom: false,
				id: null,
			});
		}

		const quoteIndex = Math.floor(Math.random() * allQuotes.length);
		dispatch({
			type: ActionTypes.SELECT_NEW_QUOTE,
			isCustom: quoteIndex >= builtinQuotes.length,
			id: allQuotes[quoteIndex].id,
		});
	};
}

export function setDaySettings(site, day, settings) {
  return {
    type: 'WEEK_SETTINGS_EDIT',
    action: { type: 'SET_DAY_SETTINGS', site, day, settings },
  }
}

export function resetDaySettings(site, day) {
  return {
    type: 'WEEK_SETTINGS_EDIT',
    action: { type: 'RESET_DAY_SETTINGS', site, day },
  }
}

export function setQuoteText(text): QUOTE_EDIT {
	return {
		type: 'QUOTE_EDIT',
		action: { type: 'SET_TEXT', text: text },
	};
}

export function setQuoteSource(source): QUOTE_EDIT {
	return {
		type: 'QUOTE_EDIT',
		action: { type: 'SET_SOURCE', source },
	};
}

export function startEditing(): QUOTE_EDIT {
	return {
		type: 'QUOTE_EDIT',
		action: { type: 'START' },
	};
}

export function cancelEditing(): QUOTE_EDIT {
	return {
		type: 'QUOTE_EDIT',
		action: { type: 'CANCEL' },
	};
}

export const menuHide = (): QUOTE_MENU_SHOW => ({
	type: 'QUOTE_MENU_SHOW',
	show: 'HIDE',
});

export const menuToggle = (): QUOTE_MENU_SHOW => ({
	type: 'QUOTE_MENU_SHOW',
	show: 'TOGGLE',
});

export function toggleBulkEdit(): QUOTE_EDIT {
	return {
		type: 'QUOTE_EDIT',
		action: { type: 'TOGGLE_BULK' },
	};
}

export function addQuotesBulk(text: string) {
	return dispatch => {
		const lines = text.split('\n');
		const quotes = [];
		for (var lineCount = 0; lineCount < lines.length; lineCount++) {
			const line = lines[lineCount];
			const quote = line.split('~');
			const trimmedQuote = [];

			if (quote.length === 0 || quote[0].trim() === '') {
				// ignore newlines and empty spaces
			} else if (quote.length !== 2) {
				return dispatch({
					type: 'PARSE_ERROR',
					message: `Invalid format on line ${(
						lineCount + 1
					).toString()}: \"${quote}\"`,
				});
			} else {
				quote.forEach(field => trimmedQuote.push(field.trim()));
				quotes.push(trimmedQuote);
			}
		}
		quotes.forEach(trimmedQuote => {
			dispatch({
				type: ActionTypes.ADD_QUOTE,
				id: generateID(),
				text: trimmedQuote[0],
				source: trimmedQuote[1],
			});
		});
		dispatch(cancelEditing());
	};
}
