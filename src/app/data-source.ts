/**
    *Sample data
*/

import * as faker from 'ng-faker';

export let sampleData = [
];
let j = 1;
for (let i = 0; i < 300; i++) {
    let data = {
        taskID: j++,
        assignee: faker.name.firstName(),
        email: faker.internet.email(),
        progress: faker.random.number({
            'min': 0,
            'max': 100
        }),
        duration: faker.random.number({
            'min': 0,
            'max': 5
        }),
        priority: 'Normal',
        approved: false,
        subtasks: [
            {
                taskID: j++, assignee: 'Plan timeline', email: faker.internet.email(),
                duration: faker.random.number({
                    'min': 0,
                    'max': 5
                }), progress: faker.random.number({
                    'min': 0,
                    'max': 100
                }), priority: 'Normal', approved: false
            },
            {
                taskID: j++, assignee: 'Plan budget', email: faker.internet.email(),
                duration: faker.random.number({
                    'min': 0,
                    'max': 5
                }), progress: faker.random.number({
                    'min': 0,
                    'max': 100
                }), priority: 'Low', approved: true
            },
            {
                taskID: j++, assignee: 'Allocate resources', email: faker.internet.email(),
                duration: faker.random.number({
                    'min': 0,
                    'max': 5
                }), progress: faker.random.number({
                    'min': 0,
                    'max': 100
                }), priority: 'Critical', approved: false
            },]
    }
    sampleData.push(data);
}
