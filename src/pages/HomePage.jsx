import {Section} from "../components/Section.jsx";
import {Carousel, Badge, Form, Row, Col} from "react-bootstrap";
import {Comics} from "../components/Comics.jsx";
import {useLatestComics} from "../api/comicInfo.js";
import {useState} from "react";

export function HomePage(props) {
    const {comics, setInitialGenre, setActiveNavBarItem, onSelectComic} = props;
    const {latest = [], loading} = useLatestComics(5);

    const allGenres = [...new Set(
        comics.flatMap(c => Array.isArray(c.genres) ? c.genres : [])
    )];

    const [searchItem, setSearchItem] = useState("");

    const [publishedYear, setPublishedYear] = useState("");

    const [genreList, setGenreList] = useState("");

    return (
        <>
            <div className="text-center">
                <h2>Welcome to Comyxius!</h2>
            </div>

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

            <div className="text-center">
                <h3>All Genres</h3>
            </div>
            <Carousel variant="dark" interval={2000}>
                {allGenres.map((g, i) => (
                    <Carousel.Item key={i}>
                        <div className="d-flex justify-content-center align-items-center flex-wrap py-3">
                            <Badge bg="info" className="mx-2 mb-4 p-2 fs-5" onClick={() => {
                                setInitialGenre(g);
                                setActiveNavBarItem("NAV_COMIC_SHELF");
                            }}>
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
                    {latest.map(c => (
                        <Carousel.Item key={c.id}>
                            <Comics comics={[c]} carouselMode={true} onSelectComic={onSelectComic}/>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Section>
        </>
    )
}