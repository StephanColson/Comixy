import {Section} from "../components/Section.jsx";
import {Carousel, Badge} from "react-bootstrap";
import {Comics} from "../components/Comics.jsx";

export function HomePage(props) {
    const {comics} = props;
    const latestComics = comics.slice(-5)

    const allGenres = [...new Set(
        comics.flatMap(c => Array.isArray(c.genres) ? c.genres : [])
    )];

    return (
        <>
            <div className="text-center">
                <h1>Welcome to the comic library!</h1>
            </div>

            <div className="text-center">
                <h3>All Genres</h3>
            </div>
            <Carousel variant="dark" interval={2000}>
                {allGenres.map((g, i) => (
                    <Carousel.Item key={i}>
                        <div className="d-flex justify-content-center align-items-center flex-wrap py-3">
                            <Badge bg="info" className="mx-2 mb-4 p-2 fs-5">
                                {g}
                            </Badge>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>

            <Section>
                <div className="text-center">
                    <h3>Recently added</h3>
                </div>
                <Carousel interval={3000} pause="hover">
                    {latestComics.map(c => (
                        <Carousel.Item key={c.id}>
                            <Comics comics={[c]} carouselMode={true}/>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Section>
        </>
    )
}