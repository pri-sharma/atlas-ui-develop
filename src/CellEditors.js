import currency from 'currency.js'

// gets called once before the renderer is used
NumericCellEditor.prototype.init = function (params) {
    // create the cell
    this.eInput = document.createElement('input');
    params.eGridCell.style.height = '25px'; // make cell stay the same size

    if (isCharNumeric(params.charPress)) {
        this.eInput.value = params.charPress;
    } else {
        if (params.value !== undefined && params.value !== null) {
            this.eInput.value = params.value;
        }
    }

    let that = this;
    this.eInput.addEventListener('keypress', function (event) {
        if (!isKeyPressedNumeric(event)) {
            that.eInput.focus();
            if (event.preventDefault) event.preventDefault();
        } else if (that.isKeyPressedNavigation(event)){
            event.stopPropagation();
        }
    });

    // only start edit if key pressed is a number, not a letter
    this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
};

NumericCellEditor.prototype.isKeyPressedNavigation = function (event){
    return event.keyCode===39
        || event.keyCode===37;
};


// gets called once when grid ready to insert the element
NumericCellEditor.prototype.getGui = function () {
    return this.eInput;
};

// focus and select can be done after the gui is attached
NumericCellEditor.prototype.afterGuiAttached = function () {
    this.eInput.focus();
    this.eInput.select(); // highlight existing value
};

// returns the new value after editing
NumericCellEditor.prototype.isCancelBeforeStart = function () {
    return this.cancelBeforeStart;
};

// Gets called once when editing is finished (eg if enter is pressed).
// If you return true, then the result of the edit will be ignored.
NumericCellEditor.prototype.isCancelAfterEnd = function () {
    let value = this.getValue();
    return false;
};

// returns the new value after editing
NumericCellEditor.prototype.getValue = function () {
    return parseInt(this.eInput.value);
};

// any cleanup we need to be done here
NumericCellEditor.prototype.destroy = function () {
    // but this example is simple, no cleanup, we could  even leave this method out as it's optional
};

// if true, then this editor will appear in a popup
NumericCellEditor.prototype.isPopup = function () {
    // and we could leave this method out also, false is the default
    return false;
};

function isCharNumeric(charStr) {
    return !!/\d/.test(charStr);
}

function isKeyPressedNumeric(event) {
    let charCode = getCharCodeFromEvent(event);
    let charStr = String.fromCharCode(charCode);
    return isCharNumeric(charStr);
}

function getCharCodeFromEvent(event) {
    event = event || window.event;
    return (typeof event.which == "undefined") ? event.keyCode : event.which;
}

export function NumericCellEditor() {}


// gets called once before the renderer is used
DecimalCellEditor.prototype.init = function (params) {
    // create the cell
    this.eInput = document.createElement('input');
    params.eGridCell.style.height = '25px'; // make cell stay the same size

    if (isCharNumeric(params.charPress)) {
        this.eInput.value = params.charPress;
    } else {
        if (params.value !== undefined && params.value !== null) {
            this.eInput.value = currency(params.value).value;
        }
    }

    let that = this;
    this.eInput.addEventListener('keypress', function (event) {
        let index = that.eInput.value.indexOf(".");
        if (!isKeyPressedNumericOrDecimal(event) || (index > -1 && (event.key === '.' || that.eInput.value.substring(index).length === 3))) {
            that.eInput.focus();
            if (event.preventDefault) event.preventDefault();
        } else if (that.isKeyPressedNavigation(event)){
            event.stopPropagation();
        }
    });

    // only start edit if key pressed is a number, not a letter
    this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
};

DecimalCellEditor.prototype.isKeyPressedNavigation = function (event){
    return event.keyCode===39
        || event.keyCode===37;
};


// gets called once when grid ready to insert the element
DecimalCellEditor.prototype.getGui = function () {
    return this.eInput;
};

// focus and select can be done after the gui is attached
DecimalCellEditor.prototype.afterGuiAttached = function () {
    this.eInput.focus();
    this.eInput.select(); // highlight existing value
};

// returns the new value after editing
DecimalCellEditor.prototype.isCancelBeforeStart = function () {
    return this.cancelBeforeStart;
};

// Gets called once when editing is finished (eg if enter is pressed).
// If you return true, then the result of the edit will be ignored.
DecimalCellEditor.prototype.isCancelAfterEnd = function () {
    let value = this.getValue();
    return false;
};

// returns the new value after editing
DecimalCellEditor.prototype.getValue = function () {
    return currency(this.eInput.value).value;
};

// any cleanup we need to be done here
DecimalCellEditor.prototype.destroy = function () {
    // but this example is simple, no cleanup, we could  even leave this method out as it's optional
};

// if true, then this editor will appear in a popup
DecimalCellEditor.prototype.isPopup = function () {
    // and we could leave this method out also, false is the default
    return false;
};

function isCharDecimal(charStr) {
    return '.'.indexOf(charStr) === 0;
}

function isKeyPressedNumericOrDecimal(event) {
    let charCode = getCharCodeFromEvent(event);
    let charStr = String.fromCharCode(charCode);
    return isCharNumeric(charStr) || isCharDecimal(charStr);
}

export function DecimalCellEditor() {}