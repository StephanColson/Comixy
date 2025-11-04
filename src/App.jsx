import 'normalize.css'
import './App.css'
import 'react-tabs/style/react-tabs.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-pagination/assets/index.css';
import './api/firebase.js';
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {ComicPage} from "./pages/ComicPage.jsx";
import {HomePage} from "./pages/HomePage.jsx";
import {COMIC_DATA} from "./data/data.js";
import {ComicFromDB} from "./pages/ComicFromDB.jsx";

function App() {
    return (
        <>
            <Tabs>
                <TabList>
                    <Tab>
                        Home
                    </Tab>
                    <Tab>
                        Comic shelf
                    </Tab>
                    <Tab>
                        Comic Database Test
                    </Tab>
                </TabList>

                <TabPanel>
                    <HomePage comics={COMIC_DATA}/>
                </TabPanel>
                <TabPanel>
                    <ComicPage/>
                </TabPanel>
                <TabPanel>
                    <ComicFromDB/>
                </TabPanel>
            </Tabs>
        </>
    )
}

export default App
