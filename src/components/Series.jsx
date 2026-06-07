import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Section } from "./Section.jsx";
import { Button, Modal, Row } from "react-bootstrap";

function Serie(props) {
  const { serie, onSelect, onDelete, canDelete } = props;
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <ul>
          <li onClick={() => onSelect(serie)}>
            <span className="fs-4 pop-effect" role="button">
              {serie.title}
            </span>
          </li>
        </ul>

        {canDelete && (
          <button
            className="btn btn-danger btn-sm ms-2"
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
        )}
      </div>

      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        centered
        dialogClassName="modal-bg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Serie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{serie.title}</strong>? This
          will also delete all comics and editions within this serie.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowConfirm(false);
              onDelete(serie);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function Series(props) {
  const { series, onSelectSerie, onDeleteSerie } = props;
  const { role } = useAuth();
  const canDelete = role === "mod" || role === "admin";

  return (
    <>
      <Section>
        <Row className="mt-2 animation-list">
          {series?.map((s) => (
            <Serie
              key={s.id}
              serie={s}
              onSelect={onSelectSerie}
              onDelete={onDeleteSerie}
              canDelete={canDelete}
            />
          ))}
        </Row>
      </Section>
    </>
  );
}
