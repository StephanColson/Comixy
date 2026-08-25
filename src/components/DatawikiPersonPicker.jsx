import { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { searchWikidataPeople, getWikidataAliases } from "../api/datawiki.js";

// Lets the user confirm which (if any) Wikidata entity matches a newly typed person name.
// onResolve is called with either:
//   { qid, aliases } - when the user picked a match
//   null             - when the user skipped / no match applies
export function DatawikiPersonPicker({ name, onResolve }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    searchWikidataPeople(name)
      .then((results) => {
        if (!cancelled) setCandidates(results);
      })
      .catch(() => {
        if (!cancelled) setCandidates([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [name]);

  async function handlePick(candidate) {
    setResolving(true);
    try {
      const aliases = await getWikidataAliases(candidate.id);
      onResolve({ qid: candidate.id, aliases });
    } catch {
      onResolve({ qid: candidate.id, aliases: [] });
    } finally {
      setResolving(false);
    }
  }

  return (
    <Modal show onHide={() => onResolve(null)} dialogClassName="modal-bg">
      <Modal.Header closeButton>
        <Modal.Title>Match “{name}” on Wikidata?</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading && (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" />
          </div>
        )}

        {!loading && candidates.length === 0 && (
          <div>No Wikidata matches found.</div>
        )}

        {!loading &&
          candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="d-flex justify-content-between align-items-center border-bottom py-2"
            >
              <div>
                <div className="fw-bold">{candidate.label}</div>
                {candidate.description && (
                  <div className="small">{candidate.description}</div>
                )}
              </div>

              <Button
                size="sm"
                variant="primary"
                disabled={resolving}
                onClick={() => handlePick(candidate)}
              >
                Select
              </Button>
            </div>
          ))}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => onResolve(null)}>
          Skip / None of these
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
