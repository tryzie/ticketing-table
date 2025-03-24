import React from 'react';
import sortHeaderIcon from '../images/sort-header.svg';
import addIcon from '../images/add-icon.svg';
import trashIcon from '../images/trash-can-icon.svg';
import cancelIcon from '../images/cancel-icon.svg';

const SortPopup = ({ sortCriteria, setSortCriteria, onClose, onSubmit }) => {
    const fields = [
        { value: "UserName", label: "Username" },
        { value: "FirstName", label: "First Name" },
        { value: "LastName", label: "Last Name" },
        { value: "MiddleName", label: "Middle Name" },
        { value: "Gender", label: "Gender" },
        { value: "Age", label: "Age" }
    ];

    const addSort = () => {
        setSortCriteria([...sortCriteria, { field: "UserName", direction: "asc" }]);
    };

    const updateSort = (index, key, value) => {
        const newCriteria = [...sortCriteria];
        newCriteria[index][key] = value;
        setSortCriteria(newCriteria);
    };

    const removeSort = (index) => {
        setSortCriteria(sortCriteria.filter((_, i) => i !== index));
    };

    return (
        <div className="popup" style={{ display: 'block' }}>
            <div className="popup-content">
                <div className="popup-header">
                    <div className="popup-header-left">
                        <img src={sortHeaderIcon} alt="" />
                        <h3>Sort Table</h3>
                    </div>
                    <button className="cancel" onClick={onClose}>
                        <img src={cancelIcon} alt="close" />
                    </button>
                </div>
                <div id="sort-fields">
                    {sortCriteria.map((sort, index) => (
                        <div className="sort-field" key={index}>
                            <select
                                value={sort.field}
                                onChange={(e) => updateSort(index, 'field', e.target.value)}
                            >
                                {fields.map(field => (
                                    <option key={field.value} value={field.value}>{field.label}</option>
                                ))}
                            </select>
                            <select
                                value={sort.direction}
                                onChange={(e) => updateSort(index, 'direction', e.target.value)}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                            <button onClick={() => removeSort(index)}>
                                <img src={trashIcon} alt="delete" />
                            </button>
                        </div>
                    ))}
                </div>
                <button id="add-sort" onClick={addSort}>
                    <img src={addIcon} alt="add" />Add Sorter
                </button>
                <div className="popup-footer">
                    <button id="reset-sort" onClick={() => setSortCriteria([])}>Reset Sort</button>
                    <button id="submit-sort" onClick={onSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default SortPopup;