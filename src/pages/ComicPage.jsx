import { Section } from "../components/Section.jsx";
import { Comics } from "../components/Comics.jsx";
import { ComicFiltersSidebar } from "../components/ComicFiltersSidebar.jsx";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Pagination from "rc-pagination";
import { updateSerie } from "../api/serieInfo.js";
import { deleteComic } from "../api/comicInfo.js";

function useSlideSize() {
  const [slideSize, setSlideSize] = useState(window.innerWidth < 768 ? 6 : 30);

  useEffect(() => {
    const handler = () => setSlideSize(window.innerWidth < 768 ? 4 : 6);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return slideSize;
}

function comicMatchesFilters(comic, editions, comicContributors, filters) {
  if (!filters) return true;

  if (filters.bookNumberQuery) {
    if (
      !comic.bookNumber
        ?.toString()
        .toLowerCase()
        .includes(filters.bookNumberQuery)
    ) {
      return false;
    }
  }

  if (filters.personIDs.length > 0) {
    const hasMatchingContributor = (comicContributors ?? []).some(
      (cc) =>
        cc.comicID === comic.id && filters.personIDs.includes(cc.peopleID),
    );
    if (!hasMatchingContributor) return false;
  }

  const hasEditionFilters =
    filters.formats.length > 0 ||
    filters.publisherIDs.length > 0 ||
    filters.language ||
    filters.yearFrom != null ||
    filters.yearTo != null ||
    filters.compendiumIDs.length > 0;

  if (hasEditionFilters) {
    const comicEditions = (editions ?? []).filter(
      (e) => e.comicID === comic.id,
    );
    const hasMatchingEdition = comicEditions.some((ed) => {
      if (
        filters.formats.length > 0 &&
        !filters.formats.includes(ed.format) &&
        !filters.formats.includes(ed.printType)
      ) {
        return false;
      }
      if (
        filters.publisherIDs.length > 0 &&
        !filters.publisherIDs.includes(ed.organizationID)
      ) {
        return false;
      }
      if (filters.language && ed.language !== filters.language) return false;
      if (filters.yearFrom != null && Number(ed.printYear) < filters.yearFrom)
        return false;
      if (filters.yearTo != null && Number(ed.printYear) > filters.yearTo)
        return false;
      if (
        filters.compendiumIDs.length > 0 &&
        !filters.compendiumIDs.includes(ed.compendiumID)
      ) {
        return false;
      }
      return true;
    });
    if (!hasMatchingEdition) return false;
  }

  return true;
}

export function ComicPage(props) {
  const {
    comics,
    editions,
    selectedSerieID,
    onSelectComic,
    series,
    comicContributors,
    organizations,
    peoples,
    compendium,
  } = props;
  const slideSize = useSlideSize();

  const [appliedFilters, setAppliedFilters] = useState(null);

  const baseComics = selectedSerieID
    ? [...comics].filter((c) => c.serieID === selectedSerieID)
    : [...comics];

  const baseComicIDs = new Set(baseComics.map((c) => c.id));
  const serieEditions = (editions ?? []).filter((e) =>
    baseComicIDs.has(e.comicID),
  );

  const usedPublisherIDs = new Set(
    serieEditions.map((e) => e.organizationID).filter(Boolean),
  );
  const scopedOrganizations = (organizations ?? []).filter((o) =>
    usedPublisherIDs.has(o.id),
  );

  const usedCompendiumIDs = new Set(
    serieEditions.map((e) => e.compendiumID).filter(Boolean),
  );
  const scopedCompendium = (compendium ?? []).filter((c) =>
    usedCompendiumIDs.has(c.id),
  );

  const filteredComics = baseComics.filter((c) =>
    comicMatchesFilters(c, editions, comicContributors, appliedFilters),
  );

  const sortedBaseComics = [...filteredComics].sort(
    (a, b) => Number(a.bookNumber) - Number(b.bookNumber),
  );

  const selectedSerie = selectedSerieID
    ? series.find((s) => s.id === selectedSerieID)
    : null;

  const [currentPage, setCurrentPage] = useState(1);
  const displayComic = 60;

  const startIndex = (currentPage - 1) * displayComic;
  const endIndex = startIndex + displayComic;
  const paginatedComics = sortedBaseComics.slice(startIndex, endIndex);

  const slides = Array.from(
    { length: Math.ceil(paginatedComics.length / slideSize) },
    (_, i) => paginatedComics.slice(i * slideSize, i * slideSize + slideSize),
  );

  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState("");

  function handleEditClick() {
    setDescriptionInput(selectedSerie?.description ?? "");
    setEditingDescription(true);
  }

  async function handleSaveDescription() {
    await updateSerie({ ...selectedSerie, description: descriptionInput });
    setEditingDescription(false);
  }

  return (
    <>
      <div className="text-center">
        <h2>{selectedSerie ? selectedSerie.title : "All Comics"}</h2>
        {selectedSerie && (
          <div className="mb-3">
            {editingDescription ? (
              <>
                <textarea
                  className="form-control w-75 mx-auto"
                  rows={5}
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  placeholder="Enter serie description..."
                />
                <div className="d-flex justify-content-center gap-2 mt-2">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={handleSaveDescription}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setEditingDescription(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {selectedSerie.description && (
                  <div
                    className="w-75 mx-auto text-start"
                    style={{
                      maxHeight: "150px",
                      overflowY: "auto",
                      background: "#1a1a1a",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <ReactMarkdown>{selectedSerie.description}</ReactMarkdown>
                  </div>
                )}
                <button
                  className="btn btn-sm btn-outline-warning"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <Pagination
        className="my-3"
        align="center"
        current={currentPage}
        pageSize={displayComic}
        total={sortedBaseComics.length}
        onChange={setCurrentPage}
      />

      <div style={{ display: "flex", gap: "1.5rem", padding: "0 1.5rem" }}>
        <ComicFiltersSidebar
          editions={serieEditions}
          organizations={scopedOrganizations}
          compendium={scopedCompendium}
          peoples={peoples}
          onApply={(filters) => {
            setAppliedFilters(filters);
            setCurrentPage(1);
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <Section>
            <Comics
              comics={paginatedComics}
              selectedSerieID={selectedSerieID}
              series={series}
              onSelectComic={onSelectComic}
              onDeleteComic={async (comic) => {
                await deleteComic(comic, editions, comicContributors);
              }}
              editions={editions}
              slides={slides}
            />
          </Section>
        </div>
      </div>

      <Pagination
        className="my-3"
        align="center"
        current={currentPage}
        pageSize={displayComic}
        total={sortedBaseComics.length}
        onChange={setCurrentPage}
      />
    </>
  );
}
