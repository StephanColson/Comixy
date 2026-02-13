import 'normalize.css'
import './App.css'
import 'react-tabs/style/react-tabs.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-pagination/assets/index.css';
import './api/firebase.js';
import './api/supabase.js';
import {ComicPage} from "./pages/ComicPage.jsx";
import {HomePage} from "./pages/HomePage.jsx";
import {useComicCollectionData} from "./api/comicInfo.js";
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

const NAV_HOME = "NAV_HOME";
const COMIC_CATALOG = "COMIC_CATALOG";
const NAV_SERIE_CATALOG = "NAV_SERIE_CATALOG";
const COMIC_EDITIONS = "COMIC_EDITIONS";
const NAV_ADD_FORM = "NAV_ADD_FORM";

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
                                <Nav.Link className="nav-text" eventKey={NAV_SERIE_CATALOG}>Serie Catalog</Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link className="nav-text" eventKey={COMIC_CATALOG}>Comic Catalog</Nav.Link>
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
    const {activeNavBarItem, selectedUser, initialGenre, setInitialGenre,
           setActiveNavBarItem, selectedSerieID, setSelectedSerieID, setSelectedComicID, selectedComicID} = props;

    const {comics} = useComicCollectionData();
    const {editions} = useEditionCollectionData();
    const {series} = useSerieCollectionData();
    const {organizations} = useOrganizationCollectionData();
    const {roles} = useRoleCollectionData();
    const {peoples} = usePeopleCollectionData();
    const {comicContributors} = useComicContributorCollectionData();

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
                             setInitialGenre={setInitialGenre}
                             onSelectComic={(comic) => {
                                 setSelectedComicID(comic.id);
                                 setActiveNavBarItem(COMIC_EDITIONS);
                             }}
                             setActiveNavBarItem={setActiveNavBarItem}/>;
        case COMIC_CATALOG:
            return <ComicPage
                comics={comicsWithImages}
                editions={editions}
                onSelectComic={(comic) => {
                    setSelectedComicID(comic.id);
                    setActiveNavBarItem(COMIC_EDITIONS);
                }}
                series={series}
                selectedSerieID={selectedSerieID}
                initialGenre={initialGenre}
            />;

        case NAV_SERIE_CATALOG:
            return <SeriePage series={series}
                              onSelectSerie={(serie) => {
                                  setSelectedSerieID(serie.id);
                                  setActiveNavBarItem(COMIC_CATALOG);
                              }}/>

        case NAV_ADD_FORM:
            return <AddComicPage selectedComicID={selectedComicID} setSelectedComicID={setSelectedComicID}/>

        case COMIC_EDITIONS: {
            const selectedComic = comics?.find(c => c.id === selectedComicID);
            const selectedSerie = series?.find(s => s.id === selectedSerieID);

            return (
                <ComicDetailsPage
                    comic={selectedComic}
                    series={series}
                    editions={editions}
                    organizations={organizations}
                    roles={roles}
                    peoples={peoples}
                    comicContributors={comicContributors}
                />
            );
        }
        default:
            return;
    }
}

function App() {
    const [activeNavBarItem, setActiveNavBarItem] = useState(NAV_HOME);
    const [selectedComicID, setSelectedComicID] = useState(null);
    const [selectedSerieID, setSelectedSerieID] = useState(null);

    useEffect(() => {
        const handleHashChange = () => {
            const key = window.location.hash.replace("#", "");
            if (key) setActiveNavBarItem(key);
        };

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    return (
        <>
            <NavigationBar
                activeNavBarItem={activeNavBarItem}
                onSelectNavBarItem={(key) => {
                    window.location.hash = key;
                    setActiveNavBarItem(key);
                    if (key === COMIC_CATALOG) {
                        setSelectedSerieID(null);
                    }
                }}
            />
            <div style={{marginTop: "70px"}}>
                <ActivePage
                    activeNavBarItem={activeNavBarItem}
                    selectedComicID={selectedComicID}
                    setSelectedComicID={setSelectedComicID}
                    selectedSerieID={selectedSerieID}
                    setSelectedSerieID={setSelectedSerieID}
                    setActiveNavBarItem={setActiveNavBarItem}/>
            </div>
        </>
    )
}

export default App