import { useState } from "react";
import Select from "react-select";

const Filters = ({ columnFilters, setColumnFilters, filterOptions }) => {
  const selectedFilter = columnFilters.find((f) => f.id) || {};
  const selectedFilterKey = selectedFilter?.id || "";

  const [filterField, setFilterField] = useState(
    filterOptions.find((opt) => opt.value === selectedFilterKey) || null
  );

  const filterValue =
    columnFilters.find((f) => f.id === filterField?.value)?.value || "";

  const onFilterChange = (id, value) => {
    setColumnFilters((prev) =>
      prev
        .filter((f) => f.id !== id)
        .concat(value !== "" ? { id, value } : [])
    );
  };

  const handleFieldChange = (selectedOption) => {
    setFilterField(selectedOption);
    if (selectedOption) {
      onFilterChange(selectedOption.value, "");
    }
  };

  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      <Select
        options={filterOptions}
        value={filterField}
        onChange={handleFieldChange}
        placeholder="Виберіть поле"
        isClearable
        styles={{
          container: (provided) => ({ ...provided, maxWidth: "200px" }),
        }}
      />

      {filterField && (
        <>
          {filterField.value === "isAdmin" ? (
            <select
              value={filterValue}
              onChange={(e) => {
                const value = e.target.value === "true" ? true : e.target.value === "false" ? false : "";
                onFilterChange(filterField.value, value);
              }}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                maxWidth: "200px",
              }}
            >
              <option value="">Всі</option>
              <option value="true">Адміністратор</option>
              <option value="false">Працівник</option>
            </select>
          ) : (
            <input
              type="text"
              placeholder={`Фільтр за ${filterField.label}`}
              value={filterValue}
              onChange={(e) =>
                onFilterChange(filterField.value, e.target.value)
              }
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                maxWidth: "200px",
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Filters;
