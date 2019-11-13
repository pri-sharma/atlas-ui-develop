import { getDefaultPath } from '../../helpers/urlSync';
import actions, { getView } from './actions';

const preKeys = getDefaultPath();

const initState = {
  collapsed: window.innerWidth > 1220 ? false : true,
  view: getView(window.innerWidth),
  height: window.innerHeight,
  openDrawer: false,
  openKeys: preKeys,
  current: preKeys,
  currentTab: 'baseline_volume_planning',
};
export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.CHANGE_OPEN_KEYS:
      return { ...state, openKeys: action.openKeys };
    case actions.CHANGE_CURRENT:
      return { ...state, current: action.current };
    case actions.SET_TAB:
      return {...state, currentTab: action.payload};
    default:
      return state;
  }
  return state;
}
