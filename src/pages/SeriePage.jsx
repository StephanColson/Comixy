import {Series} from "../components/Series.jsx";

export function SeriePage(props){
    const {series} = props;

    return <>
        <h2 className="text-center">Catalog of series!</h2>
        <div>
            <Series series={series}/>
        </div>
    </>
}