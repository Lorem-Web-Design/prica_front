type BodegaControll = {
    image: string;
    isParent: boolean;
    name: string;
    parentId: string;
  }

export default class FolderControll {
    folder: BodegaControll;

    constructor(folder: BodegaControll){
        this.folder = folder;
    }

    get stateCopy():BodegaControll{
        return(
            JSON.parse(JSON.stringify(this.folder))
        )
    }
}