const filterBooksPromise = require('./promise2.js');

const executeTasks = async () => {
    try {
        const result1 =  await filterBooksPromise(true, 50);
        console.log(result1);
    } catch (error) {
        console.log(error.message);
    }

    try {
        const result2 = await filterBooksPromise(false, 250);
        console.log(result2);
    } catch (error) {
        console.log(error.message);
    }

    try {
        const result3 = await filterBooksPromise(true, 30);
        console.log(result3);
    } catch (error) {
        console.log(error.message);
    }
};

executeTasks();