import {Section} from "../components/Section.jsx";
import {Carousel, Badge} from "react-bootstrap";
import {Comics} from "../components/Comics.jsx";
import {useLatestComics} from "../api/comicInfo.js";
import {useState} from "react";
import {Combobox} from "@headlessui/react";

export function HomePage(props) {
    const {comics, editions, setInitialGenre, setActiveNavBarItem, onSelectComic,
        series, onSelectSerie, compendium, onSelectCompendium, organizations,
        onSelectPublisher, peoples, onSelectPerson} = props;
    const {latest = [], loading} = useLatestComics(5);

    const allGenres = [...new Set(
        comics.flatMap(c => Array.isArray(c.genres) ? c.genres : [])
    )];

    const [query, setQuery] = useState("");

    const searchResults = query.length < 2 ? [] : [
        ...comics
            .filter(c => c.title?.toLowerCase().includes(query.toLowerCase()))
            .map(c => ({ id: c.id, label: c.title, type: "Comic", data: c })),
        ...(series ?? [])
            .filter(s => s.title?.toLowerCase().includes(query.toLowerCase()))
            .map(s => ({ id: s.id, label: s.title, type: "Serie", data: s })),
        ...(compendium ?? [])
            .filter(cpd => cpd.title?.toLowerCase().includes(query.toLowerCase()))
            .map(cpd => ({ id: cpd.id, label: cpd.title, type: "Collection", data: cpd})),
        ...(organizations ?? [])
            .filter(o => o.name?.toLowerCase().includes(query.toLowerCase()))
            .map(o => ({ id: o.id, label: o.name, type: "Publisher", data: o })),
        ...(peoples ?? [])
            .filter(p => p.name?.toLowerCase().includes(query.toLowerCase()))
            .map(p => ({ id: p.id, label: p.name, type: "Person", data: p })),
    ];

    const [genreList, setGenreList] = useState("");

    return (
        <>
            <div className="text-center mb-5">
                <h2>Step Into the Panels of Comyxius</h2>
            </div>

            <div className="d-flex justify-content-center mb-5">
                <div className="w-50 position-relative">
                    <Combobox onChange={(result) => {
                        if (!result) return;
                        if (result.type === "Comic") {
                            onSelectComic(result.data);
                        } else if (result.type === "Serie") {
                            onSelectSerie(result.data);
                        } else if (result.type === "Collection") {
                            onSelectCompendium(result.data);
                        } else if (result.type === "Publisher") {
                            onSelectPublisher(result.data);
                        } else if (result.type === "Person") {
                            onSelectPerson(result.data);
                        }
                        setQuery("");
                    }}>
                        <Combobox.Input
                            className="form-control"
                            placeholder="Search catalog..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            displayValue={() => query}
                        />
                        {searchResults.length > 0 && (
                            <Combobox.Options
                                className="position-absolute w-100 rounded shadow mt-1 py-1"
                                style={{background: "#34332F", zIndex: 1000, listStyle: "none", padding: 0}}
                            >
                                {searchResults.map(result => (
                                    <Combobox.Option
                                        key={`${result.type}-${result.id}`}
                                        value={result}
                                        className="px-3 py-2"
                                        style={{cursor: "pointer"}}
                                    >
                                        {({active}) => (
                                            <div
                                                className="d-flex justify-content-between align-items-center"
                                                style={{
                                                    background: active ? "#4a4843" : "transparent",
                                                    borderRadius: "4px",
                                                    padding: "4px 8px"
                                                }}
                                            >
                                                <span>{result.label}</span>
                                                <span
                                                    className="badge ms-2"
                                                    style={{
                                                        background: result.type === "Comic" ? "#2F5D8A" :
                                                            result.type === "Serie" ? "#5A3E8A" :
                                                                result.type === "Collection" ? "#2A8A5A" :
                                                                    result.type === "Publisher" ? "#8A5A2A" :
                                                                        result.type === "Person" ? "#8A2A2A" :
                                                                            "#5A3E8A",
                                                        fontSize: "0.7rem"
                                                    }}
                                                >
                                        {result.type}
                                    </span>
                                            </div>
                                        )}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        )}
                    </Combobox>
                </div>
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
                            <Comics comics={[comics.find(x => x.id === c.id)]}
                                    carouselMode={true}
                                    onSelectComic={onSelectComic}
                                    editions={editions}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Section>
        </>
    )
}