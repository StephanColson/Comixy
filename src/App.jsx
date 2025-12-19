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
import {Dropdown, Nav, Navbar, Container} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useUserCollectionData} from "./api/userInfo.js";
import {SeriePage} from "./pages/SeriePage.jsx";
import {useSerieCollectionData} from "./api/serieInfo.js";

const NAV_HOME = "NAV_HOME";
const NAV_COMIC_SHELF = "NAV_COMIC_SHELF";
const NAV_SERIE_CATALOG = "NAV_SERIE_CATALOG";

function NavigationBar(props){
    const {activeNavBarItem, onSelectNavBarItem} = props;

    return (
        <>
            <Navbar expand="md" bg="dark" className="fixed-top" data-bs-theme="dark">
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
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

function ActivePage(props){
    const {activeNavBarItem, selectedUser, initialGenre, setInitialGenre,
           setActiveNavBarItem, selectedSerieID, setSelectedSerieID} = props;

    const {comics, loading: comicsLoading, error: comicsError} = useComicCollectionData();
    const {series, loading: seriesLoading, error: seriesError} = useSerieCollectionData();

    switch (activeNavBarItem) {
        case NAV_HOME:
            return <HomePage comics={comics || []}
                             setInitialGenre={setInitialGenre}
                             setActiveNavBarItem={setActiveNavBarItem}/>;
        case NAV_COMIC_SHELF:
            return <ComicPage comics={comics}
                              selectedSerieID={selectedSerieID}
                              initialGenre={initialGenre}/>;
        case NAV_SERIE_CATALOG:
            return <SeriePage series={series}
                              onSelectSerie={(serie) => {
                                  setSelectedSerieID(serie.id);
                                  setActiveNavBarItem(NAV_COMIC_SHELF);
                              }}/>
        default:
            return;
    }
}

function App() {
    const [activeNavBarItem, setActiveNavBarItem] = useState(NAV_HOME);

    const [selectedSerieID, setSelectedSerieID] = useState(null);
    const [initialGenre, setInitialGenre] = useState("");

    return (
        <>
            <NavigationBar activeNavBarItem={activeNavBarItem}
                           onSelectNavBarItem={setActiveNavBarItem}
            />
            <div style={{marginTop: "70px"}}>
                <ActivePage
                    activeNavBarItem={activeNavBarItem}
                    selectedSerieID={selectedSerieID}
                    setSelectedSerieID={setSelectedSerieID}
                    initialGenre={initialGenre}
                    setInitialGenre={setInitialGenre}
                    setActiveNavBarItem={setActiveNavBarItem}/>
            </div>
        </>
    )
}

export default App
