const createTimeEntry = (row) => ({
    date: row[0],
    customer: row[1],
    employee: row[3],
    hours: row[4],
    comment: row[5] 
})

export default createTimeEntry;