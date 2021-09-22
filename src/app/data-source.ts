/**
    *Sample data
*/

import * as faker from 'ng-faker';

export let sampleData1 = [
];
let j = 1;
for (let i = 0; i < 1000; i++) {
    let data = {
        taskID: j++,
        taskName: faker.name.firstName(),
        startDate: new Date('02/03/2017'),
        endDate: new Date('02/07/2017'),
        progress: 100,
        duration: 5,
        priority: 'Normal',
        approved: false,
        subtasks: [
            {
                taskID: j++, taskName: 'Plan timeline', startDate: new Date('02/03/2017'),
                endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Normal', approved: false
            },
            {
                taskID: j++, taskName: 'Plan budget', startDate: new Date('02/03/2017'),
                endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Low', approved: true
            },
            {
                taskID: j++, taskName: 'Allocate resources', startDate: new Date('02/03/2017'),
                endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Critical', approved: false
            },]
    }
    sampleData1.push(data);
}
