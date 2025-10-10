import {Container, Col, Row} from "react-bootstrap";

export function Section(props){
    const {children, title} = props;
    return<>
        <Container className="pb-3 pt-2 my-2 bg-dark-subtle">
                {title && (
                    <Row>
                        <Col className="text-center">
                            <h5>{title}</h5>
                        </Col>
                    </Row>
                )}
                <Row>
                    {children}
                </Row>
        </Container>
    </>
}