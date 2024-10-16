import { PropsWithChildren } from "react";

export default function Grid({children, sm, md, lg, gap, def, className}: PropsWithChildren<Grid>){
    return(
        <div className={`grid col_def_${def} ${className}`} style={{gap: gap}}>
            {children}
        </div>
    )
}