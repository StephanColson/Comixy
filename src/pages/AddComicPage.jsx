import {Form} from "react-bootstrap";

export function AddComicPage(){
    return<>
        <Form>
            <div>
                <div>
                    <Form.Label><strong>COMIC</strong></Form.Label>
                </div>
                <Form.Label>Title:</Form.Label>
                <Form.Control type="text"/>
            </div>

            <div>
                <div>
                    <Form.Label><strong>SERIE</strong></Form.Label>
                </div>
                <Form.Label>Title:</Form.Label>
                <Form.Control type="text"/>
            </div>

            <div>
                <div>
                    <Form.Label><strong>AUTHORS</strong></Form.Label>
                </div>
            </div>

            <div>
                <div>
                    <Form.Label><strong>ARTISTS</strong></Form.Label>
                </div>
            </div>

            <div>
                <div>
                    <Form.Label><strong></strong></Form.Label>
                </div>
            </div>
        </Form>
    </>
}