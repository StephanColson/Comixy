import {Series} from "../components/Series.jsx";
import {Col, Form, Row} from "react-bootstrap";
import {useState} from "react";

export function SeriePage(props){
    const {series, onSelectSerie} = props;
    const [searchItem, setSearchItem] = useState("");

    //const filteredSeries = series?.filter(s => s.title.toLowerCase().includes(searchItem.toLowerCase()) || [])

    return <>
        <h2 className="text-center">Catalog of series!</h2>

        <div>
            <Form className="my-4 mx-5">
                <Row className="justify-content-center">
                    <Col lg={6} xl={6} md={8} className="mb-3">
                        <Form.Control value={searchItem} onChange={e => setSearchItem(e.target.value)}
                                      placeholder="Search..."/>
                    </Col>
                </Row>
            </Form>
        </div>

        <div>
            <Series series={series} onSelectSerie={onSelectSerie}/>
        </div>
    </>
}