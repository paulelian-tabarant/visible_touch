import * as types from '../constants/ActionsTypes';

export const changeColor = (key, color) => ({
  type: types.CHANGE_COLOR,
  key,
  color
});