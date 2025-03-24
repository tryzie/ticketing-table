import React from 'react';
import filterHeaderIcon from '../images/filter-header.svg';
import filterPlusIcon from '../images/filter-with-plus.svg';
import trashIcon from '../images/trash-can-icon.svg';
import cancelIcon from '../images/cancel-icon.svg';

const FilterPopup = ({ filterCriteria, setFilterCriteria, onClose, onSubmit }) => {
    const fields = [
        { value: "UserName", label: "Username" },
        { value: "FirstName", label: "First Name" },
        { value: "LastName", label: "Last Name" },
        { value: "MiddleName", label: "Middle Name" },
        { value: "Gender", label: "Gender" },
        { value: "Age", label: "Age" }
    ];

    const stringOperators = [
        { value: "eq", label: "Equal To" },
        { value: "startsWith", label: "Starts With" },
        { value: "endsWith", label: "Ends With" },
        { value: "includes", label: "Includes" }
    ];

    const numericOperators = [
        { value: "eq", label: "Equal To" },
        { value: "gt", label: "Greater Than" },
        { value: "lt", label: "Less Than" }
    ];

    const addFilter = () => {
        setFilterCriteria([...filterCriteria, { field: "UserName", operator: "eq", value: "" }]);
    };

    const updateFilter = (index, key, value) => {
        const newCriteria = [...filterCriteria];
        newCriteria[index][key] = value;
        if (key === 'field') {
            newCriteria[index].operator = value === "Age" ? "eq" : "eq";
        }
        setFilterCriteria(newCriteria);
    };

    const removeFilter = (index) => {
        setFilterCriteria(filterCriteria.filter((_, i) => i !== index));
    };

    return (
        <div className="popup" style={{ display: 'block' }}>
            <div className="popup-content">
                <div className="popup-header">
                    <div className="popup-header-left">
                        <img src={filterHeaderIcon} alt="" />
                        <h3>Filter Table</h3>
                    </div>
                    <button className="cancel" onClick={onClose}>
                        <img src={cancelIcon} alt="close" />
                    </button>
                </div>
                <div id="filter-fields">
                    {filterCriteria.map((filter, index) => (
                        <div className="filter-field" key={index}>
                            <select
                                className="field-select"
                                value={filter.field}
                                onChange={(e) => updateFilter(index, 'field', e.target.value)}
                            >
                                {fields.map(field => (
                                    <option key={field.value} value={field.value}>{field.label}</option>
                                ))}
                            </select>
                            <select
                                className="operator-select"
                                value={filter.operator}
                                onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                            >
                                {(filter.field === "Age" ? numericOperators : stringOperators).map(op => (
                                    <option key={op.value} value={op.value}>{op.label}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={filter.value}
                                onChange={(e) => updateFilter(index, 'value', e.target.value)}
                                placeholder="Value"
                            />
                            <button onClick={() => removeFilter(index)}>
                                <img src={trashIcon} alt="delete" />
                            </button>
                        </div>
                    ))}
                </div>
                <button id="add-filter" onClick={addFilter}>
                    <img src={filterPlusIcon} alt="filter" />Add Filter
                </button>
                <div className="popup-footer">
                    <button id="reset-filter" onClick={() => setFilterCriteria([])}>Reset Filter</button>
                    <button id="submit-filter" onClick={onSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default FilterPopup;