import { Combobox } from "@headlessui/react";
import { Row, Col } from "react-bootstrap";
import { MultiSelectChips } from "./MultiSelectChips.jsx";

export function EditionSection(props) {
  const {
    editionForm,
    setEditionForm,
    filteredFormat,
    filteredLanguage,
    filteredPrintType,
    searchQuery,
    setSearchQuery,
    currentYear,
    organizations,
    compendium,
  } = props;

  return (
    <div className="d-flex justify-content-center">
      <Row className="m-2">
        <Row className="justify-content-center mb-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Col lg={2} key={i} className="text-center">
              <label className="form-label">
                {i === 0 ? "Main Cover" : `Image ${i + 1}`}
                {i > 0 && <span className="text-warning"> (optional)</span>}
              </label>

              {(editionForm.imageFiles[i] ||
                editionForm.existingImgURLs?.[i]) && (
                <img
                  src={
                    editionForm.imageFiles[i]
                      ? URL.createObjectURL(editionForm.imageFiles[i])
                      : editionForm.existingImgURLs[i]
                  }
                  alt={`preview ${i + 1}`}
                  className="img-fluid mb-2 rounded"
                  style={{ maxHeight: "9.375rem", objectFit: "contain" }}
                />
              )}

              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => {
                  const file = e.target.files[0] || null;
                  const updated = [...editionForm.imageFiles];
                  updated[i] = file;
                  setEditionForm((prev) => ({ ...prev, imageFiles: updated }));
                }}
              />
            </Col>
          ))}
        </Row>

        <Col lg={12}>
          <MultiSelectChips
            label={
              <>
                Collection: <span className="text-warning">(optional)</span>
              </>
            }
            options={compendium ?? []}
            getOptionLabel={(c) => c.title}
            selections={editionForm.compendiumSelections}
            onChange={(selections) =>
              setEditionForm((prev) => ({
                ...prev,
                compendiumSelections: selections,
              }))
            }
            searchValue={searchQuery.compendium || ""}
            onSearchChange={(value) =>
              setSearchQuery((prev) => ({ ...prev, compendium: value }))
            }
            placeholder="Search or create a collection..."
          />
        </Col>

        <Col sm={6} lg={3}>
          <label className="form-label">Format:</label>

          <Combobox
            value={
              filteredFormat.find((f) => f.id === editionForm.format) ??
              (editionForm.formatName
                ? { id: null, label: editionForm.formatName }
                : null)
            }
            onChange={(opt) => {
              setEditionForm((prev) => ({
                ...prev,
                format: opt ? opt.id : null,
                formatName: opt?.id ? "" : prev.formatName,
              }));
            }}
          >
            <Combobox.Input
              className="form-control"
              displayValue={(opt) => opt?.label ?? editionForm.formatName}
              placeholder="Select or type format…"
              onChange={(e) =>
                setEditionForm((prev) => ({
                  ...prev,
                  format: null,
                  formatName: e.target.value,
                }))
              }
            />

            <Combobox.Options className="list-group position-absolute z-3">
              {filteredFormat.slice(0, 5).map((opt) => (
                <Combobox.Option
                  key={opt.id}
                  value={opt}
                  className="list-group-item list-group-item-action"
                >
                  {opt.label}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox>
        </Col>

        <Col sm={6} lg={3}>
          <label className="form-label">Language:</label>
          <Combobox
            value={
              filteredLanguage.find((l) => l.id === editionForm.language) ??
              (editionForm.languageName
                ? { id: null, label: editionForm.languageName }
                : null)
            }
            onChange={(opt) => {
              setEditionForm((prev) => ({
                ...prev,
                language: opt ? opt.id : null,
                languageName: opt?.id ? "" : prev.languageName,
              }));
            }}
          >
            <Combobox.Input
              className="form-control"
              displayValue={(opt) => opt?.label ?? editionForm.languageName}
              placeholder="Select or type language…"
              onChange={(e) =>
                setEditionForm((prev) => ({
                  ...prev,
                  language: null,
                  languageName: e.target.value,
                }))
              }
            />

            <Combobox.Options className="list-group position-absolute z-3">
              {filteredLanguage.slice(0, 5).map((opt) => (
                <Combobox.Option
                  key={opt.id}
                  value={opt}
                  className="list-group-item list-group-item-action"
                >
                  {opt.label}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox>
        </Col>

        <Col sm={6} lg={3}>
          <label className="form-label">Print:</label>
          <Combobox
            value={
              filteredPrintType.find((p) => p.id === editionForm.printType) ??
              (editionForm.printTypeName
                ? { id: null, label: editionForm.printTypeName }
                : null)
            }
            onChange={(opt) => {
              setEditionForm((prev) => ({
                ...prev,
                printType: opt ? opt.id : null,
                printTypeName: opt?.id ? "" : prev.printTypeName,
              }));
            }}
          >
            <Combobox.Input
              className="form-control"
              displayValue={(opt) => opt?.label ?? editionForm.printTypeName}
              placeholder="Type or Select print type…"
              onChange={(e) =>
                setEditionForm((prev) => ({
                  ...prev,
                  printType: null,
                  printTypeName: e.target.value,
                }))
              }
            />

            <Combobox.Options className="list-group position-absolute z-3">
              {filteredPrintType.slice(0, 5).map((opt) => (
                <Combobox.Option
                  key={opt.id}
                  value={opt}
                  className="list-group-item list-group-item-action"
                >
                  {opt.label}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox>
        </Col>

        <Col sm={7} lg={3}>
          <MultiSelectChips
            label="Publisher:"
            options={organizations ?? []}
            getOptionLabel={(o) => o.name}
            selections={editionForm.organizationSelections}
            onChange={(selections) =>
              setEditionForm((prev) => ({
                ...prev,
                organizationSelections: selections,
              }))
            }
            searchValue={searchQuery.publisher || ""}
            onSearchChange={(value) =>
              setSearchQuery((prev) => ({ ...prev, publisher: value }))
            }
            placeholder="Search or create a publisher..."
          />
        </Col>

        <Col sm={6} lg={3}>
          <label className="form-label">
            Collectie Nr.: <span className="text-warning">(optional)</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Number within the collection..."
            value={editionForm.numberInCollection ?? ""}
            onChange={(e) =>
              setEditionForm((prev) => ({
                ...prev,
                numberInCollection: e.target.value,
              }))
            }
          />
        </Col>

        <Col sm={5} lg={2}>
          <label className="form-label">Published:</label>
          <input
            type="number"
            className="form-control"
            value={editionForm.printYear}
            min={1837}
            max={currentYear}
            onChange={(e) => {
              const inputYear = e.target.value;

              if (inputYear === "") {
                setEditionForm((prev) => ({ ...prev, printYear: "" }));
                return;
              }

              if (!/^\d{0,4}$/.test(inputYear)) return;

              setEditionForm((prev) => ({
                ...prev,
                printYear: inputYear,
              }));
            }}
            placeholder="year published"
          />
        </Col>

        <Col lg={12}>
          <label className="form-label">
            Spine: <span className="text-warning">(optional)</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Spine text..."
            value={editionForm.spine ?? ""}
            onChange={(e) =>
              setEditionForm((prev) => ({ ...prev, spine: e.target.value }))
            }
          />
        </Col>

        <Col lg={12}>
          <label className="form-label">
            Notes: <span className="text-warning">(optional)</span>
          </label>
          <textarea
            className="form-control"
            placeholder="Extra notes about this edition..."
            rows={3}
            value={editionForm.note ?? ""}
            onChange={(e) =>
              setEditionForm((prev) => ({ ...prev, note: e.target.value }))
            }
          />
        </Col>
      </Row>
    </div>
  );
}
