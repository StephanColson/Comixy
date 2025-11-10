import 'normalize.css'
import './App.css'
import 'react-tabs/style/react-tabs.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-pagination/assets/index.css';
import './api/firebase.js';
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {ComicPage} from "./pages/ComicPage.jsx";
import {HomePage} from "./pages/HomePage.jsx";
import {useComicCollectionData} from "./api/comicInfo.js";

function App() {
    const {comics, loading, error} = useComicCollectionData();
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
                    <HomePage comics={comics || []}/>
                </TabPanel>
                <TabPanel>
                    <ComicPage comics={comics || []}/>
                </TabPanel>
            </Tabs>
        </>
    )
}

export default App
