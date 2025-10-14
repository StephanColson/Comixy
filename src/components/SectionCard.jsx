import {Card, Col} from "react-bootstrap";

export function SectionCard (props) {
    const {coverImg, title, price, genres} = props;

    return<>
        <Col xs={12} sm={6} md={4} lg={4} xl={3} className={"mb-2"}>
            <Card>
                {coverImg && (
                    <Card.Img src={coverImg} className="object-fit-cover"/>
                )}
                <Card.Body className={"text-center"}>
                    {title}
                    <hr/>
                    {genres}
                </Card.Body>
                <Card.Footer className="text-center">
                    {price} €
                </Card.Footer>
            </Card>
        </Col>
    </>
}