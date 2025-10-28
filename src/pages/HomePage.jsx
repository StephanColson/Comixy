import {Section} from "../components/Section.jsx";
import {Carousel} from "react-bootstrap";
import {Comics} from "../components/Comics.jsx";

export function HomePage(props) {
    const {comics} = props;
    return (
        <>
            <div className="text-center">
                <h1>Welcome to the comic library!</h1>
            </div>

            <Section>
                <Carousel interval={3000} pause="hover">
                    <div className="text-center">
                        <h3>Recently added: </h3>
                    </div>
                    <Carousel.Item>
                        <Comics comics={comics.slice(0, 4)}/>
                    </Carousel.Item>

                    <Carousel.Item>
                        <Comics comics={comics.slice(4, 8)}/>
                    </Carousel.Item>

                    <Carousel.Item>
                        <Comics comics={comics.slice(8, 12)}/>
                    </Carousel.Item>
                </Carousel>
            </Section>
        </>
    )
}