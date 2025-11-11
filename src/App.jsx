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
import {useUserCollectionData} from "./api/userInfo.js";

const NAV_HOME = "NAV_HOME";
const NAV_COMIC_SHELF = "NAV_COMIC_SHELF";

function NavigationBar(props){
    const {activeNavBarItem, onSelectNavBarItem, users, selectedUser, onSelectedUser} = props;

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
                                <Dropdown.Toggle variant="dark">
                                    {selectedUser ? selectedUser.name : "select user"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {users?.map((user) => (
                                        <Dropdown.Item
                                            key={user.id}
                                            onClick={() => onSelectedUser(user)}>
                                            {user.name}
                                        </Dropdown.Item>
                                    ))}
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
    const {activeNavBarItem, selectedUser} = props;
    const {comics, loading, error} = useComicCollectionData();

    switch (activeNavBarItem) {
        case NAV_HOME:
            return <HomePage comics={comics || []} selectedUser={selectedUser}/>;
        case NAV_COMIC_SHELF:
            return <ComicPage comics={comics} selectedUser={selectedUser}/>;
        default:
            return;
    }
}

function App() {
    const [activeNavBarItem, setActiveNavBarItem] = useState(NAV_HOME);
    const [selectedUser, setSelectedUser] = useState(null);
    const {users, loading, error} = useUserCollectionData();


    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error loading users</div>;

    return (
        <>
            <NavigationBar activeNavBarItem={activeNavBarItem}
                      onSelectNavBarItem={setActiveNavBarItem}
                           selectedUser={selectedUser}
                           onSelectedUser={setSelectedUser}
                           users={users}/>
            <div style={{marginTop: "70px"}}>
                <ActivePage activeNavBarItem={activeNavBarItem} selectedUser={selectedUser}/>
            </div>
        </>
    )
}

export default App
