import sortBy from 'lodash/sortBy';
import currency from 'currency.js';

const VolumeKeys = {
    total_volume: 'total_volume',
    uplift_volume: 'uplift_volume',
    baseline_volume: 'baseline_volume',
    gross_price: 'gross_price'
};

// TODO: has duplicate in EventGrid
const SpendType = {
    FX: 'FX',
    OI: 'OI',
    VR: 'VR'
};

// TODO: has duplicate in EventGrid
const CellEditor = {
    decimalCellEditor: 'decimalCellEditor',
    numericCellEditor: 'numericCellEditor',
    textCellEditor: 'agTextCellEditor'
};

// TODO: has duplicate in EventGrid
const VarType = {
    int: 'int',
    float: 'float',
    char: 'char'
};

const sum = (values) => {
    let sum = 0;

    values.forEach(x => {
        sum = currency(sum).add(x);
    });
    return sum.value;
};

const avg = (values) => {
    let sum = 0;
    values.forEach(x => {
        if (typeof x === 'string') {
            x = parseFloat(x)
        }
        sum = currency(sum).add(x);

    });
    if (values.length === 0) {
        return 0;
    }
    if(values.every(value => value === 'N/A')){
        return 'N/A'
    }
    if(values.every(value => value === '*')){
        return '*'
    }

    return values.every(value => value === values[0]) ? currency(sum).divide(values.length).value : '*';
};

export function getDisplayOrderColumns(planningConfig, eventConditions) {

    let displayOrderDict = Object.keys(planningConfig).map(key => {
        const record = planningConfig[key];
        record.col_id = key;
        return record;
    });
    displayOrderDict = sortBy(displayOrderDict, ['display_order', 'display_name']);

    let columnGroups = [];
    for (let i = 0; i < displayOrderDict.length; i++) {
        const keyFigures = displayOrderDict[i];
        const kfg = keyFigures.col_id;
        if (kfg in VolumeKeys) {
            const columnCode = VolumeKeys[kfg];
            const columnDisplayName = keyFigures.display_name;
            columnGroups.push({'id':columnCode, 'display_name':columnDisplayName});
        } else { //todo need to check for types other than spends and volumes such as gross price, will be coming soon
            let groupedSpends = groupSpendsByType(eventConditions);
            if (kfg in groupedSpends) {
                const spendArray = groupedSpends[kfg];
                columnGroups.push(...spendArray);
            }
        }
    }
    return columnGroups;
}

function groupSpendsByType(eventConditions) {
    const conditionTypeGroups = {};
    eventConditions.forEach(condition => {
        const columnCode = `condition_data.${condition.condition.code}`;
        const columnDisplayName = `${condition.condition.code}: ${condition.condition.description} - ${condition.condition.rebate_pricing}`;
        const conditionType = condition.condition.rebate_pricing;
        if (!(conditionType in conditionTypeGroups)) {
            conditionTypeGroups[conditionType] = [];
        }
        conditionTypeGroups[conditionType].push({'id':columnCode, 'display_name':columnDisplayName})

    });
    return conditionTypeGroups;
};

export function getConditionCodeToRebate(eventConditions) {
    let conditionMap = {};
    eventConditions.forEach(condition => {
        conditionMap[condition.condition.code] = condition.condition.rebate_pricing;
    });
    return conditionMap;
};

export function getEditable(key, value, kfPlanningConfig) {
    //TODO need to remove this baseline volume check later so that it's dependent completely on the planning config
    return kfPlanningConfig['is_editable'] && value !== key.baseline_volume;
};

export function getCellEditor(value) {
    if(value.includes(VolumeKeys.gross_price)){
        return CellEditor.textCellEditor
    }
    if (value.includes(SpendType.FX) || value.includes(SpendType.VR) || value.includes(SpendType.OI)) {
        return CellEditor.decimalCellEditor;
    }
    return CellEditor.numericCellEditor;
};

export function getAggFunc(configData) {
    const verticalAggRule = configData['vertical_agg'];
    const varType = configData['kf_var_type'];

    if (varType === VarType.int) {
        if (verticalAggRule === 'sum') {
            return 'sum';
        }
        if (verticalAggRule === 'avg') {
            return 'avg';
        }
    }

    if (varType === VarType.float || varType === VarType.char) {
        if (verticalAggRule === 'sum') {
            return sum;
        }
        if (verticalAggRule === 'avg') {
            return avg;
        }
    }

    return 'sum';
};