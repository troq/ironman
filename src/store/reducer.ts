import { combineReducers } from 'redux';

import { Quote } from '../quote';
import Actions, { ActionObject } from './actions';
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

function showInfoPanel(state = false, action: ActionObject) {
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

function featureIncrement(state = 0, action: ActionObject) {
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

function hiddenBuiltinQuotes(state: number[] = [], action): number[] {
	switch (action.type) {
		case Actions.HIDE_QUOTE:
			if (action.id == null) return state;
			return state.concat([action.id]);
		case Actions.RESET_HIDDEN_QUOTES:
			return [];
	}
	return state;
}

function customQuotes(state: Quote[] = [], action): Quote[] {
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

const editingText = (state: string = '', action: ActionObject) => {
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

const editingSource = (state: string = '', action) => {
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

const isQuoteMenuVisible = (state: boolean = false, action: ActionObject) => {
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

const isEditingQuote = (state: boolean = false, action) => {
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

const isEditingBulk = (state: boolean = false, action) => {
	switch (action.type) {
		case 'QUOTE_EDIT':
			switch (action.action.type) {
				case 'TOGGLE_BULK':
					return !state;
			}
	}
	return state;
};

const error = (state: string = '', action) => {
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

type Hour = 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23;
enum Weekday {Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday};
enum Site {FACEBOOK = 'FACEBOOK', REDDIT = 'REDDIT'};

export interface DaySettings {
  flexStart: Hour;
  flexMinutes: number;
  cheatMinutes: number;
}

export interface SiteSettings {
  [key: Site]: WeekSettings;
}

export interface WeekSettings {
  [key: Weekday]: DaySettings;
}

function weekSettings(state: WeekSettings = {}, action): WeekSettings {
	switch (action.type) {
		case 'WEEK_SETTINGS_EDIT':
			switch (action.action.type) {
				case 'SET_DAY_SETTINGS':
          return {
            ...state,
            [action.action.day]: action.action.settings,
          };
				case 'RESET_DAY_SETTINGS':
          return {
            ...state,
            [action.action.day]: null,
          };
			}
	}
	return state;
}

function siteSettings(state: SiteSettings = {}, action): SiteSettings {
  switch (action.type) {
    case 'WEEK_SETTINGS_EDIT':
      return { ...state, [action.action.site]: weekSettings(state[action.action.site], action) };
  }
  return state;
}

export interface IState {
	showQuotes: boolean;
	builtinQuotesEnabled: boolean;
	showInfoPanel: boolean;
	featureIncrement: number;
	isCurrentQuoteCustom: boolean;
	currentQuoteID: number | string;
	hiddenBuiltinQuotes: number[];
	customQuotes: Quote[];
	editingSource: string;
	editingText: string;
	isQuoteMenuVisible: boolean;
	isEditingQuote: boolean;
	isEditingBulk: boolean;
	error: string;
  siteSettings: SiteSettings;
}

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
  siteSettings,
});
