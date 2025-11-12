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
import {useEffect, useState} from "react";
import {useUserCollectionData} from "./api/userInfo.js";

const NAV_HOME = "NAV_HOME";
const NAV_COMIC_SHELF = "NAV_COMIC_SHELF";

function NavigationBar(props){
    const {activeNavBarItem, onSelectNavBarItem, users, selectedUser, onSelectedUser} = props;

    const handleLogout = () => {
        localStorage.removeItem("selectedUser");
        onSelectedUser(null);
    };

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
                                    {selectedUser ? selectedUser.name : "Log in"}
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

                            {selectedUser && (
                                <button
                                    className="btn btn-outline-light ms-3"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

function ActivePage(props){
    const {activeNavBarItem, selectedUser, initialGenre, setInitialGenre, setActiveNavBarItem} = props;
    const {comics, loading, error} = useComicCollectionData();

    switch (activeNavBarItem) {
        case NAV_HOME:
            return <HomePage comics={comics || []}
                             selectedUser={selectedUser}
                             setInitialGenre={setInitialGenre}
                             setActiveNavBarItem={setActiveNavBarItem}/>;
        case NAV_COMIC_SHELF:
            return <ComicPage comics={comics}
                              selectedUser={selectedUser}
                              initialGenre={initialGenre}/>;
        default:
            return;
    }
}

function App() {
    const [activeNavBarItem, setActiveNavBarItem] = useState(NAV_HOME);

    const [selectedUser, setSelectedUser] = useState(null);
    const [initialGenre, setInitialGenre] = useState("");

    const {users, loading, error} = useUserCollectionData();

    useEffect(() => {
        const savedUser = localStorage.getItem("selectedUser");
        if (savedUser) {
            setSelectedUser(JSON.parse(savedUser));
        }
    }, []);

    useEffect(() => {
        if (selectedUser) {
            localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
        } else {
            localStorage.removeItem("selectedUser");
        }
    }, [selectedUser]);

    useEffect(() => {
        if (!selectedUser || !users) return;
        const liveUser = users.find(u => u.id === selectedUser.id);
        if (liveUser && JSON.stringify(liveUser) !== JSON.stringify(selectedUser)) {
            setSelectedUser(liveUser);
        }
    }, [users, selectedUser]);


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
                <ActivePage
                    activeNavBarItem={activeNavBarItem}
                    selectedUser={selectedUser}
                    initialGenre={initialGenre}
                    setInitialGenre={setInitialGenre}
                    setActiveNavBarItem={setActiveNavBarItem}/>
            </div>
        </>
    )
}

export default App
