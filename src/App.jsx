import 'normalize.css'
import './App.css'
import 'react-tabs/style/react-tabs.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'rc-pagination/assets/index.css';
import './api/firebase.js';
import {ComicPage} from "./pages/ComicPage.jsx";
import {HomePage} from "./pages/HomePage.jsx";
import {deleteComic, useComicCollectionData} from "./api/comicInfo.js";
import {useSerieCollectionData} from "./api/serieInfo.js";
import {Nav, Navbar, Container} from "react-bootstrap";
import {useEffect, useState} from "react";
import {SeriePage} from "./pages/SeriePage.jsx";
import {ComicDetailsPage} from "./pages/ComicDetailsPage.jsx";
import {AddComicPage} from "./pages/AddComicPage.jsx";
import {useOrganizationCollectionData} from "./api/organizationInfo.js";
import {useRoleCollectionData} from "./api/roleInfo.js";
import {useComicContributorCollectionData} from "./api/comicContributer.js";
import {usePeopleCollectionData} from "./api/personInfo.js";
import {useEditionCollectionData} from "./api/editionInfo.js";
import {AddEditionPage} from "./pages/AddEditionPage.jsx";
import {useCompendiumCollectionData} from "./api/compendiumInfo.js";
import {CompendiumPage} from "./pages/CompendiumPage.jsx";
import {PublisherDetailsPage} from "./pages/PublisherDetailsPage.jsx";
import {PersonDetailsPage} from "./pages/PersonDetailsPage.jsx";
import {useAuth} from "./context/AuthContext.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import {UniversePage} from "./pages/UniversePage.jsx";
import {useUniverseCollectionData} from "./api/universeInfo.js";

const NAV_HOME = "NAV_HOME";
const COMIC_CATALOG = "COMIC_CATALOG";
const NAV_SERIE_CATALOG = "NAV_SERIE_CATALOG";
const NAV_UNIVERSE_CATALOG = "NAV_UNIVERSE_CATALOG";
const COMIC_EDITIONS = "COMIC_EDITIONS";
const NAV_ADD_FORM = "NAV_ADD_FORM";
const NAV_ADD_ED = "NAV_ADD_ED";
const NAV_COLLECTION = "NAV_COLLECTION";
const NAV_PUBLISHER = "NAV_PUBLISHER";
const NAV_PERSON = "NAV_PERSON";

function NavigationBar(props){
    const {activeNavBarItem, onSelectNavBarItem} = props;

    return (
        <>
            <Navbar expand="md" className="fixed-top nav-bg">
                <Container className="m-0">
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav activeKey={activeNavBarItem}
                             onSelect={selectedEventKey => onSelectNavBarItem(selectedEventKey)}>
                            <Nav.Item>
                                <Nav.Link className="nav-text" eventKey={NAV_HOME}>Home</Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link className="nav-text" eventKey={NAV_UNIVERSE_CATALOG}>Universe Catalog</Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link className="nav-text" eventKey={NAV_SERIE_CATALOG}>Serie Catalog</Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link className="nav-text" eventKey={NAV_ADD_FORM}>Add Comics</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

function ActivePage(props){
    const {activeNavBarItem, initialGenre, setInitialGenre,
           navigateTo, selectedSerieID, setSelectedSerieID, setSelectedComicID, selectedComicID, selectedUniverseID, setSelectedUniverseID} = props;

    const {comics} = useComicCollectionData();
    const {editions} = useEditionCollectionData();
    const {series} = useSerieCollectionData();
    const {universes} = useUniverseCollectionData();
    const {compendium} = useCompendiumCollectionData();
    const {organizations} = useOrganizationCollectionData();
    const {roles} = useRoleCollectionData();
    const {peoples} = usePeopleCollectionData();
    const {comicContributors} = useComicContributorCollectionData();

    const [selectedCompendiumID, setSelectedCompendiumID] = useState(null);
    const [selectedPublisherID, setSelectedPublisherID] = useState(null);
    const [selectedPersonID, setSelectedPersonID] = useState(null);

    function handleAddEditions(comic) {
        setSelectedComicID(comic.id);
        navigateTo(NAV_ADD_ED);
    }

    const comicsWithImages = comics?.map(comic => {
        const firstEdition = editions?.find(ed => ed.comicID === comic.id);
        return {
            ...comic,
            imageURL: firstEdition?.imgURL || null
        };
    });

    switch (activeNavBarItem) {
        case NAV_HOME:
            return <HomePage comics={comicsWithImages || []}
                             editions={editions}
                             series={series}
                             organizations={organizations}
                             compendium={compendium}
                             setInitialGenre={setInitialGenre}
                             peoples={peoples}
                             onSelectComic={(comic) => {
                                 setSelectedComicID(comic.id);
                                 navigateTo(COMIC_EDITIONS);
                             }}
                             onSelectSerie={(serie) => {
                                 setSelectedSerieID(serie.id);
                                 navigateTo(COMIC_CATALOG);
                             }}
                             onSelectCompendium={(compendium) => {
                                 setSelectedCompendiumID(compendium.id);
                                 navigateTo(NAV_COLLECTION);
                             }}
                             onSelectPublisher={(publisher) => {
                                 setSelectedPublisherID(publisher.id);
                                 navigateTo(NAV_PUBLISHER);
                             }}
                             onSelectPerson={(person) => {
                                 setSelectedPersonID(person.id);
                                 navigateTo(NAV_PERSON);
                             }}
                             onDeleteComic={async (comic) => {
                                 await deleteComic(comic, editions, comicContributors);
                             }}
                             navigateTo={navigateTo}/>;
        case COMIC_CATALOG:
            return <ComicPage
                comics={comicsWithImages}
                editions={editions}
                onSelectComic={(comic) => {
                    setSelectedComicID(comic.id);
                    navigateTo(COMIC_EDITIONS);
                }}
                series={series}
                selectedSerieID={selectedSerieID}
                comicContributors={comicContributors}
                initialGenre={initialGenre}
            />;

        case NAV_SERIE_CATALOG:
            return <SeriePage series={series}
                              onSelectSerie={(serie) => {
                                  setSelectedSerieID(serie.id);
                                  navigateTo(COMIC_CATALOG);
                              }}/>
        case NAV_UNIVERSE_CATALOG:
            return <UniversePage universes={universes}
                                 onSelectUniverse={(universe) => {
                                     setSelectedUniverseID(universe.id);
                                     navigateTo(NAV_SERIE_CATALOG);
            }}/>

        case NAV_ADD_FORM:
            return <AddComicPage selectedComicID={selectedComicID}
                                 setSelectedComicID={setSelectedComicID}/>

        case NAV_ADD_ED: {
            const selectedComic = comics?.find(c => c.id === selectedComicID);

            return (
                <AddEditionPage comic={selectedComic}
                                editions={editions}
                                selectedComicID={selectedComicID}
                                setSelectedComicID={setSelectedComicID}
                                organizations={organizations}
                                roles={roles} peoples={peoples}
                                comicContributors={comicContributors}
                                series={series} />
            );
        }

        case COMIC_EDITIONS: {
            const selectedComic = comics?.find(c => c.id === selectedComicID);
            const selectedSerie = series?.find(s => s.id === selectedComic?.serieID);

            return (
                <ComicDetailsPage
                    comic={selectedComic}
                    onAddEditions={handleAddEditions}
                    series={series}
                    selectedSerie={selectedSerie}
                    editions={editions}
                    compendium={compendium}
                    organizations={organizations}
                    roles={roles}
                    peoples={peoples}
                    comicContributors={comicContributors}
                    onSelectCompendium={(compendiumID) => {
                        setSelectedCompendiumID(compendiumID);
                        navigateTo(NAV_COLLECTION);
                    }}
                    onSelectPublisher={(publisherID) => {
                        setSelectedPublisherID(publisherID);
                        navigateTo(NAV_PUBLISHER);
                    }}
                    onSelectPerson={(peopleID) => {
                        setSelectedPersonID(peopleID);
                        navigateTo(NAV_PERSON);
                    }}
                />
            );
        }

        case NAV_COLLECTION: {
            const selectedCompendium = compendium?.find(c => c.id === selectedCompendiumID);
            return (
                <CompendiumPage
                    compendium={selectedCompendium}
                    editions={editions}
                    onEditEdition={(edition) => {
                        setSelectedComicID(edition.comicID);
                        navigateTo(NAV_ADD_ED);
                    }}
                />
            );
        }

        case NAV_PUBLISHER: {
            const selectedPublisher = organizations?.find(o => o.id === selectedPublisherID);
            return (
                <PublisherDetailsPage
                    publisher={selectedPublisher}
                    editions={editions}
                    onEditEdition={(edition) => {
                        setSelectedComicID(edition.comicID);
                        navigateTo(NAV_ADD_ED);
                    }}
                    onSelectCompendium={(compendiumID) => {
                        setSelectedCompendiumID(compendiumID);
                        navigateTo(NAV_COLLECTION);
                    }}
                />
            );
        }

        case NAV_PERSON: {
            const selectedPerson = peoples?.find(p => p.id === selectedPersonID);
            return (
                <PersonDetailsPage
                    person={selectedPerson}
                    editions={editions}
                    comicContributors={comicContributors}
                    roles={roles}
                    organizations={organizations}
                    compendium={compendium}
                    peoples={peoples}
                    onEditEdition={(edition) => {
                        setSelectedComicID(edition.comicID);
                        navigateTo(NAV_ADD_ED);
                    }}
                    onSelectCompendium={(compendiumID) => {
                        setSelectedCompendiumID(compendiumID);
                        navigateTo(NAV_COLLECTION);
                    }}
                    onSelectPublisher={(publisherID) => {
                        setSelectedPublisherID(publisherID);
                        navigateTo(NAV_PUBLISHER);
                    }}
                />
            );
        }
        default:
            return;
    }
}

function App() {
    const {currentUser, role} = useAuth();
    const [activeNavBarItem, setActiveNavBarItem] = useState(NAV_HOME);
    const [selectedComicID, setSelectedComicID] = useState(null);
    const [selectedSerieID, setSelectedSerieID] = useState(null);
    const [selectedUniverseID, setSelectedUniverseID] = useState(null);

    function navigateTo(key){
        window.location.hash = key;
        setActiveNavBarItem(key);
    }

    useEffect(() => {
        const handleHashChange = () => {
            const key = window.location.hash.replace("#", "");
            if (key) {
                setActiveNavBarItem(key);
                if (key === NAV_HOME || key === COMIC_CATALOG || key === NAV_SERIE_CATALOG || key === NAV_UNIVERSE_CATALOG) {
                    setSelectedComicID(null);
                }
            }
        };

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    if (currentUser === undefined) return <div className="text-center mt-5">Loading...</div>;
    if (currentUser === null) return <LoginPage />;

    return (
        <>
            <NavigationBar
                activeNavBarItem={activeNavBarItem}
                onSelectNavBarItem={(key) => {
                    navigateTo(key);
                    if (key === COMIC_CATALOG) {
                        setSelectedSerieID(null);
                    }
                }}
            />
            <div style={{marginTop: "70px"}}>
                <ActivePage
                    navigateTo={navigateTo}
                    activeNavBarItem={activeNavBarItem}
                    selectedComicID={selectedComicID}
                    setSelectedComicID={setSelectedComicID}
                    selectedSerieID={selectedSerieID}
                    setSelectedSerieID={setSelectedSerieID}
                    setSelectedUniverseID={setSelectedUniverseID}
                />
            </div>
        </>
    )
}

export default App