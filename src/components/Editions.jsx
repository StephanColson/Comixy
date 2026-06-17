import { Section } from "./Section.jsx";
import { Carousel, Col, Row } from "react-bootstrap";
import { useState } from "react";
import FlipMove from "react-flip-move";
import ReactMarkdown from "react-markdown";
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
          className="d-flex"
          easing="ease-in-out"
          appearAnimation="fade"
        >
          {images.slice(1).map((url, i) => (
            <div key={url} onClick={() => handleThumbnailClick(i + 1)}>
              <img
                src={url}
                alt={`Thumbnail ${i + 1}`}
                className="rounded w-50 object-fit-cover"
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
    onDelete,
  } = props;
  const { role } = useAuth();

  return (
    <>
      <Row className="mb-4 align-items-start">
        <Col xs={12} md={3}>
          <EditionThumbnails imgURLs={edition.imgURLs} />
        </Col>

        <Col xs={12} md={9}>
          <Row className="g-2">
            {edition.compendiumTitle && (
              <Col xs={6}>
                <strong>Collection: </strong>
                <span
                  className="pop-effect"
                  role="button"
                  onClick={() => onSelectCompendium(edition.compendiumID)}
                >
                  {edition.compendiumTitle}
                </span>
              </Col>
            )}

            {edition.format && (
              <Col xs={6}>
                <strong>Format:</strong> {edition.format}
              </Col>
            )}

            {edition.printType && (
              <Col xs={6}>
                <strong>Print Type:</strong> {edition.printType}
              </Col>
            )}

            {edition.printYear && (
              <Col xs={6}>
                <strong>Year:</strong> {edition.printYear}
              </Col>
            )}

            {edition.numberInCollection && (
              <Col xs={6}>
                <strong>Number:</strong> {edition.numberInCollection}
              </Col>
            )}

            {edition.price && (
              <Col xs={6}>
                <strong>Price:</strong> €{edition.price}
              </Col>
            )}

            {edition.spine && (
              <Col xs={6}>
                <strong>Spine:</strong> {edition.spine}
              </Col>
            )}

            {edition.note && (
              <Col xs={12}>
                <strong>Notes:</strong>
                <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                  <ReactMarkdown>{edition.note}</ReactMarkdown>
                </div>
              </Col>
            )}

            <Col xs={6}>
              <strong>Publisher:</strong>
              <span
                className="pop-effect"
                role="button"
                onClick={() => onSelectPublisher(edition.organizationID)}
              >
                {edition.publisherDisplay}
              </span>
            </Col>

            {edition.displayContributors?.length > 0 && (
              <Col xs={12}>
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
              </Col>
            )}

            <Col xs={12} className="mt-4">
              <button
                className="btn btn-success btn-sm mx-2"
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
              onDelete={onDeleteEdition}
            />
          </Col>
        ))}
      </Section>
    </>
  );
}
