import {Form, Row, Col} from "react-bootstrap";
import {useState} from "react";
import {AddEditions} from "../components/AddEditions.jsx";

export function AddComicPage(props){
    const {selectedComicID, setSelectedComicID} = props;
    const [comicForm, setComicForm] = useState({
        title: "",
        bookNumber: "",
        genres: [],
        serieID: null,
    });

    const [isNewComic, setIsNewComic] = useState(true);

    return<>
        <Form>
            <Form.Group>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <Form.Check type="switch" label={isNewComic ? "New Comic" : "Add Edition"}
                                    checked={isNewComic}
                                    onChange={e => setIsNewComic(e.target.checked)}/>
                    </Col>
                </Row>
            </Form.Group>

            {isNewComic ?
                (<Row className="m-4">
                    <Col lg={9}>
                        <Form.Label>Comic title:</Form.Label>
                        <Form.Control type="text" value={comicForm.title}
                                      onChange={e => setComicForm(prev => ({...prev, title: e.target.value}))}/>
                    </Col>

                    <Col lg={3}>
                        <Form.Label>Comic Number:</Form.Label>
                        <Form.Control type="number"/>
                    </Col>

                    <Col lg={12} className="mt-5">
                        <Form.Label>Comic Genres:</Form.Label>
                        <Form.Control type="text"/>
                        <div>
                            <span className="badge coloured-badge">Fantasy</span>
                            <span className="badge coloured-badge">History</span>
                            <span className="badge coloured-badge">Action</span>
                        </div>
                    </Col>

                    <Col lg={6} className="mt-5">
                        <Form.Label>Serie:</Form.Label>
                        <Form.Select>
                            <option value="">-No Serie Selected-</option>
                            <option>Test Opt1</option>
                            <option>Test Opt2</option>
                            <option>Test Opt3</option>
                        </Form.Select>
                    </Col>
                </Row>)
            : <AddEditions selectedComicID={selectedComicID} setSelectedComicID={setSelectedComicID}/>}
        </Form>
    </>
}