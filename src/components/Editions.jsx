import {Section} from "./Section.jsx";

function Edition(props){
    const {edition} = props;

    return<>
        <div>
            <img src={edition.imgURL}/>
            <div>Format: {edition.format}</div>
            <div>Print Year: {edition.printYear}</div>
            <div>Number in collection: {edition.numberInCollection}</div>
        </div>
    </>
}

export function Editions(props){
    const {editions} = props;

    if(!editions.length || editions.length === 0){
       return <div>No editions found</div>;
    }

    return<>
        <Section>
            {editions?.map(ed => <div key={ed.id}>
                <Edition edition={ed}/>
            </div>)}
        </Section>
    </>
}