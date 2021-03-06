import  {useState, useCallback, useRef} from "react"
import {getApi} from "apis/apiProvider";
import {Log, Logger} from "utils/logger/logger";

export default  function (preSetLimit){
    const aboard = useRef(false);
    const [items, setItems] = useState(null)

    const getLink = useCallback(to => `/records/genres/${to}`, [])

    const updateItems = useCallback(data => {
        setItems(data.map(genre => ({
            title: genre.name,
            link:  getLink(genre.name)
        })))
    }, [setItems, getLink])

    const fetchGenres = useCallback((limit = preSetLimit) => {
        aboard.current = false;
        (async () =>{
            try{
                const { callQuery, queries } = getApi("UserAssets");
                const query = queries.getGenresListQl;
                const response = await callQuery(query, null , {limit}, true)
                if(response.errors){
                    throw new Error(response.errors.map(error => error.message).join(" || "))
                } else {
                    if(!aboard.current)
                    updateItems(response.data.genres)
                }
            } catch(error){
                Logger.push(Log.Error(
                    ["hooks", "fetch genres list"],
                    "Can't fetch genre list from server" + error.message,
                    error
                ))
            }

        })()
    }, [updateItems, preSetLimit, aboard])

    return [items, fetchGenres, aboard]
}