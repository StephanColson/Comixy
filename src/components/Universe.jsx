import { useState } from "react";
import { Section } from "./Section.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Button, Modal, Row } from "react-bootstrap";

function Universe(props) {
  const { universe, onSelect, onDelete, canDelete } = props;
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <ul>
          <li onClick={() => onSelect(universe)}>
            <span className="fs-4 pop-effect" role="button">
              {universe.title}
            </span>
          </li>
        </ul>

        {canDelete && (
          <button
            className="btn btn-danger btn-sm"
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
          <Modal.Title>Delete Universe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{universe.title}</strong>?
          This will also delete all series, comics and editions within this
          universe.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowConfirm(false);
              onDelete(universe);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function Universes(props) {
  const { universes, onSelectUniverse, onDeleteUniverse } = props;
  const { role } = useAuth();
  const canDelete = role === "mod" || role === "admin";

  return (
    <>
      <Section>
        <Row className="mt-2  animation-list">
          {universes?.map((un) => (
            <div key={un.id}>
              <Universe
                universe={un}
                onSelect={onSelectUniverse}
                onDelete={onDeleteUniverse}
                canDelete={canDelete}
              />
            </div>
          ))}
        </Row>
      </Section>
    </>
  );
}
