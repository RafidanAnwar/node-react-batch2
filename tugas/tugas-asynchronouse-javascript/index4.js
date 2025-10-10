const filterCarsPromise = require('./promise3.js');

const runAllFilters = async () => {
    console.log("Mencari mobil...\n");

    await runFilter('black', 2019);
    await runFilter('silver', 2017);
    await runFilter('grey', 2019);
    await runFilter('grey', 2018);
    await runFilter('black', 2020);
};

const runFilter = async (color, year) => {
    try {
        const result = await filterCarsPromise(color, year);
        console.log(result);
    } catch (error) {
        console.log(error.message);
    }
};

runAllFilters();