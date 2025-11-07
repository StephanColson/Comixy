import {Card} from "react-bootstrap";

export function SectionCard(props) {
    const {coverImg, title, price, genres, onClick} = props;

    return <>
        <Card className="mb-2" onClick={onClick}>
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
    </>
}