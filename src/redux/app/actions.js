export function getView(width) {
    let newView = 'MobileView';
    if (width > 1220) {
        newView = 'DesktopView';
    } else if (width > 767) {
        newView = 'TabView';
    }
    return newView;
}

const actions = {
    
    CHANGE_OPEN_KEYS: 'CHANGE_OPEN_KEYS',
    CHANGE_CURRENT: 'CHANGE_CURRENT',
    SET_TAB: 'SET_TAB',  
    LINK_CLICK: 'LINK_CLICK',

    setTab: (id) => {
        return {
            type: actions.SET_TAB,
            payload: id
        }
    },
    changeOpenKeys: openKeys => ({
        type: actions.CHANGE_OPEN_KEYS,
        openKeys
    }),
    changeCurrent: current => ({
        type: actions.CHANGE_CURRENT,
        current
    }),
    linkClick: click => ({
        type: actions.LINK_CLICK,
        click
    }),
};
export default actions;
