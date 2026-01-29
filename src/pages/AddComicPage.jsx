import {Form} from "react-bootstrap";
import {useState} from "react";
import {AddEditions} from "../components/AddEditions.jsx";

export function AddComicPage(props){
    const {selectedComicID, setSelectedComicID} = props;
    const [isNewComic, setIsNewComic] = useState(true);

    return<>
        <Form>
            <AddEditions selectedComicID={selectedComicID} setSelectedComicID={setSelectedComicID}/>
        </Form>
    </>
}