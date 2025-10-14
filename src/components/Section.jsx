import {Container, Col, Row} from "react-bootstrap";

export function Section(props){
    const {children, title} = props;
    return<>
        <Container className="p-3 bg-dark-subtle">
                {title && (
                    <Row className="mb-2">
                        <Col className="text-center">
                            <h5>{title}</h5>
                        </Col>
                    </Row>
                )}
                <Row className="g-2">
                    {children}
                </Row>
        </Container>
    </>
}