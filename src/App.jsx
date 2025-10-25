import 'normalize.css'
import './App.css'
import 'react-tabs/style/react-tabs.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {ComicPage} from "./pages/ComicPage.jsx";
import {HomePage} from "./pages/HomePage.jsx";
import {COMIC_DATA} from "./data/data.js";

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
                </TabList>

                <TabPanel>
                    <HomePage/>
                </TabPanel>
                <TabPanel>
                    <ComicPage comics={COMIC_DATA}/>
                </TabPanel>
            </Tabs>
        </>
    )
}

export default App
