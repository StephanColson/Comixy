import 'normalize.css'
import './App.css'
import 'react-tabs/style/react-tabs.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-pagination/assets/index.css';
import './api/firebase.js';
import {ComicPage} from "./pages/ComicPage.jsx";
import {HomePage} from "./pages/HomePage.jsx";
import {useComicCollectionData} from "./api/comicInfo.js";
import {Dropdown, Nav, Navbar, Container} from "react-bootstrap";
import {useState} from "react";

const NAV_HOME = "NAV_HOME";
const NAV_COMIC_SHELF = "NAV_COMIC_SHELF";
const NAV_USERS = "NAV_USERS";

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
                                <Nav.Link eventKey={NAV_COMIC_SHELF}>Shelf</Nav.Link>
                            </Nav.Item>

                            <Dropdown>
                                <Dropdown.Toggle variant="dark">UserList</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey={NAV_USERS}>User1</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

function ActivePage(props){
    const {activeNavBarItem} = props;
    const {comics, loading, error} = useComicCollectionData();

    switch (activeNavBarItem) {
        case NAV_HOME:
            return <HomePage comics={comics || []}/>;
        case NAV_COMIC_SHELF:
            return <ComicPage comics={comics}/>;
        default:
            return;
    }
}

function App() {
    const [activeNavBarItem, setActiveNavBarItem] = useState(NAV_HOME);

    return (
        <>
            <NavigationBar activeNavBarItem={activeNavBarItem}
                      onSelectNavBarItem={setActiveNavBarItem}/>
            <div style={{marginTop: "70px"}}>
                <ActivePage activeNavBarItem={activeNavBarItem}/>
            </div>
        </>
    )
}

export default App
