
//project status 
export enum ProjectStatus {
    Active
    ,Finished
}


//project type
export class Project{
    constructor( 
        public id: string
        , public title: string
        , public description: string
        , public monday: number
        , public status: ProjectStatus.Active | ProjectStatus.Finished  
        )
        {
    }
}

