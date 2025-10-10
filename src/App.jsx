import 'normalize.css'
import './App.css'
import 'react-tabs/style/react-tabs.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {ARTIST_DATA, AUTHOR_DATA, COMIC_DATA, SERIE_DATA} from "./data/data.js";
import {SeriePage} from "./pages/SeriePage.jsx";
import {ComicPage} from "./pages/ComicPage.jsx";
import {HomePage} from "./pages/HomePage.jsx";

function App() {
    return (
        <>
            <Tabs>
                <TabList>
                    <Tab>
                        Home
                    </Tab>
                    <Tab>
                        Series
                    </Tab>
                    <Tab>
                        Comics
                    </Tab>
                </TabList>

                <TabPanel>
                    <HomePage/>
                </TabPanel>
                <TabPanel>
                    <SeriePage series={SERIE_DATA}/>
                </TabPanel>
                <TabPanel>
                    <ComicPage comics={COMIC_DATA}
                               authors={AUTHOR_DATA}
                               artists={ARTIST_DATA}
                               publishers={COMIC_DATA}/>
                </TabPanel>
            </Tabs>
        </>
    )
}

export default App
