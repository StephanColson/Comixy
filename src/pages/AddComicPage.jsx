import { Form } from "react-bootstrap";
import { AddEditions } from "../components/AddEditions.jsx";

export function AddComicPage(props) {
  const { selectedComicID, setSelectedComicID } = props;

  return (
    <>
      <Form>
        <AddEditions
          selectedComicID={selectedComicID}
          setSelectedComicID={setSelectedComicID}
          initialIsNewComic={true}
        />
      </Form>
    </>
  );
}
