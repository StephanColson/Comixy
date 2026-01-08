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
import {useState} from "react";
import {SeriePage} from "./pages/SeriePage.jsx";
import {ComicDetailsPage} from "./pages/ComicDetailsPage.jsx";
import {AddComicPage} from "./pages/AddComicPage.jsx";

const NAV_HOME = "NAV_HOME";
const COMIC_CATALOG = "COMIC_CATALOG";
const NAV_SERIE_CATALOG = "NAV_SERIE_CATALOG";
const COMIC_EDITIONS = "COMIC_EDITIONS";
const NAV_ADD_FORM = "NAV_ADD_FORM";

function NavigationBar(props){
    const {activeNavBarItem, onSelectNavBarItem} = props;

    return (
        <>
            <Navbar expand="md" className="fixed-top nav-bg text-green-shaded">
                <Container className="m-0">
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav activeKey={activeNavBarItem}
                             onSelect={selectedEventKey => onSelectNavBarItem(selectedEventKey)}>
                            <Nav.Item>
                                <Nav.Link eventKey={NAV_HOME}>Home</Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link eventKey={NAV_SERIE_CATALOG}>Serie Catalog</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey={NAV_ADD_FORM}>Add Comics</Nav.Link>
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

    const {comics, loading: comicsLoading, error: comicsError} = useComicCollectionData();
    const {series, loading: seriesLoading, error: seriesError} = useSerieCollectionData();

    switch (activeNavBarItem) {
        case NAV_HOME:
            return <HomePage comics={comics || []}
                             setInitialGenre={setInitialGenre}
                             onSelectComic={(comic) => {
                                 setSelectedComicID(comic.id);
                                 setActiveNavBarItem(COMIC_EDITIONS);
                             }}
                             setActiveNavBarItem={setActiveNavBarItem}/>;
        case COMIC_CATALOG:
            return <ComicPage comics={comics}
                              onSelectComic={(comic) => {
                                  setSelectedComicID(comic.id);
                                  setActiveNavBarItem(COMIC_EDITIONS);
                              }}
                              selectedSerieID={selectedSerieID}
                              initialGenre={initialGenre}/>;
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
            return <ComicDetailsPage comic={selectedComic}/>
        }
        default:
            return;
    }
}

function App() {
    const [activeNavBarItem, setActiveNavBarItem] = useState(NAV_HOME);

    const [selectedComicID, setSelectedComicID] = useState(null);
    const [selectedSerieID, setSelectedSerieID] = useState(null);

    return (
        <>
            <NavigationBar activeNavBarItem={activeNavBarItem}
                           onSelectNavBarItem={setActiveNavBarItem}
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
