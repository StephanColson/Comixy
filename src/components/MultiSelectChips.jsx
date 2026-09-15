import { Combobox } from "@headlessui/react";

export function MultiSelectChips({
  label,
  options,
  getOptionLabel,
  selections,
  onChange,
  searchValue,
  onSearchChange,
  placeholder,
}) {
  const filtered = (options ?? []).filter((o) =>
    getOptionLabel(o)
      .toLowerCase()
      .includes((searchValue || "").toLowerCase()),
  );

  function addExisting(option) {
    if (selections.some((s) => s.id === option.id)) return;
    onChange([...selections, { id: option.id, name: getOptionLabel(option) }]);
    onSearchChange("");
  }

  function addNew(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (selections.some((s) => s.name.toLowerCase() === trimmed.toLowerCase()))
      return;
    onChange([...selections, { id: null, name: trimmed }]);
    onSearchChange("");
  }

  function remove(index) {
    onChange(selections.filter((_, i) => i !== index));
  }

  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <Combobox
        value={null}
        onChange={(opt) =>
          opt?.__create ? addNew(opt.name) : addExisting(opt)
        }
      >
        <Combobox.Input
          className="form-control"
          value={searchValue}
          placeholder={placeholder}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Combobox.Options className="list-group position-absolute z-3">
          {filtered.slice(0, 5).map((opt) => (
            <Combobox.Option
              key={opt.id}
              value={opt}
              className="list-group-item list-group-item-action"
            >
              {getOptionLabel(opt)}
            </Combobox.Option>
          ))}
          {searchValue?.trim() &&
            !filtered.some(
              (o) =>
                getOptionLabel(o).toLowerCase() ===
                searchValue.trim().toLowerCase(),
            ) && (
              <Combobox.Option
                value={{ __create: true, name: searchValue.trim() }}
                className="list-group-item list-group-item-action text-primary"
              >
                Create "{searchValue.trim()}"
              </Combobox.Option>
            )}
        </Combobox.Options>
      </Combobox>

      {selections.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-2">
          {selections.map((s, i) => (
            <span
              key={`${s.id ?? "new"}-${s.name}-${i}`}
              onClick={() => remove(i)}
              style={{
                background: "#1a1500",
                color: "#d4a520",
                fontSize: "0.8rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                cursor: "pointer",
                border: "1px solid #d4a520",
              }}
            >
              {s.name} ✕
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
