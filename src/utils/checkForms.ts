
type checkType = {
    name: string
    type: File | string
}
export default class {
    object: any;
    constructor(...args: any){
        this.object = args[0];
    }
    checkEmpty(...args: checkType[]){
        let errors:string[] = [];
        for (const item of args){
            if(item.type === 'string'){
                try{
                    if(this.object[item.name].trim() === "" ){
                        errors.push(item.name);
                    }
                }catch(err){
                    console.log(err)
                    console.log(item)
                }
            }
        } 
        return errors;
    }
}