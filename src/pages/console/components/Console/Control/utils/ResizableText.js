import React, {useCallback, useState} from "react";
import "./resizeble-text.js.scss"

const ResizableText = ({children}) => {
    const [aspect, setAspect] = useState(null)

    const updateAspect = useCallback( ref =>{
        if(!ref) return;
        const wrapper = ref.closest(".control-mapping__wrapper");
        if(!wrapper) return;
        const rect =wrapper.getBoundingClientRect()
        if(rect.width  > rect.height * 1.2){
            setAspect("horizontal")
        } else {
            setAspect("vertical")
        }
    }, [setAspect])

    return (
        <div ref={updateAspect} className={"resizable " + aspect || ""}>
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 100 ${(aspect === "horizontal") ? 25 : 50}`}
                preserveAspectRatio="xMinYMin meet">
                <foreignObject width="100%" height="100%" xmlns="http://www.w3.org/1999/xhtml">
                    <div className={"resizable__container"} xmlns="http://www.w3.org/1999/xhtml" >
                        {children}
                    </div>
                </foreignObject>
            </svg>
        </div>
    )
}

export default ResizableText;