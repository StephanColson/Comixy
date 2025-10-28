import {Section} from "../components/Section.jsx";
import {Carousel} from "react-bootstrap";
import {Comics} from "../components/Comics.jsx";

export function HomePage(props) {
    const {comics} = props;
    return (
        <>
            <Section>
                <h1>Welcome to the comic library!</h1>
            </Section>

            <Section>
                <Carousel interval={1000} pause="hover">
                    <Carousel.Item>
                        <Comics comics={comics.slice(0,4)}/>
                    </Carousel.Item>
                </Carousel>
            </Section>
        </>
    )
}