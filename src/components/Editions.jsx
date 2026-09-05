import { Section } from "./Section.jsx";
import { Carousel, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import FlipMove from "react-flip-move";
import ReactMarkdown from "react-markdown";
import {
  GiBookshelf,
  GiBookmarklet,
  GiBookCover,
  GiHearts,
} from "react-icons/gi";
import {
  getUserLibraryEntry,
  setUserLibraryEntry,
  getUserCopies,
  addCopy,
  deleteCopy,
} from "../api/editionInfo.js";
import { useAuth } from "../context/AuthContext.jsx";

function EditionThumbnails(props) {
  const { imgURLs } = props;
  const [images, setImages] = useState(imgURLs ?? []);
  const [lightBoxOpen, setLightBoxOpen] = useState(false);

  if (!images.length) return null;

  function handleThumbnailClick(clickedIndex) {
    const updated = [...images];
    [updated[0], updated[clickedIndex]] = [updated[clickedIndex], updated[0]];
    setImages(updated);
  }

  return (
    <div>
      <img
        src={images[0]}
        alt="Edition Cover"
        onClick={() => setLightBoxOpen(true)}
        className="img-fluid rounded mb-2 w-75 object-fit-cover"
      />

      {images.length > 1 && (
        <FlipMove
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 5.8rem)",
            gap: "0.5rem",
          }}
          easing="ease-in-out"
          appearAnimation="fade"
        >
          {images.slice(1).map((url, i) => (
            <div key={url} onClick={() => handleThumbnailClick(i + 1)}>
              <img
                src={url}
                alt={`Thumbnail ${i + 1}`}
                className="rounded object-fit-cover"
                style={{ width: "5.8rem", height: "5.8rem", cursor: "pointer" }}
              />
            </div>
          ))}
        </FlipMove>
      )}

      {lightBoxOpen && (
        <div
          onClick={() => setLightBoxOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="lightbox-carousel"
          >
            <Carousel
              interval={null}
              indicators={images.length > 1}
              variant="light"
              defaultActiveIndex={0}
            >
              {images.map((url, i) => (
                <Carousel.Item key={url}>
                  <img
                    src={url}
                    alt={`Image ${i + 1}`}
                    style={{
                      maxHeight: "90vh",
                      maxWidth: "90vw",
                      objectFit: "contain",
                      borderRadius: "8px",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
}

function Edition(props) {
  const {
    edition,
    onEdit,
    onSelectCompendium,
    onSelectPublisher,
    onSelectPerson,
    onSelectComic,
    onSelectSerie,
    onDelete,
  } = props;

  const { currentUser } = useAuth();
  const [entry, setEntry] = useState(null);
  const [copies, setCopies] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    getUserLibraryEntry(edition.id, currentUser.uid).then(setEntry);
    getUserCopies(edition.id, currentUser.uid).then(setCopies);
  }, [edition.id, currentUser]);

  const isOwned = copies.length > 0;

  async function toggleWishlist() {
    if (!currentUser || !entry) return;
    const updated = { ...entry, wishlist: !entry.wishlist };
    setEntry(updated);
    await setUserLibraryEntry(edition.id, currentUser.uid, updated);
  }

  async function toggleOwned() {
    if (!currentUser) return;

    if (isOwned) {
      await deleteCopy(edition.id, currentUser.uid, copies[0].id);
      setCopies([]);
    } else {
      await addCopy(edition.id, currentUser.uid);
      const refreshed = await getUserCopies(edition.id, currentUser.uid);
      setCopies(refreshed);
    }
  }

  async function toggleEntryField(field) {
    if (!currentUser || !entry) return;
    const updated = { ...entry, [field]: !entry[field] };
    setEntry(updated);
    await setUserLibraryEntry(edition.id, currentUser.uid, updated);
  }

  function iconBtn(active, onClick, Icon, label) {
    return (
      <button
        title={label}
        onClick={onClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: active ? "#d4a520" : "#555",
          fontSize: "1.4rem",
          padding: "0.25rem 0.5rem",
          transition: "color 0.2s",
        }}
      >
        <Icon />
      </button>
    );
  }

  return (
    <>
      <Row className="mb-4 align-items-start">
        <Col xs={12} md={3}>
          <EditionThumbnails imgURLs={edition.imgURLs} />
        </Col>

        <Col xs={12} md={9}>
          <Row className="g-2">
            <Col xs={12} md={6}>
              <div className="d-flex flex-column gap-2">
                {edition.serieTitle && (
                  <div>
                    <strong>Serie: </strong>
                    <span
                      className="pop-effect"
                      role="button"
                      onClick={() => onSelectSerie(edition.serieID)}
                    >
                      {edition.serieTitle}
                    </span>
                  </div>
                )}

                {edition.compendiumTitle && (
                  <div>
                    <strong>Collection: </strong>
                    <span
                      className="pop-effect"
                      role="button"
                      onClick={() => onSelectCompendium(edition.compendiumID)}
                    >
                      {edition.compendiumTitle}
                    </span>
                  </div>
                )}

                {edition.printType && (
                  <div>
                    <strong>Print Type:</strong> {edition.printType}
                  </div>
                )}

                {edition.numberInCollection && (
                  <div>
                    <strong>Collection Number: </strong>
                    {edition.numberInCollection}
                  </div>
                )}

                <div>
                  <strong>Publisher:</strong>{" "}
                  <span
                    className="pop-effect"
                    role="button"
                    onClick={() => onSelectPublisher(edition.organizationID)}
                  >
                    {edition.publisherDisplay}
                  </span>
                </div>
              </div>
            </Col>

            <Col xs={12} md={6}>
              <div className="d-flex flex-column gap-2">
                {edition.comicTitle && (
                  <div>
                    <strong>Comic Title: </strong>
                    <span
                      className="pop-effect"
                      role="button"
                      onClick={() => onSelectComic(edition.comicID)}
                    >
                      {edition.comicTitle}
                    </span>
                  </div>
                )}

                {edition.format && (
                  <div>
                    <strong>Format:</strong> {edition.format}
                  </div>
                )}

                {edition.printYear && (
                  <div>
                    <strong>Year:</strong> {edition.printYear}
                  </div>
                )}

                {edition.spine && (
                  <div>
                    <strong>Spine:</strong> {edition.spine}
                  </div>
                )}

                {edition.note && (
                  <div>
                    <strong>Notes:</strong>
                    <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                      <ReactMarkdown>{edition.note}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {edition.displayContributors?.length > 0 && (
                  <div>
                    <strong>Contributors:</strong>
                    <ul className="mb-0">
                      {edition.displayContributors.map((c, i) => (
                        <li key={i}>
                          <span
                            className="pop-effect"
                            role="button"
                            onClick={() => onSelectPerson(c.peopleID)}
                          >
                            {c.peopleName}
                          </span>
                          {""} — {c.roleName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Col>

            <Col xs={12} className="mt-3">
              {/* Library toggle icons */}
              <div className="d-flex gap-1 mb-2">
                {iconBtn(isOwned, toggleOwned, GiBookshelf, "Owned")}
                {iconBtn(
                  entry?.read,
                  () => toggleEntryField("read"),
                  GiBookCover,
                  "Read",
                )}
                {iconBtn(
                  entry?.favourite,
                  () => toggleEntryField("favourite"),
                  GiHearts,
                  "Favourite",
                )}
                {iconBtn(
                  entry?.wishlist,
                  toggleWishlist,
                  GiBookmarklet,
                  "Wishlist",
                )}
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => onEdit(edition)}
                >
                  Edit Edition
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(edition)}
                >
                  Delete Edition
                </button>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export function Editions(props) {
  const {
    editions,
    onEditEdition,
    onSelectCompendium,
    onSelectPublisher,
    onSelectPerson,
    onSelectComic,
    onSelectSerie,
    onDeleteEdition,
  } = props;

  if (!editions || editions.length === 0) {
    return <div>No editions found</div>;
  }

  return (
    <>
      <Section>
        {editions?.map((ed) => (
          <Col xs={12} lg={12} key={ed.id}>
            <Edition
              edition={ed}
              onEdit={onEditEdition}
              onSelectCompendium={onSelectCompendium}
              onSelectPublisher={onSelectPublisher}
              onSelectPerson={onSelectPerson}
              onSelectComic={onSelectComic}
              onSelectSerie={onSelectSerie}
              onDelete={onDeleteEdition}
            />
          </Col>
        ))}
      </Section>
    </>
  );
}
