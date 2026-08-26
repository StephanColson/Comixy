import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { updateEdition, uploadFile } from "../api/editionInfo.js";
import { ContributorSection } from "./ContributorSection.jsx";
import {
  addComicContributor,
  deleteComicContributor,
} from "../api/comicContributer.js";
import { addPerson } from "../api/personInfo.js";
import { addRole } from "../api/roleInfo.js";
import { useEditionFiltering } from "./EditionFiltering.jsx";
import { EditionSection } from "./EditionSection.jsx";
import { Combobox } from "@headlessui/react";
import { updateComic } from "../api/comicInfo.js";
import { addOrganization } from "../api/organizationInfo.js";
import { addCompendium } from "../api/compendiumInfo.js";
import { updateSerie } from "../api/serieInfo.js";
import { conditions } from "../pages/MyLibrary.jsx";

export function EditEditionModal(props) {
  const {
    edition,
    onClose,
    organizations,
    peoples,
    roles,
    comicContributors,
    editions,
    comic,
    series,
    compendium,
    universes,
  } = props;

  const currentSerie = series.find((s) => s.id === comic?.serieID);

  const [comicSerie, setComicSerie] = useState({
    serieID: comic?.serieID ?? null,
    universeID: currentSerie?.universeID ?? null,
  });

  const [comicBookNumber, setComicBookNumber] = useState(
    comic?.bookNumber ?? "",
  );
  const [comicPrice, setComicPrice] = useState(comic?.price ?? "");

  const [comicTitle, setComicTitle] = useState(comic?.title ?? "");

  const [editionForm, setEditionForm] = useState({
    comicID: edition.comicID,
    printYear: edition.printYear || "",
    format: edition.format || null,
    formatName: "",
    printType: edition.printType || null,
    printTypeName: "",
    organizationID: edition.organizationID || null,
    organizationName: "",
    imageFiles: [null, null, null, null, null],
    existingImgURLs: edition.imgURLs ?? [],
    compendiumID: edition.compendiumID ?? null,
    compendiumName: "",
    spine: edition.spine ?? "",
    note: edition.note ?? "",
    condition: edition.condition || null,
  });

  const [contributors, setContributors] = useState(
    comicContributors
      .filter((cc) => cc.editionID === edition.id)
      .map((cc) => ({
        peopleID: cc.peopleID,
        peopleName: peoples.find((p) => p.id === cc.peopleID)?.name || "",
        roleID: cc.roleID,
        roleName: roles.find((r) => r.id === cc.roleID)?.type || "",
      })),
  );

  const [contributorDraft, setContributorDraft] = useState({
    peopleID: null,
    peopleName: "",
    roleID: null,
    roleName: "",
  });

  const [searchContributor, setSearchContributor] = useState({
    person: "",
    role: "",
  });

  const filteredPersons = peoples.filter((p) =>
    p.name.toLowerCase().includes(searchContributor.person.toLowerCase()),
  );

  const filteredRoles = roles.filter((r) =>
    r.type.toLowerCase().includes(searchContributor.role.toLowerCase()),
  );

  const [uploading, setUploading] = useState(false);

  async function handleSave() {
    try {
      const normalize = (str) => (str || "").trim().toLowerCase();

      const typedFormat = normalize(editionForm.formatName);
      const existingFormat = editions
        .map((e) => e.format)
        .filter(Boolean)
        .find((f) => normalize(f) === typedFormat);

      const finalFormat =
        existingFormat ||
        editionForm.format ||
        (typedFormat ? editionForm.formatName.trim() : null);

      const typedPrintType = normalize(editionForm.printTypeName);
      const existingPrintType = editions
        .map((e) => e.printType)
        .filter(Boolean)
        .find((pt) => normalize(pt) === typedPrintType);

      const finalPrintType =
        existingPrintType ||
        editionForm.printType ||
        (typedPrintType ? editionForm.printTypeName.trim() : null);

      const typedPublisher = normalize(editionForm.organizationName);
      const existingPublisher = organizations.find(
        (o) => normalize(o.name) === typedPublisher,
      );

      const publisherID =
        editionForm.organizationID ||
        (existingPublisher
          ? existingPublisher.id
          : typedPublisher
            ? await addOrganization({
                name: editionForm.organizationName.trim(),
              })
            : null);

      const typedCompendium = normalize(editionForm.compendiumName ?? "");
      const existingCompendium = compendium.find(
        (c) => normalize(c.title) === typedCompendium,
      );

      const compendiumID =
        editionForm.compendiumID ||
        (existingCompendium
          ? existingCompendium.id
          : typedCompendium
            ? await addCompendium({
                title: editionForm.compendiumName.trim(),
                description: "",
              })
            : null);

      setUploading(true);
      const imgURLs = await Promise.all(
        [0, 1, 2, 3, 4].map((i) =>
          editionForm.imageFiles[i]
            ? uploadFile(editionForm.imageFiles[i])
            : (editionForm.existingImgURLs[i] ?? null),
        ),
      ).then((urls) => urls.filter(Boolean));
      setUploading(false);

      await updateEdition({
        ...edition,
        printYear: editionForm.printYear || null,
        format: finalFormat,
        printType: finalPrintType,
        organizationID: publisherID,
        organizationName: editionForm.organizationName.trim(),
        imgURLs,
        compendiumID: compendiumID ?? null,
        spine: editionForm.spine?.trim() || null,
        note: editionForm.note?.trim() || null,
        condition: editionForm.condition || null,
      });

      const old = comicContributors.filter((cc) => cc.editionID === edition.id);
      await Promise.all(old.map((cc) => deleteComicContributor(cc.id)));

      await Promise.all(
        contributors.map(async (c) => {
          const typedPerson = normalize(c.peopleName);
          const existingPerson = peoples.find(
            (p) => normalize(p.name) === typedPerson,
          );

          const peopleID =
            c.peopleID ||
            (existingPerson
              ? existingPerson.id
              : typedPerson
                ? await addPerson({ name: c.peopleName.trim() })
                : null);

          const typedRole = normalize(c.roleName);
          const existingRole = roles.find(
            (r) => normalize(r.type) === typedRole,
          );

          const roleID =
            c.roleID ||
            (existingRole
              ? existingRole.id
              : typedRole
                ? await addRole({ type: c.roleName.trim() })
                : null);

          return addComicContributor({
            comicID: edition.comicID,
            editionID: edition.id,
            peopleID,
            roleID,
          });
        }),
      );

      const serieChanged = comicSerie.serieID !== comic.serieID;
      const titleChanged = comicTitle.trim() !== comic.title;

      if (
        serieChanged ||
        titleChanged ||
        comicBookNumber != comic.bookNumber ||
        comicPrice != comic.price
      ) {
        await updateComic({
          ...comic,
          serieID: comicSerie.serieID,
          title: comicTitle.trim(),
          bookNumber: comicBookNumber ? Number(comicBookNumber) : null,
          price: comicPrice ? Number(comicPrice) : null,
        });
      }

      const targetSerie = series.find((s) => s.id === comicSerie.serieID);
      if (targetSerie && targetSerie.universeID !== comicSerie.universeID) {
        await updateSerie({
          ...targetSerie,
          universeID: comicSerie.universeID,
        });
      }

      onClose();
    } catch (err) {
      setUploading(false);
      console.error("Edit save error:", err);
    }
  }

  const {
    searchQuery,
    setSearchQuery,
    filteredFormat,
    filteredPrintType,
    filteredPublishers,
  } = useEditionFiltering({
    editions,
    organizations,
    peoples,
    roles,
  });

  const filteredSerie = series.filter((s) =>
    s.title.toLowerCase().includes((searchQuery.serie || "").toLowerCase()),
  );

  return (
    <Modal show onHide={onClose} size={"lg"} dialogClassName="modal-bg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Edition</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Universe:</Form.Label>
            <Form.Select
              value={comicSerie.universeID ?? ""}
              onChange={(e) =>
                setComicSerie((prev) => ({
                  ...prev,
                  universeID: e.target.value || null,
                }))
              }
            >
              <option value="">— No universe —</option>
              {universes.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Serie:</Form.Label>

            <Combobox
              value={series.find((s) => s.id === comicSerie.serieID) || null}
              onChange={(opt) => {
                const selectedSerie = series.find((s) => s.id === opt?.id);
                setComicSerie({
                  serieID: opt?.id || null,
                  universeID: selectedSerie?.universeID ?? null,
                });
              }}
            >
              <Combobox.Input
                className="form-control"
                placeholder="Select a serie…"
                displayValue={(opt) => opt?.title ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery((prev) => ({ ...prev, serie: value }));
                  if (!value.trim()) {
                    setComicSerie({
                      serieID: null,
                      universeID: null,
                    });
                  }
                }}
              />

              <Combobox.Options className="list-group position-absolute z-3">
                {filteredSerie.slice(0, 5).map((serie) => (
                  <Combobox.Option
                    key={serie.id}
                    value={serie}
                    className="list-group-item list-group-item-action"
                  >
                    {serie.title}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>

            <div className="d-flex gap-2 align-items-end mt-4">
              <div className="flex-grow-1">
                <Form.Label>Comic Title:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Rename comic..."
                  value={comicTitle}
                  onChange={(e) => setComicTitle(e.target.value)}
                />
              </div>
              <div>
                <Form.Label>Nr.</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Nr..."
                  value={comicBookNumber}
                  onChange={(e) => setComicBookNumber(e.target.value)}
                />
              </div>
            </div>
          </Form.Group>

          <EditionSection
            editionForm={editionForm}
            setEditionForm={setEditionForm}
            filteredFormat={filteredFormat}
            filteredPrintType={filteredPrintType}
            filteredPublishers={filteredPublishers}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentYear={new Date().getFullYear()}
            organizations={organizations}
            compendium={compendium}
          />

          <Form.Group className="mb-3">
            <Form.Label>Condition</Form.Label>
            <Form.Select
              value={editionForm.condition ?? ""}
              onChange={(e) =>
                setEditionForm((prev) => ({
                  ...prev,
                  condition: e.target.value || null,
                }))
              }
              style={{
                background: "#1a1a1a",
                border: "1px solid #333",
                color:
                  conditions.find((c) => c.value === editionForm.condition)
                    ?.color ?? "#888",
              }}
            >
              <option value="">— not set —</option>
              {conditions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <ContributorSection
            contributorDraft={contributorDraft}
            setContributorDraft={setContributorDraft}
            contributors={contributors}
            setContributors={setContributors}
            filteredPersons={filteredPersons}
            filteredRoles={filteredRoles}
            peoples={peoples}
            roles={roles}
            searchQuery={searchContributor}
            setSearchQuery={setSearchContributor}
          />

          <Form.Group className="mt-3 mx-2">
            <Form.Label>
              Price: <span className="text-warning">(optional)</span>
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="Price..."
              value={comicPrice}
              onChange={(e) => setComicPrice(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={uploading}>
          {uploading ? "Uploading..." : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
