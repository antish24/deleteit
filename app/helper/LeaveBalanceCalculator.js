const ethiopianDate=require('ethiopian-date')

function FindLeaveBalance(date){
    const year=(new Date(date).getFullYear())
    const month=(new Date(date).getMonth()+1)
    const day=(new Date(date).getDate())

    const [etYear,etMonth,etDay]=ethiopianDate.toEthiopian(year, month, day)

    let leftDays=(360-(30*((etMonth===11)?0:etMonth>11?1:etMonth+1)+etDay-1))
    let balance=Math.ceil((leftDays * 16) / 365);
    let balanceYear=etMonth>10?etYear+1:etYear

    // return (`D:${leftDays} ,B:${balance}, Y:${balanceYear}`)
    return ({balance:balance,balanceYear:new Date(ethiopianDate.toGregorian(balanceYear,1,1))})
}

function CalLeaveBalance(startDate,year){
    const setYear=(new Date(startDate).getFullYear())
    const setMonth=(new Date(startDate).getMonth()+1)
    const setDay=(new Date(startDate).getDate())

    const cyear=(new Date(year).getFullYear())
    const cmonth=(new Date(year).getMonth()+1)
    const cday=(new Date(year).getDate())

    console.log(cyear,setYear)
    let balance=16 + Math.floor(((cyear - setYear) / 2));
    
    console.log ({balance:balance,balanceYear:new Date(year)})
    return ({balance:balance,balanceYear:new Date(year)})
}

module.exports = { FindLeaveBalance,CalLeaveBalance };