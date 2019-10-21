export interface TimeEntry {
    date:string,
    customer: string,
    employee: string,
    hours: string,
    comment: string 

}
const createTimeEntry = (row:any):TimeEntry => ({
    date: row[0],
    customer: row[1],
    employee: row[3],
    hours: row[4],
    comment: row[5] 
})

export default createTimeEntry;