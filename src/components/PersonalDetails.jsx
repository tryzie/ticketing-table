import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SortPopup from './SortPopup';
import FilterPopup from './FilterPopup';
import sortIcon from '../images/sort-icon.svg';
import filterIcon from '../images/filter-icon.svg';
import refreshIcon from '../images/refresh-icon.svg';
import closeIcon from '../images/close.svg';

const PersonalDetails = () => {
    const API_URL = "https://corsproxy.io/?http://services.odata.org/TripPinRESTierService/People";
    const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(PAGE_SIZE_OPTIONS[1]);
    const [totalCount, setTotalCount] = useState(0);
    // Use applied criteria for actual data fetching
    const [appliedSortCriteria, setAppliedSortCriteria] = useState([]);
    const [appliedFilterCriteria, setAppliedFilterCriteria] = useState([]);
    // Temporary criteria for popup editing
    const [tempSortCriteria, setTempSortCriteria] = useState([]);
    const [tempFilterCriteria, setTempFilterCriteria] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSortPopup, setShowSortPopup] = useState(false);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const skip = (currentPage - 1) * itemsPerPage;
        let query = `${API_URL}?$top=${itemsPerPage}&$skip=${skip}&$select=UserName,FirstName,LastName,MiddleName,Gender,Age&$count=true`;

        if (appliedSortCriteria.length > 0) {
            const orderBy = appliedSortCriteria.map(c => `${c.field} ${c.direction}`).join(",");
            query += `&$orderby=${orderBy}`;
        }

        if (appliedFilterCriteria.length > 0) {
            const filters = appliedFilterCriteria.map(c => {
                const { field, value, operator } = c;
                if (["UserName", "FirstName", "LastName", "MiddleName", "Gender"].includes(field)) {
                    switch (operator) {
                        case "eq": return `tolower(${field}) eq tolower('${value}')`;
                        case "startsWith": return `startswith(tolower(${field}), tolower('${value}'))`;
                        case "endsWith": return `endswith(tolower(${field}), tolower('${value}'))`;
                        case "includes": return `contains(tolower(${field}), tolower('${value}'))`;
                        default: return "";
                    }
                } else if (field === "Age") {
                    switch (operator) {
                        case "eq": return `${field} eq ${value}`;
                        case "gt": return `${field} gt ${value}`;
                        case "lt": return `${field} lt ${value}`;
                        default: return "";
                    }
                }
                return "";
            }).filter(f => f).join(" and ");

            if (filters) query += `&$filter=${filters}`;
        }

        try {
            const response = await axios.get(query);
            setData(response.data.value || []);
            setTotalCount(response.data["@odata.count"] || 0);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load data. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, appliedSortCriteria, appliedFilterCriteria]);

    // Only fetch when page or items per page change, or manually triggered
    useEffect(() => {
        fetchData();
    }, [fetchData, currentPage, itemsPerPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const resetAll = () => {
        setAppliedSortCriteria([]);
        setAppliedFilterCriteria([]);
        setTempSortCriteria([]);
        setTempFilterCriteria([]);
        setCurrentPage(1);
        fetchData();
    };

    const handleSortSubmit = () => {
        setAppliedSortCriteria([...tempSortCriteria]);
        setShowSortPopup(false);
        fetchData();
    };

    const handleFilterSubmit = () => {
        setAppliedFilterCriteria([...tempFilterCriteria]);
        setShowFilterPopup(false);
        fetchData();
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div id="table-container">
            <div className="table-controls">
                <button className={appliedSortCriteria.length > 0 ? "active-btn" : "action-btn sort-btn"}
                        onClick={() => {
                            setTempSortCriteria([...appliedSortCriteria]);
                            setShowSortPopup(true);
                        }}>
                    {appliedSortCriteria.length > 0 ? (
                        <>
                            {appliedSortCriteria.length} <u>Sort</u>
                            <span className="reset-icon" onClick={(e) => {
                                e.stopPropagation();
                                setAppliedSortCriteria([]);
                                fetchData();
                            }}>
                <img src={closeIcon} alt="close" />
              </span>
                        </>
                    ) : (
                        <>
                            <img src={sortIcon} alt="sort" /> Sort
                        </>
                    )}
                </button>
                <button className={appliedFilterCriteria.length > 0 ? "active-btn" : "action-btn filter-btn"}
                        onClick={() => {
                            setTempFilterCriteria([...appliedFilterCriteria]);
                            setShowFilterPopup(true);
                        }}>
                    {appliedFilterCriteria.length > 0 ? (
                        <>
                            {appliedFilterCriteria.length} <u>Filter</u>
                            <span className="reset-icon" onClick={(e) => { e.stopPropagation(); setAppliedFilterCriteria([]); fetchData(); }}>
                <img src={closeIcon} alt="close" />
              </span>
                        </>
                    ) : (
                        <>
                            <img src={filterIcon} alt="filter" /> Filter
                        </>
                    )}
                </button>
                <button className="action-btn refresh-btn" onClick={resetAll}>
                    <img src={refreshIcon} alt="refresh" /> Refresh
                </button>
            </div>

            {loading && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            )}

            {error && (
                <div style={{ textAlign: 'center', color: 'red', padding: '20px' }}>
                    {error}
                </div>
            )}

            {!loading && !error && (
                <table>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Middle Name</th>
                        <th>Gender</th>
                        <th>Age</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.length > 0 ? (
                        data.map((person) => (
                            <tr key={person.UserName}>
                                <td>{person.UserName || "N/A"}</td>
                                <td>{person.FirstName || "N/A"}</td>
                                <td>{person.LastName || "N/A"}</td>
                                <td>{person.MiddleName || "N/A"}</td>
                                <td>{person.Gender || "N/A"}</td>
                                <td>{person.Age || "N/A"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>No data available</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}

            {!loading && !error && (
                <div className="pagination">
                    <button className="page-btn"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button className="page-btn"
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                    </button>
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        {PAGE_SIZE_OPTIONS.map(size => (
                            <option key={size} value={size}>{size} per page</option>
                        ))}
                    </select>
                </div>
            )}

            {showSortPopup && (
                <SortPopup
                    sortCriteria={tempSortCriteria}
                    setSortCriteria={setTempSortCriteria}
                    onClose={() => setShowSortPopup(false)}
                    onSubmit={handleSortSubmit}
                />
            )}
            {showFilterPopup && (
                <FilterPopup
                    filterCriteria={tempFilterCriteria}
                    setFilterCriteria={setTempFilterCriteria}
                    onClose={() => setShowFilterPopup(false)}
                    onSubmit={handleFilterSubmit}
                />
            )}
        </div>
    );
};

export default PersonalDetails;