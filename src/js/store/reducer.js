import { combineReducers } from 'redux';

import { Quote } from '../quote';
import Actions from './actions';
import config from '../config';

function showQuotes(state = true, action) {
	switch (action.type) {
		case Actions.TOGGLE_SHOW_QUOTES:
			return !state;
	}
	return state;
}

function builtinQuotesEnabled(state = true, action) {
	switch (action.type) {
		case Actions.TOGGLE_BUILTIN_QUOTES:
			return !state;
	}
	return state;
}

function showInfoPanel(state = false, action) {
	switch (action.type) {
		case 'INFO_PANEL_SHOW':
			switch (action.show) {
				case 'SHOW':
					return true;
				case 'HIDE':
					return false;
				case 'TOGGLE':
					return !state;
			}
	}
	return state;
}

function featureIncrement(state = 0, action) {
	switch (action.type) {
		case 'INFO_PANEL_SHOW':
			switch (action.show) {
				case 'SHOW':
					return config.newFeatureIncrement;
			}
	}
	return state;
}

function isCurrentQuoteCustom(state = null, action) {
	switch (action.type) {
		case Actions.SELECT_NEW_QUOTE:
			return action.isCustom;
		case Actions.ADD_QUOTE:
			return true;
	}
	return state;
}

function currentQuoteID(state = null, action) {
	switch (action.type) {
		case Actions.SELECT_NEW_QUOTE:
			return action.id;
		case Actions.ADD_QUOTE:
			return action.id;
	}
	return state;
}

function hiddenBuiltinQuotes(state = [], action) {
	switch (action.type) {
		case Actions.HIDE_QUOTE:
			if (action.id == null) return state;
			return state.concat([action.id]);
		case Actions.RESET_HIDDEN_QUOTES:
			return [];
	}
	return state;
}

function customQuotes(state = [], action) {
	switch (action.type) {
		case Actions.ADD_QUOTE:
			return state.concat([
				{
					id: action.id,
					text: action.text,
					source: action.source,
				},
			]);
		case Actions.DELETE_QUOTE:
			if (action.id == null) return state;
			return state.filter(quote => quote.id !== action.id);
	}
	return state;
}

const editingText = (state = '', action) => {
	switch (action.type) {
		case 'QUOTE_EDIT':
			switch (action.action.type) {
				case 'START':
					return '';
				case 'CANCEL':
					return '';
				case 'SET_TEXT':
					return action.action.text;
				case 'TOGGLE_BULK':
					return '';
			}
	}
	return state;
};

const editingSource = (state = '', action) => {
	switch (action.type) {
		case 'QUOTE_EDIT':
			switch (action.action.type) {
				case 'START':
					return '';
				case 'CANCEL':
					return '';
				case 'SET_SOURCE':
					return action.action.source;
			}
	}
	return state;
};

const isQuoteMenuVisible = (state = false, action) => {
	switch (action.type) {
		case 'QUOTE_MENU_SHOW':
			switch (action.show) {
				case 'SHOW':
					return true;
				case 'HIDE':
					return false;
				case 'TOGGLE':
					return !state;
			}
	}
	return state;
};

const isEditingQuote = (state = false, action) => {
	switch (action.type) {
		case 'QUOTE_EDIT':
			switch (action.action.type) {
				case 'START':
					return true;
				case 'CANCEL':
					return false;
			}
	}
	return state;
};

const isEditingBulk = (state = false, action) => {
	switch (action.type) {
		case 'QUOTE_EDIT':
			switch (action.action.type) {
				case 'TOGGLE_BULK':
					return !state;
			}
	}
	return state;
};

const error = (state = '', action) => {
	switch (action.type) {
		case 'QUOTE_EDIT':
			switch (action.action.type) {
				case 'CANCEL':
					return '';
			}
			return state;
		case 'PARSE_ERROR':
			return action.message;
	}
	return state;
};

export default combineReducers({
	showQuotes,
	builtinQuotesEnabled,
	showInfoPanel,
	featureIncrement,
	isCurrentQuoteCustom,
	currentQuoteID,
	hiddenBuiltinQuotes,
	customQuotes,
	editingSource,
	editingText,
	isQuoteMenuVisible,
	isEditingQuote,
	isEditingBulk,
	error,
});
