import React, {useContext} from "react";
import {Button} from "../../../../components";
import {FilterContext} from "../../../../widgets/Filter/state";
import {pickBy, get, isEmpty} from 'lodash';


function ClearFilter() {
    const currentFilterContext = useContext(FilterContext);
    function reset() {
         const filter = currentFilterContext.filter;
         const must = pickBy(get(filter, 'must', {}), x => !isEmpty(x));
         const must_not = pickBy(get(filter, 'must_not', {}), x => !isEmpty(x));

        [...Object.keys(must), ...Object.keys(must_not)].forEach(key =>{
            currentFilterContext.setFullField(key, [])
        })
    }
    return <>
        <Button onClick={reset} look="primaryOutline">Reset</Button>
    </>
}

export default ClearFilter;