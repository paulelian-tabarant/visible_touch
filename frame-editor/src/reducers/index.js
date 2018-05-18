import * as types from '../constants/ActionsTypes';

const frameEditor = (state = [], action) => {
  switch (action.type) {
    case types.CHANGE_COLOR:
      return state.concat([{key: action.key, color: action.color}]);
    default:
      return state;
  }
};

export default frameEditor;