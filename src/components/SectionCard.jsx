import {Card} from "react-bootstrap";

export function SectionCard(props) {
    const {coverImg, children, onClick, className = ""} = props;

    return <>
        <Card className={`mb-2 card-pop ${className}`} onClick={onClick}>
            {coverImg && (
                <Card.Img src={coverImg} className="object-fit-cover"/>
            )}
            <Card.Body className={"text-center"}>
                {children}
            </Card.Body>
        </Card>
    </>
}